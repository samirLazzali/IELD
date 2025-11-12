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

// --- Nouvelle fonction de filtrage ---
function filterModeles(items: Courrier[], query: string): Courrier[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(
    (it) =>
      it.title?.toLowerCase().includes(q) ||
      it.description?.toLowerCase().includes(q) ||
      it.categorie?.toLowerCase().includes(q)
  );
}

const Modeles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debounced = useDebouncedValue(searchQuery, 300);

  const [items, setItems] = useState<Courrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // --- Fetch initial (tous les modèles publics) ---
  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      setLoading(true);
      setErr(null);

      const { data, error } = await supabase
        .from("courrier_template")
        .select("id, created_at, amount_cents, title, description, google_doc_url, categorie")
        .order("created_at", { ascending: false })
        .limit(200);

      if (!isCancelled) {
        if (error) {
          setErr(error.message);
          setItems([]);
        } else {
          setItems(data ?? []);
        }
        setLoading(false);
      }
    }

    fetchData();
    return () => { isCancelled = true; };
  }, []);

  // --- Applique le filtre local ---
  const filtered = useMemo(() => filterModeles(items, debounced), [items, debounced]);

  const grid = useMemo(() => {
    return filtered.map((it) => ({
      title: it.title,
      price: EUR.format(Number(it.amount_cents / 100)),
      category: it.categorie ?? "Autre",
      id: it.id,
    }));
  }, [filtered]);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Modèles de courriers juridiques
        </h1>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
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
        </div>

        {/* States */}
        {loading && <p className="text-center text-muted-foreground">Chargement…</p>}
        {err && <p className="text-center text-red-600">Erreur de chargement : {err}</p>}

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
