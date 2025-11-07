export type CourrierSubmissions = {
    id: string;
    created_at: string;
    template_id: string;
    filled_json: Record<string, string>;
    preview_url: string | null;
    pdf_url: string | null;
};
