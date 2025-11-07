// src/components/PayWhatYouWant.tsx
// plus utilisé ? 
import { useMemo, useState } from "react";

type Props = {
    submissionId: string;
    templateId: string;
    defaultPrice: number; // ex: 7.5
    title: string;
    onFreeSuccess?: () => void;
};

const EUR = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default function PayWhatYouWant({
    submissionId,
    templateId,
    defaultPrice,
    title,
    onFreeSuccess,
}: Props) {
    const [amount, setAmount] = useState<number>(defaultPrice || 0);
    const [loading, setLoading] = useState(false);
    const minDisplay = useMemo(() => Math.max(0, defaultPrice || 0), [defaultPrice]);
    const tooLow = amount < defaultPrice && amount > 0;

    const handlePay = async () => {
        try {
            setLoading(true);

            if (!amount || amount <= 0) {
                // Montant 0€ : on valide gratuitement côté backend
                const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/mark-free`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        submission_id: submissionId,
                        template_id: templateId,
                        amount_cents: 0,
                        title,
                    }),
                });
                if (!resp.ok) throw new Error(await resp.text());
                onFreeSuccess?.();
                // Redirige vers la même page (rafraîchir), ou afficher un toast
                window.location.reload();
                return;
            }

            // Paiement Stripe
            const amount_cents = Math.round(amount * 100);
            const success_url = `${window.location.origin}/soumission/${submissionId}?status=success`;
            const cancel_url = `${window.location.origin}/soumission/${submissionId}?status=cancel`;

            const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    submission_id: submissionId,
                    template_id: templateId,
                    amount_cents,
                    title,
                    success_url,
                    cancel_url,
                }),
            });
            if (!resp.ok) throw new Error(await resp.text());
            const { url } = await resp.json();
            window.location.href = url; // redirection vers Stripe Checkout
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l’initiation du paiement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-xl p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-2">Contribution libre</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Montant conseillé : {EUR.format(minDisplay)}. Vous pouvez soutenir davantage, ou continuer gratuitement (0 €).
            </p>

            <div className="flex items-center gap-3">
                <input
                    type="number"
                    step="0.5"
                    min={0}
                    value={Number.isNaN(amount) ? 0 : amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value || "0"))}
                    className="w-32 border rounded-md px-3 py-2"
                />
                <span className="text-sm text-muted-foreground">EUR</span>

                <button
                    onClick={handlePay}
                    disabled={loading}
                    className="ml-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition disabled:opacity-50"
                >
                    {loading ? "Veuillez patienter…" : amount > 0 ? "Payer" : "Continuer gratuitement"}
                </button>
            </div>

            {tooLow && (
                <p className="mt-2 text-xs text-amber-600">
                    Vous avez saisi un montant inférieur au prix conseillé ({EUR.format(minDisplay)}). C’est possible, merci pour votre contribution.
                </p>
            )}
            {amount === 0 && (
                <p className="mt-2 text-xs text-green-700">
                    Vous pouvez continuer gratuitement (0 €). Merci d’utiliser ce service.
                </p>
            )}
        </div>
    );
}
