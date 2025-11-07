import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { BlogCard } from "@/components/BlogCard";
import { Home, Car, Briefcase, ShoppingCart, Plane, Train, CreditCard, Smartphone } from "lucide-react";
import heroImage from "@/assets/hero-legal.jpg";

const categories = [
  { icon: Home, title: "Logement" },
  { icon: Car, title: "Automobile" },
  { icon: Briefcase, title: "Travail" },
  { icon: ShoppingCart, title: "Consommation" },
  { icon: Plane, title: "Voyage" },
  { icon: Train, title: "Transports" },
  { icon: CreditCard, title: "Banque & assurances" },
  { icon: Smartphone, title: "Téléphonie & Internet" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            Nul ne peut ignorer la loi, mais…
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
            Un souci juridique ? Tu es au bon endroit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full text-base px-8">
              <Link to="/modeles">Découvrir les modèles</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="rounded-full text-base px-8">
              <Link to="/conseils">Lire un conseil juridique</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Trouvez de l'aide dans tous les domaines
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.title} icon={category.icon} title={category.title} />
          ))}
        </div>
      </section>

      {/* Understanding Section */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comprendre et agir
          </h2>
          <p className="text-lg text-muted-foreground">
            Inès t'aide à comprendre la loi et à agir concrètement grâce à des modèles validés par des avocats.
          </p>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Derniers conseils juridiques
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BlogCard
            title="Demande de restitution du dépôt de garantie"
            category="Logement"
            readTime="1 min"
            excerpt="État des lieux conforme : comment récupérer votre dépôt de garantie rapidement."
          />
          <BlogCard
            title="Résiliation d'un abonnement téléphonique"
            category="Téléphonie"
            readTime="2 min"
            excerpt="Les étapes pour résilier votre contrat sans frais cachés."
          />
          <BlogCard
            title="Litige avec votre assurance automobile"
            category="Automobile"
            readTime="3 min"
            excerpt="Comment faire valoir vos droits en cas de désaccord avec votre assureur."
          />
        </div>
        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/conseils">Voir tous les conseils</Link>
          </Button>
        </div>
      </section>

      {/* Shop Preview Section */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Nos modèles les plus demandés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ProductCard title="Modèle de courrier - Logement" price="7,50€" category="Logement" />
            <ProductCard title="Modèle de courrier - Travail" price="15,00€" category="Travail" />
            <ProductCard title="Pack complet - Consommation" price="25,00€" category="Consommation" />
          </div>
          <div className="text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/modeles">Voir tous les modèles</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
