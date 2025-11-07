import { GraduationCap } from "lucide-react";

const Etudiants = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="h-12 w-12 text-accent-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Étudiants en droit
          </h1>
          <div className="bg-secondary rounded-2xl p-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Une section dédiée aux étudiants en droit arrive bientôt : ressources, fiches pratiques, conseils pour réussir vos études.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Etudiants;
