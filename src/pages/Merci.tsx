import { CheckCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Merci = () => {
    return (
        <div className="pt-32 min-h-screen flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                <div className="mb-8 flex justify-center">
                    <CheckCircle className="h-24 w-24 text-primary" />
                </div>

                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                    Merci pour votre commande !
                </h1>

                <div className="bg-secondary/30 rounded-lg p-8 mb-8">
                    <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground mb-4">
                        Votre modèle de courrier juridique sera envoyé dans votre boîte mail sous peu.
                    </p>
                    <p className="text-muted-foreground">
                        Pensez à vérifier vos courriers indésirables si vous ne recevez pas l'email dans les prochaines minutes.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                        <Link to="/modeles">Découvrir d'autres modèles</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link to="/">Retour à l'accueil</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Merci;
