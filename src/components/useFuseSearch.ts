import Fuse from "fuse.js";
import type { Courrier } from "@/types/courrier";

export function stripAccents(s: string) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function filterModelesFuzzy(items: Courrier[], query: string): Courrier[] {
    const q = query.trim();
    if (q.length < 3) return items; // ✅ ne recherche qu’à partir de 3 caractères

    const fuse = new Fuse(items, {
        includeScore: true,
        threshold: 0.35,       // 0 strict, 1 tolérant (0.3–0.4 = bon équilibre)
        ignoreLocation: true,
        distance: 80,
        minMatchCharLength: 2,
        keys: [
            { name: "title", weight: 0.6 },
            { name: "categorie", weight: 0.25 },
            { name: "description", weight: 0.15 },
        ],
        getFn: (obj, path) => {
            // @ts-ignore
            const v = Fuse.config.getFn(obj, path);
            if (typeof v === "string") return stripAccents(v.toLowerCase());
            return v;
        },
    });

    const normQ = stripAccents(q.toLowerCase());
    return fuse.search(normQ).map((r) => r.item);
}




// search.ts search fuzz opti si > 1000 items
// import Fuse from "fuse.js";
// import type { Courrier } from "@/types/courrier";

// // search.ts
// import Fuse from "fuse.js";
// import type { Courrier } from "@/types/courrier";

// export function stripAccents(s: string) {
//     return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
// }

// export function filterModelesFuzzy(items: Courrier[], query: string): Courrier[] {
//     const q = query.trim();
//     if (q.length < 3) return items; // ✅ ne recherche qu’à partir de 3 caractères

//     const fuse = new Fuse(items, {
//         includeScore: true,
//         threshold: 0.35,       // 0 strict, 1 tolérant (0.3–0.4 = bon équilibre)
//         ignoreLocation: true,
//         distance: 80,
//         minMatchCharLength: 2,
//         keys: [
//             { name: "title", weight: 0.6 },
//             { name: "categorie", weight: 0.25 },
//             { name: "description", weight: 0.15 },
//         ],
//         getFn: (obj, path) => {
//             // @ts-ignore
//             const v = Fuse.config.getFn(obj, path);
//             if (typeof v === "string") return stripAccents(v.toLowerCase());
//             return v;
//         },
//     });

//     const normQ = stripAccents(q.toLowerCase());
//     return fuse.search(normQ).map((r) => r.item);
// }
