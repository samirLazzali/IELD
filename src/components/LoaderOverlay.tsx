// components/LoaderOverlay.tsx
import { useEffect } from "react";

type Props = { visible: boolean; label?: string; durationMs?: number };

export default function LoaderOverlay({ visible, label = "Préparation…", durationMs = 30000 }: Props) {
    // Empêche le scroll en arrière-plan
    useEffect(() => {
        if (!visible) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [visible]);

    if (!visible) return null;

    // Cercle: rayon 48 => circonférence ~ 301.59 (on l'utilise pour l'animation)
    const C = 2 * Math.PI * 48;

    return (
        <>
            {/* keyframes locales (une seule exécution, forwards) */}
            <style>{`
        @keyframes fillStroke {
          from { stroke-dashoffset: ${C}; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
            <div className="flex flex-col items-center min-h-screen pt-32 pb-20 container mx-auto px-4 max-w-3xl">
                {/* 
            <div
                className="fixed inset-0 z-[1000] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6"
                role="alertdialog"
                aria-live="assertive"
                aria-busy="true"
            > */}
                <div className="relative w-40 h-40">
                    {/* fond cercle */}
                    <svg viewBox="0 0 120 120" className="w-full h-full">
                        <circle cx="60" cy="60" r="48" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                        {/* progress: anim 60s, 1 seule fois, forwards */}
                        <circle
                            cx="60" cy="60" r="48"
                            stroke="hsl(var(--primary))"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={C}
                            strokeDashoffset={C}
                            style={{
                                transform: "rotate(-90deg)",
                                transformOrigin: "60px 60px",
                                animation: `fillStroke ${durationMs}ms linear 0s 1 forwards`,
                            }}
                        />
                    </svg>

                    {/* pourcentage optionnel calculé via CSS-only = non trivial; on garde simple */}
                </div>

                <div className="text-center">
                    <p className="text-base text-muted-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground/70">Cela peut prendre quelques minutes…</p>
                </div>
            </div>
        </>
    );
}
