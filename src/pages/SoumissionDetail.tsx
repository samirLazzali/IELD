import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import type { Courrier } from "@/types/courrier";
import type { CourrierSubmissions } from "@/types/courrier_submissions";

const EUR = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

const POLL_MS = 2500;  // intervalle de polling pour attendre preview/pdf
const POLL_MAX = 12;   // ~30s max

export default function SoumissionDetail() {
    const { id } = useParams<{ id: string }>();

    const [subm, setSubm] = useState<CourrierSubmissions | null>(null);
    const [tpl, setTpl] = useState<Courrier | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const pollCount = useRef(0);
    const [polling, setPolling] = useState(false);

    // 1) Charge la soumission
    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        const fetchSubmission = async () => {
            setLoading(true);
            setErr(null);

            const { data, error } = await supabase
                .from("courrier_submissions")
                .select("*")
                .eq("id", id)
                .single();

            if (cancelled) return;

            if (error) {
                setErr(error.message);
                setLoading(false);
                return;
            }

            setSubm(data as CourrierSubmissions);
            setLoading(false);
        };

        fetchSubmission();
        return () => { cancelled = true; };
    }, [id]);

    // 2) Charge le template associé dès qu’on a la soumission
    useEffect(() => {
        if (!subm?.template_id) return;
        let cancelled = false;

        const fetchTemplate = async () => {
            const { data, error } = await supabase
                .from("courrier_template")
                .select("id, title, price, description, google_doc_url, categorie, created_at, fields")
                .eq("id", subm.template_id)
                .single();

            if (cancelled) return;

            if (error) {
                setErr(error.message);
                return;
            }
            setTpl(data as Courrier);
        };

        fetchTemplate();
        return () => { cancelled = true; };
    }, [subm?.template_id]);

    // 3) Polling pour récupérer preview/pdf si génération asynchrone
    useEffect(() => {
        if (!subm) return;
        if (subm.preview_url && subm.pdf_url) {
            setPolling(false);
            return;
        }

        // si pas prêt, tente un polling
        setPolling(true);
        const iv = setInterval(async () => {
            pollCount.current += 1;
            if (pollCount.current > POLL_MAX) {
                clearInterval(iv);
                setPolling(false);
                return;
            }

            const { data, error } = await supabase
                .from("courrier_submissions")
                .select("id, preview_url, pdf_url")
                .eq("id", subm.id)
                .single();

            if (error) {
                // on stoppe silencieusement (on gardera l’état actuel)
                clearInterval(iv);
                setPolling(false);
                return;
            }

            if (data?.preview_url || data?.pdf_url) {
                setSubm((prev) => prev ? { ...prev, preview_url: data.preview_url, pdf_url: data.pdf_url } : prev);
            }

            if (data?.preview_url && data?.pdf_url) {
                clearInterval(iv);
                setPolling(false);
            }
        }, POLL_MS);

        return () => clearInterval(iv);
    }, [subm]);

    const priceStr = useMemo(
        () => (tpl ? EUR.format(Number(tpl.price ?? 0)) : ""),
        [tpl]
    );

    if (loading) return <div className="container mx-auto px-4 pt-32 pb-20"><p className="text-center">Chargement…</p></div>;
    if (err) return <div className="container mx-auto px-4 pt-32 pb-20"><p className="text-center text-red-600">Erreur : {err}</p></div>;
    if (!subm) return <div className="container mx-auto px-4 pt-32 pb-20"><p className="text-center">Soumission introuvable.</p></div>;

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {tpl?.title ?? "Modèle"}
                </h1>
                {tpl?.categorie && (
                    <p className="text-muted-foreground mb-4">{tpl.categorie}</p>
                )}
                {tpl && (
                    <p className="text-lg font-semibold mb-8">{priceStr}</p>
                )}

                {/* Preview */}
                {/* <div className="border rounded-xl p-4 md:p-6 shadow-sm"> */}
                {!subm.preview_url ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="animate-pulse h-56 w-full max-w-xl bg-muted rounded-md mb-4" />
                        <p className="text-sm text-muted-foreground">
                            Génération de l’aperçu en cours…
                        </p>
                        {polling && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Cela peut prendre quelques secondes.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <img
                            src={subm.preview_url}
                            alt="Aperçu du document"
                            className="w-full max-w-xl rounded-md border"
                            loading="eager"
                        />
                    </div>
                )}
                {/* </div> */}

                {/* Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    {subm.pdf_url ? (
                        <a
                            href={subm.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
                        >
                            Télécharger le PDF
                        </a>
                    ) : (
                        <button
                            disabled
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                        >
                            PDF en préparation…
                        </button>
                    )}

                    {tpl?.google_doc_url && (
                        <a
                            href={tpl.google_doc_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border hover:bg-accent transition"
                        >
                            Voir le document source
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
