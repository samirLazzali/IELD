import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  category?: string;
}

export const ProductCard = ({ id, title, price, category }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/modeles/${id}`);
  };
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-3">
          <FileText className="h-6 w-6 text-accent-foreground" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        {category && (
          <p className="text-xs text-muted-foreground">{category}</p>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{price}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleClick}
          className="w-full rounded-full">Acheter maintenant</Button>
      </CardFooter>
    </Card>
  );
};
