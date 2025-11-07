import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram } from "lucide-react";

const Contenu = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Mon contenu
          </h1>
          
          <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Retrouve mes vidéos et conseils sur Instagram et TikTok. J'explique simplement des situations juridiques du quotidien pour que chacun puisse comprendre ses droits et agir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Instagram Card */}
            <Card className="border-border">
              <CardHeader className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center mx-auto mb-4">
                  <Instagram className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl">Instagram</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Conseils juridiques courts et impactants pour ton quotidien
                </p>
                <Button className="rounded-full w-full" asChild>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    Voir mes vidéos
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* TikTok Card */}
            <Card className="border-border">
              <CardHeader className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-black via-gray-800 to-cyan-400 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
                <CardTitle className="text-2xl">TikTok</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Des explications juridiques rapides et accessibles à tous
                </p>
                <Button className="rounded-full w-full" asChild>
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                    Voir mes vidéos
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contenu;
