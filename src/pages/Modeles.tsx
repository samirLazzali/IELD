import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";

const Modeles = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const products = [
    { title: "Demande de restitution de dépôt de garantie", price: "7,50€", category: "Logement" },
    { title: "Lettre de résiliation d'assurance", price: "7,50€", category: "Assurance" },
    { title: "Contestation d'une amende", price: "12,00€", category: "Automobile" },
    { title: "Demande de congés payés", price: "10,00€", category: "Travail" },
    { title: "Réclamation suite à un retard de vol", price: "15,00€", category: "Voyage" },
    { title: "Résiliation d'abonnement téléphonique", price: "7,50€", category: "Téléphonie" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Modèles de courriers juridiques
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher un modèle de courrier (ex : dépôt de garantie, licenciement, assurance…)"
              className="pl-12 h-14 rounded-full text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              price={product.price}
              category={product.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modeles;
