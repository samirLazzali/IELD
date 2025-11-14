import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import Conseils from "./pages/Conseils";
import Modeles from "./pages/Modeles";
import Contenu from "./pages/Contenu";
import APropos from "./pages/APropos";
import Etudiants from "./pages/Etudiants";
import ModeleDetail from "./pages/ModeleDetail";
import SoumissionDetail from "./pages/SoumissionDetail";
import NotFound from "./pages/NotFound";
import Merci from "./pages/Merci";
import { ScrollToTop } from "./ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />   {/* ← TEST */}
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/conseils" element={<Conseils />} />
              <Route path="/modeles" element={<Modeles />} />
              <Route path="/contenu" element={<Contenu />} />
              <Route path="/a-propos" element={<APropos />} />
              <Route path="/etudiants" element={<Etudiants />} />
              <Route path="/modeles/:id" element={<ModeleDetail />} />
              <Route path="/soumission/:id" element={<SoumissionDetail />} />
              <Route path="/merci" element={<Merci />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
