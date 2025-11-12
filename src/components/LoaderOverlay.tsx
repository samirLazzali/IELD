// components/LoaderOverlay.tsx
import { useEffect } from "react";

type Props = {
    visible: boolean;
    label?: string;
    durationMs?: number;
};

export default function LoaderOverlay({
    visible,
    label = "Génération du courrier…",
    durationMs = 60000,
}: Props) {
    useEffect(() => {
        if (!visible) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6"
            role="alertdialog"
            aria-live="assertive"
            aria-busy="true"
        >
            <div className="relative w-40 h-40">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                    {/* cercle de fond */}
                    <circle
                        cx="60"
                        cy="60"
                        r="48"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* cercle progressif */}
                    <circle
                        cx="60"
                        cy="60"
                        r="48"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        className="loader-ring"
                        // permet de changer la durée sans recréer les keyframes
                        style={{ animationDuration: `${durationMs}ms` }}
                    />
                </svg>
            </div>

            <div className="text-center">
                <p className="text-base text-muted-foreground">{label}</p>
                <p className="text-sm text-muted-foreground/70">
                    Cela peut prendre quelques minutes…
                </p>
            </div>
        </div>
    );
}
