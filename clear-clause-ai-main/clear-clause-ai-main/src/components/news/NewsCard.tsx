import { Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  publishedDate: string;
  topic: string;
  source?: string;
  url?: string;
}

interface NewsCardProps {
  article: NewsArticle;
  viewMode: "grid" | "list";
  currentLanguage: string;
}

export default function NewsCard({
  article,
  viewMode,
  currentLanguage,
}: NewsCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(
        currentLanguage === "hi" ? "hi-IN" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return dateString;
    }
  };

  const handleReadMore = () => {
    if (article.url) {
      window.open(article.url, "_blank");
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30">
        <CardContent className="p-0">
          <div className="flex gap-4">
            {/* Image */}
            <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={article.image || "https://via.placeholder.com/150"}
                alt={article.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="flex-1 py-4 pr-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
                    {article.title}
                  </h3>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {article.topic}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {article.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.publishedDate)}</span>
                </div>
                <Button
                  onClick={handleReadMore}
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary hover:bg-primary/10 gap-1"
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid View
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 hover:translate-y-[-4px]">
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        <img
          src={article.image || "https://via.placeholder.com/400x300"}
          alt={article.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur">
            {article.topic}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex-1 flex flex-col p-4">
        <h3 className="text-lg font-semibold text-foreground line-clamp-3 mb-2 flex-1">
          {article.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {article.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(article.publishedDate)}</span>
          </div>
          <Button
            onClick={handleReadMore}
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
