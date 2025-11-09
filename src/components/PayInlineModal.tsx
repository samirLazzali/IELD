// src/components/PayInline.tsx
import { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export default function PayInline({
    submissionId,
    templateId,
    title,
    suggestedPrice,
}: {
    submissionId: string;
    templateId: string;
    title: string;
    suggestedPrice: number;
}) {
    return (
        <Elements stripe={stripePromise}>
            <InnerPaymentForm
                submissionId={submissionId}
                templateId={templateId}
                title={title}
                suggestedPrice={suggestedPrice}
            />
        </Elements>
    );
}

function InnerPaymentForm({
    submissionId,
    templateId,
    title,
    suggestedPrice,
}: {
    submissionId: string;
    templateId: string;
    title: string;
    suggestedPrice: number;
}) {
    const stripe = useStripe();
    const elements = useElements();

    // --- États du formulaire ---
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState<number>(suggestedPrice || 0);

    // --- Stripe Card state ---
    const [cardComplete, setCardComplete] = useState(false);
    const [cardErrorMsg, setCardErrorMsg] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [showErrors, setShowErrors] = useState(false);

    // --- Données dérivées ---
    const min = useMemo(() => Math.max(0, suggestedPrice || 0), [suggestedPrice]);
    const minCents = Math.round(min * 100);
    const cents = Math.round((amount || 0) * 100);
    const freeAllowed = min === 0;
    const paying = cents > 0;
    const belowMin = paying && !freeAllowed && cents < minCents;

    // --- Erreurs visuelles ---
    const firstNameError = showErrors && firstName.trim() === "";
    const lastNameError = showErrors && lastName.trim() === "";
    const emailValid = /^\S+@\S+\.\S+$/.test(email);
    const emailError = showErrors && !emailValid;
    const cardError = showErrors && paying && !cardComplete; // carte requise seulement si paiement > 0
    console.log(cents)
    const titlePayment = cents == 0 ? "Contribution libre" : "Montant minimum " + min.toFixed(2) + " €";
    console.log(titlePayment)

    const pay = async () => {
        setShowErrors(true);

        // Validation immédiate (sans dépendre d'un setState async)
        const errors = {
            firstName: firstName.trim() === "",
            lastName: lastName.trim() === "",
            email: paying && !emailValid,
            belowMin: paying && !freeAllowed && cents < minCents,
            card: paying && !cardComplete,
        };
        const hasErrors =
            errors.firstName || errors.lastName || errors.email || errors.belowMin || errors.card;

        if (hasErrors) return;

        try {
            setLoading(true);

            // --- CAS GRATUIT ---
            if (cents <= 0) {
                if (!freeAllowed) {
                    alert(`Ce modèle n'est pas gratuit (min ${min.toFixed(2)} €)`);
                    setLoading(false);
                    return;
                }
                const r = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/mark-free`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        submission_id: submissionId,
                        template_id: templateId,
                        title,
                        buyer_email: email || null,
                        buyer_first_name: firstName,
                        buyer_last_name: lastName,
                    }),
                });
                if (!r.ok) throw new Error(await r.text());
                window.location.reload();
                return;
            }

            // --- CAS PAYANT ---
            const r = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/create-payment-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    submission_id: submissionId,
                    template_id: templateId,
                    title,
                    amount_cents: cents,
                    buyer_email: email,
                    buyer_first_name: firstName,
                    buyer_last_name: lastName,
                }),
            });
            if (!r.ok) throw new Error(await r.text());
            const { client_secret } = await r.json();

            const card = elements?.getElement(CardElement);
            if (!stripe || !card) throw new Error("Stripe non prêt");

            const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card,
                    billing_details: {
                        email,
                        name: [firstName, lastName].filter(Boolean).join(" "),
                    },
                },
            });

            if (error) {
                // Remonte un message d'erreur carte si Stripe en donne un
                setCardErrorMsg(error.message || "Paiement refusé");
                alert(error.message || "Paiement refusé");
                return;
            }
            if (paymentIntent?.status === "succeeded") {
                window.location.reload();
            }
        } catch (err: any) {
            console.error(err);
            alert("Erreur lors du paiement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-2xl p-6 max-w-lg mx-auto shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-3 text-center">
                {titlePayment}
            </h2>
            <p className="text-sm text-muted-foreground mb-3 text-center">
                {/* Montant minimum : {min.toFixed(2)} € {freeAllowed ? "Vous pouvez mettre 0€ ou le montant que vous voulez" : ""} */}
                {freeAllowed ? "Vous pouvez mettre 0€ ou le montant que vous voulez" : ""}
            </p>

            {/* --- Prénom & Nom --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-5">
                <div>
                    <label className="text-sm block mb-1">
                        Prénom <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full border rounded-md px-3 py-2 ${firstNameError ? "border-red-500" : ""}`}
                    />
                    {firstNameError && <p className="text-xs text-red-600 mt-1">Champ requis</p>}
                </div>

                <div>
                    <label className="text-sm block mb-1">
                        Nom <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`w-full border rounded-md px-3 py-2 ${lastNameError ? "border-red-500" : ""}`}
                    />
                    {lastNameError && <p className="text-xs text-red-600 mt-1">Champ requis</p>}
                </div>
            </div>

            {/* --- Email --- */}
            <div className="mb-4">
                <label className="text-sm block mb-1">
                    Email {paying && <span className="text-red-600">*</span>}
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 ${emailError ? "border-red-500" : ""}`}
                    placeholder="prenom.nom@email.com"
                    autoComplete="email"
                />
                {emailError && <p className="text-xs text-red-600 mt-1">Email invalide</p>}
            </div>

            {/* --- Montant --- */}
            <div className="mb-4">
                <label className="text-sm block mb-1">Montant</label>
                <input
                    type="number"
                    min={0}
                    step="0.5"
                    value={Number.isNaN(amount) ? 0 : amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value || "0"))}
                    className={`w-full border rounded-md px-3 py-2 ${belowMin ? "border-red-500" : ""}`}
                />
                {belowMin && (
                    <p className="text-xs text-red-600 mt-1">
                        Le montant ne peut pas être inférieur à {min.toFixed(2)} €
                    </p>
                )}
            </div>

            {/* --- Carte Stripe --- */}

            <div className={`border rounded-md p-3 mb-2 ${cardError ? "border-red-500" : ""}`}>
                <CardElement
                    options={{ hidePostalCode: true }}
                    onChange={(ev) => {
                        setCardComplete(ev.complete);
                        setCardErrorMsg(ev.error ? ev.error.message ?? null : null);
                    }}
                />
            </div>
            {/* Afficher message d’erreur carte :
          - si la carte n’est pas complète après clic (required),
          - ou si Stripe renvoie une erreur (ex: numéro invalide) */}
            {cardError && <p className="text-xs text-red-600 mb-2">Carte requise</p>}
            {!!cardErrorMsg && (
                <p className="text-xs text-red-600 mb-2">{cardErrorMsg}</p>
            )}

            <button
                onClick={pay}
                disabled={loading || (paying && !stripe)}
                className="w-full py-3 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition disabled:opacity-50"
            >
                {loading ? "Traitement..." : cents <= 0 ? "Continuer gratuitement" : "Payer"}
            </button>

            <p className="mt-4 text-xs text-center text-muted-foreground">
                Vos informations ne sont utilisées que pour générer le reçu et améliorer le service.
            </p>
        </div>
    );
}
