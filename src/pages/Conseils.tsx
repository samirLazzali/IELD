import { Button } from "@/components/ui/button";

const Conseils = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Conseils juridiques
          </h1>
          <div className="bg-secondary rounded-2xl p-12 space-y-6">
            <p className="text-lg text-muted-foreground">
              Les premiers conseils juridiques arrivent bientôt. Abonne-toi pour être prévenu dès leur publication !
            </p>
            <Button size="lg" className="rounded-full">
              Être informé des prochains articles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conseils;
