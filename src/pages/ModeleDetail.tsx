// src/pages/ModeleDetail.tsx
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Courrier, CourrierField } from "@/types/courrier";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils"; // si tu as un util cn; sinon supprime cn et les appels
import { useNavigate } from "react-router-dom";
import LoaderOverlay from "@/components/LoaderOverlay";
const EUR = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

function stripBrackets(s?: string) {
    if (!s) return "";
    // supprime les crochets [ ... ] autour du placeholder
    return s.replace(/^\[|\]$/g, "");
}

function guessType(field: CourrierField): "text" | "date" | "number" | "textarea" {
    const src = `${field.id} ${field.label}`.toLowerCase();

    if (src.includes("date")) return "date";
    if (src.includes("nombre") || src.includes("montant") || src.includes("numéro") || src.includes("numero")) {
        // nombre / montant / numero => number
        return "number";
    }
    if (src.includes("adresse") || src.includes("signature") || field.label.length > 70) {
        return "textarea";
    }
    return "text";
}

export default function ModeleDetail() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<Courrier | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // état du formulaire (clé = id du champ ; valeur = saisie utilisateur)
    const [form, setForm] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetch = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("courrier_template")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                setErr(error.message);
                setData(null);
            } else {
                setData(data as Courrier);

                // initialise le form avec des valeurs vides (ou placeholders si tu préfères)
                const initial: Record<string, string> = {};
                try {
                    const fields: CourrierField[] = (data as any).fields ?? [];
                    for (const f of fields) initial[f.id] = "";
                } catch {
                    // noop
                }
                setForm(initial);
            }

            setIsLoading(false);
        };

        fetch();
    }, [id]);

    // --- helpers ---
    const markFieldError = (fid: string) => {
        setErrorFields((prev) => ({ ...prev, [fid]: true }));
    };
    const clearFieldError = (fid: string) => {
        setErrorFields((prev) => {
            const copy = { ...prev };
            delete copy[fid];
            return copy;
        });
    };
    const fields: CourrierField[] = useMemo(() => {
        try {
            return Array.isArray(data?.fields) ? (data?.fields as CourrierField[]) : [];
        } catch {
            return [];
        }
    }, [data]);

    const onChangeField = (fid: string, value: string) => {
        setForm((prev) => ({ ...prev, [fid]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (!data) return;
        // vérifie tous les champs
        const newErrors: Record<string, boolean> = {};
        for (const [fid, val] of Object.entries(form)) {
            if (!val || val.trim() === "") newErrors[fid] = true;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrorFields(newErrors);
            // scroll jusqu’au premier champ manquant
            const first = Object.keys(newErrors)[0];
            document.getElementById(first)?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }
        setSubmitting(true);
        setErrorFields({});
        try {
            console.log("Submitting form:", form);

            const insertPayload = {
                template_id: data.id,       // <- le modèle sélectionné
                filled_json: form,          // <- l'objet { champId: "valeur", ... } sera stocké en jsonb
                preview_url: null,          // <- optionnel, laisse null avant génération
                pdf_url: null,              // <- optionnel, laisse null avant génération
            };

            const { data: created, error: insertError } = await supabase
                .from("courrier_submissions") // <-- nom exact de ta table
                .insert(insertPayload)
                .select("id")                // on ne récupère que l'id pour la suite
                .single();

            if (insertError) {
                console.error(insertError);
                alert("Échec de l’enregistrement de votre soumission.");
                setSubmitting(false);
                return;
            }

            const submissionId = created?.id as string;
            console.log("SUBMIT payload:", submissionId);
            // TODO : inserer dans submission 
            // Appeller mon endpoint avec l'id de la submission


            // Payload que tu pourras envoyer à ton service
            const payload = {
                id: submissionId,
            };

            // 👉 Intégration future : call ton endpoint de génération
            const BASE_URL = import.meta.env.VITE_API_BACK_URL
            const ENDPOINT = "/fill-courrier";
            const resp = await fetch(`${BASE_URL}${ENDPOINT}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await resp.json();
            // TODO: rediriger vers page de confirmation / téléchargement, etc.

            console.log("SUBMIT payload:", payload);
            // alert("Formulaire validé ! (voir console). Branche l’appel API quand tu es prêt.");
            navigate(`/soumission/${submissionId}`);

        } catch (e: any) {
            console.error(e);
            alert("Une erreur est survenue.");
        } finally {
            setSubmitting(false);
        }
    };

    if (err) return <p className="text-center text-red-600 mt-20">Erreur : {err}</p>;
    if (!data) return <p className="text-center mt-20">Aucun modèle trouvé.</p>;

    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-4 max-w-3xl">
            <LoaderOverlay visible={isLoading} label="Génération du courrier…" />
            <div aria-hidden={isLoading} className={isLoading ? "pointer-events-none opacity-0" : "opacity-90 transition-opacity"}>

                <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
                <p className="text-muted-foreground mb-6">{data.categorie}</p>
                <p className="text-lg font-semibold mb-8">{EUR.format(Number(data.amount_cents / 100))}</p>

                {data.description && <p className="mb-8">{data.description}</p>}

                <form onSubmit={onSubmit} className="space-y-6">
                    {fields.length === 0 && (
                        <p className="text-muted-foreground">Aucun champ pour ce modèle.</p>
                    )}
                    {fields.map((f) => {
                        const t = guessType(f);
                        const hasError = !!errorFields[f.id];

                        const commonProps = {
                            id: f.id,
                            name: f.id,
                            // A voir si je decide de garder le label AI generated ou directement le [exctraceted] qui est directement ce que Ines à mis dans le doc
                            placeholder: stripBrackets(f.extracted),
                            value: form[f.id] ?? "",
                            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                onChangeField(f.id, e.target.value);
                                if (e.target.value.trim() !== "") clearFieldError(f.id);
                            },
                            className: hasError
                                ? "border-red-500 focus-visible:ring-red-500"
                                : undefined,
                        };

                        return (
                            <div key={f.id} className="space-y-2">
                                <label
                                    htmlFor={f.id}
                                    className={`block text-sm font-medium ${hasError ? "text-red-600" : ""
                                        }`}
                                >
                                    {f.label}
                                    <span className="text-red-500 ml-1">*</span>

                                </label>

                                {t === "textarea" ? (
                                    <Textarea {...commonProps} className={cn("min-h-28")} />
                                ) : t === "date" ? (
                                    <Input {...commonProps} type="date" />
                                ) : t === "number" ? (
                                    <Input {...commonProps} type="number" step="any" />
                                ) : (
                                    <Input {...commonProps} type="text" />
                                )}
                                {hasError && (
                                    <p className="text-xs text-red-500">Champ requis</p>
                                )}
                            </div>
                        );
                    })}

                    <button
                        type="submit"
                        // disabled={submitting}
                        disabled={isLoading}
                        className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition disabled:opacity-50"
                    >
                        {submitting ? "Validation…" : "Valider"}
                    </button>
                </form>

                <p
                    className="inline-block mt-6 text-primary text-xs italic"
                >
                    Attention, pour le moment vos informations ne sont pas encore sauvegardé.                </p>
            </div>
        </div>
    );
}
