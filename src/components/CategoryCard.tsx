import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
}

export const CategoryCard = ({ icon: Icon, title }: CategoryCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 border-border">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
          <Icon className="h-7 w-7 text-accent-foreground" />
        </div>
        <h3 className="font-medium text-sm">{title}</h3>
      </CardContent>
    </Card>
  );
};
