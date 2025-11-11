export type CourrierField = {
    id: string;
    label: string;
    extracted?: string;
};

export type Courrier = {
    id: string;
    created_at: string;
    fields: CourrierField[];
    price: number; // stocké en numeric/float dans Supabase
    amount_cents: number; // ajouté pour cohérence avec le reste de l'app
    title: string;
    description: string | null;
    google_doc_url: string | null;
    categorie: string | null;
};
