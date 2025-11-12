// src/components/PayInline.tsx
import { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export default function PayInline({
    submissionId,
    // templateId,
    title,
    sugestedAmountCents,
    // priceStr
}: {
    submissionId: string;
    // templateId: string;
    title: string;
    sugestedAmountCents: number;
    // priceStr: string;

}) {
    return (
        <Elements stripe={stripePromise}>
            <InnerPaymentForm
                submissionId={submissionId}
                title={title}
                sugestedAmountCents={sugestedAmountCents}
            // priceStr={priceStr}
            />
        </Elements>
    );
}

function InnerPaymentForm({
    submissionId,
    title,
    sugestedAmountCents,
    // priceStr
}: {
    submissionId: string;
    // templateId: string;
    title: string;
    sugestedAmountCents: number;
    // priceStr: string;

}) {
    const stripe = useStripe();
    const elements = useElements();

    // --- États du formulaire ---
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const sugestedAmountFloat = sugestedAmountCents / 100;
    const [amountFloat, setAmount] = useState<number>(sugestedAmountFloat);

    // --- Stripe Card state ---
    const [cardComplete, setCardComplete] = useState(false);
    const [cardErrorMsg, setCardErrorMsg] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [showErrors, setShowErrors] = useState(false);
    const navigate = useNavigate();

    // --- Données dérivées ---
    const min = useMemo(() => Math.max(0, sugestedAmountFloat || 0), [sugestedAmountFloat]); // min en €
    const minCents = Math.round(min * 100);
    // const cents = Math.round((amount || 0) * 100);
    const cents = sugestedAmountCents // remplacer la var cents
    const freeAllowed = min === 0;

    const paying = cents > 0;
    const belowMin = paying && !freeAllowed && (amountFloat * 100) < minCents;

    // Règle d'affichage de la carte :
    // - min > 0 -> toujours afficher
    // - min = 0 -> afficher seulement si l'utilisateur saisit un montant > 0
    const showCard = min > 0 || paying || amountFloat > 0;

    // --- Erreurs visuelles ---
    const firstNameError = showErrors && firstName.trim() === "";
    const lastNameError = showErrors && lastName.trim() === "";
    const emailValid = /^\S+@\S+\.\S+$/.test(email);
    const emailError = showErrors && !emailValid;

    // Carte requise uniquement si on tente un paiement > 0 ET que la carte est affichée
    const cardError = showErrors && paying && showCard && !cardComplete;

    // Titre : basé sur le min de BDD (pas sur le montant saisi)
    const titlePayment =
        min > 0 ? `Montant minimum ${min.toFixed(2)} €` : "Contribution libre";

    const pay = async () => {
        setShowErrors(true);

        // Validation immédiate
        const errors = {
            firstName: firstName.trim() === "",
            lastName: lastName.trim() === "",
            email: paying && !emailValid,
            belowMin: paying && !freeAllowed && cents < minCents,
            // Carte requise seulement si on est dans un flux payant valide (pas bloqué par belowMin)
            card: paying && !belowMin && showCard && !cardComplete,
        };
        const hasErrors =
            errors.firstName ||
            errors.lastName ||
            errors.email ||
            errors.belowMin ||
            errors.card;

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
                const r = await fetch(`${import.meta.env.VITE_API_STRIPE_URL}/payments/pay`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: title,
                        submission_id: submissionId,
                        // template_id: templateId,
                        amount: 0, // cent ? 
                        buyer_email: email,
                        buyer_name: firstName + " " + lastName,
                    }),
                });
                console.log(r);
                if (!r.ok) throw new Error(await r.text());
                navigate(`/merci`);

                window.location.reload();
                return;
            }

            // --- CAS PAYANT ---
            const r = await fetch(`${import.meta.env.VITE_API_STRIPE_URL}/payments/pay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    submission_id: submissionId,
                    // template_id: templateId,
                    title: title,
                    amount: amountFloat * 100,
                    buyer_email: email,
                    buyer_name: firstName + " " + lastName,

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
            console.log(paymentIntent);

            if (error) {
                setCardErrorMsg(error.message || "Paiement refusé");
                alert(error.message || "Paiement refusé");
                return;
            }
            if (paymentIntent?.status === "succeeded") {
                navigate(`/merci`);
                console.log("Paiement réussi !");
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
                {freeAllowed
                    ? "Vous pouvez mettre 0 € ou le montant que vous voulez."
                    : "Saisissez un montant au moins égal au minimum indiqué."}
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
                        placeholder="John"
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full border rounded-md px-3 py-2 ${firstNameError ? "border-red-500" : ""
                            }`}
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
                        placeholder="Doe"
                        onChange={(e) => setLastName(e.target.value)}
                        className={`w-full border rounded-md px-3 py-2 ${lastNameError ? "border-red-500" : ""
                            }`}
                    />
                    {lastNameError && <p className="text-xs text-red-600 mt-1">Champ requis</p>}
                </div>
            </div>

            {/* --- Email (requis uniquement si paying) --- */}
            <div className="mb-4">
                <label className="text-sm block mb-1">
                    Email {paying && <span className="text-red-600">*</span>}
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 ${emailError ? "border-red-500" : ""
                        }`}
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
                    value={amountFloat}
                    onChange={(e) => {
                        const v = parseFloat(e.target.value || "0");
                        setAmount(v);
                        // si l'utilisateur repasse à 0 dans un contexte gratuit, nettoyer les erreurs carte
                        if ((min === 0) && (v <= 0)) {
                            setCardErrorMsg(null);
                            setCardComplete(false);
                        }
                    }}
                    className={`w-full border rounded-md px-3 py-2 ${belowMin ? "border-red-500" : ""
                        }`}
                />
                {belowMin && (
                    <p className="text-xs text-red-600 mt-1">
                        Le montant ne peut pas être inférieur à {min.toFixed(2)} €
                    </p>
                )}
            </div>

            {/* --- Carte Stripe (affichage conditionnel) --- */}
            {showCard && (
                <>
                    <div className={`border rounded-md p-3 mb-2 ${cardError ? "border-red-500" : ""}`}>
                        <CardElement
                            options={{ hidePostalCode: true }}
                            onChange={(ev) => {
                                setCardComplete(ev.complete);
                                setCardErrorMsg(ev.error ? ev.error.message ?? null : null);
                            }}
                        />
                    </div>
                    {cardError && <p className="text-xs text-red-600 mb-2">Carte requise</p>}
                    {!!cardErrorMsg && <p className="text-xs text-red-600 mb-2">{cardErrorMsg}</p>}
                </>
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
