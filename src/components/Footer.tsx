import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 text-center">
          {/* Navigation rapide */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Navigation rapide</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Accueil</Link></li>
              <li><Link to="/conseils" className="text-muted-foreground hover:text-foreground transition-colors">Conseils juridiques</Link></li>
              <li><Link to="/modeles" className="text-muted-foreground hover:text-foreground transition-colors">Modèles</Link></li>
              <li><Link to="/contenu" className="text-muted-foreground hover:text-foreground transition-colors">Contenu</Link></li>
              <li><Link to="/a-propos" className="text-muted-foreground hover:text-foreground transition-colors">Qui suis-je ?</Link></li>
              <li><Link to="/etudiants" className="text-muted-foreground hover:text-foreground transition-colors">Étudiants</Link></li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Réseaux sociaux</h3>
            <div className="flex justify-center space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Mentions légales */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Mentions légales</h3>
            <ul className="space-y-2">
              <li><Link to="/mentions-legales" className="text-muted-foreground hover:text-foreground transition-colors">Mentions légales</Link></li>
              <li><Link to="/politique-confidentialite" className="text-muted-foreground hover:text-foreground transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/politique-cookies" className="text-muted-foreground hover:text-foreground transition-colors">Politique de cookies</Link></li>
              <li><Link to="/cgv" className="text-muted-foreground hover:text-foreground transition-colors">CGV</Link></li>
            </ul>
          </div>
        </div>

        {/* Signature */}
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Inès et le Droit — Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
