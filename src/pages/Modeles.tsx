import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/lib/supabaseClient";
import type { Courrier } from "@/types/courrier";

const EUR = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

function useDebouncedValue<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  const t = useRef<number | undefined>();
  useEffect(() => {
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setV(value), delay);
    return () => window.clearTimeout(t.current);
  }, [value, delay]);
  return v;
}

const Modeles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debounced = useDebouncedValue(searchQuery, 300);

  const [items, setItems] = useState<Courrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Fetch côté serveur, avec filtre ILIKE si search
  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      setLoading(true);
      setErr(null);

      // Base query
      let query = supabase
        .from("courrier_template") // <-- remplace par le nom exact de ta table
        .select("id, created_at, amount_cents, title, description, google_doc_url, categorie")
        .order("created_at", { ascending: false })
        .limit(60);

      // Optionnel : si tu as une colonne is_public
      // query = query.eq("is_public", true);

      if (debounced && debounced.trim() !== "") {
        const q = debounced.trim();
        // Filtre multi-champs
        query = query.or(
          `title.ilike.%${q}%,description.ilike.%${q}%,categorie.ilike.%${q}%`
        );
      }

      const { data, error } = await query;

      if (!isCancelled) {
        if (error) {
          setErr(error.message);
          setItems([]);
        } else {
          setItems((data ?? []) as unknown as Courrier[]);
        }
        setLoading(false);
      }
    }

    fetchData();
    return () => { isCancelled = true; };
  }, [debounced]);

  const grid = useMemo(() => {
    return items.map((it) => ({
      title: it.title,
      price: EUR.format(Number(it.amount_cents / 100)),
      category: it.categorie ?? "Autre",
      id: it.id,
    }));
  }, [items]);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Modèles de courriers juridiques
        </h1>

        {/* Search Bar */}
        {/* <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher un modèle (ex : dépôt de garantie, licenciement, assurance…)"
              className="pl-12 h-14 rounded-full text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div> */}

        {/* States */}
        {loading && (
          <p className="text-center text-muted-foreground">Chargement…</p>
        )}
        {err && (
          <p className="text-center text-red-600">
            Erreur de chargement : {err}
          </p>
        )}

        {/* Products Grid */}
        {!loading && !err && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {grid.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.title}
                price={p.price}
                category={p.category}
              // Tu peux aussi passer un onClick ou un href vers une page détail:
              // href={`/courrier/${p.id}`}
              />
            ))}
            {grid.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">
                Aucun résultat.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modeles;
