import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Tag } from "lucide-react";

interface BlogCardProps {
  title: string;
  category: string;
  readTime: string;
  excerpt?: string;
}

export const BlogCard = ({ title, category, readTime, excerpt }: BlogCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border">
      <CardHeader>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {category}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readTime}
          </span>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      {excerpt && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{excerpt}</p>
        </CardContent>
      )}
      <CardFooter>
        <Button variant="outline" className="rounded-full">Lire l'article</Button>
      </CardFooter>
    </Card>
  );
};
