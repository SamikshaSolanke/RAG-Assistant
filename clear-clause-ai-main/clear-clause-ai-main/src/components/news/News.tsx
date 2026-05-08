import { useState, useEffect } from "react";
import { Search, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// Fetch Google News RSS via a CORS proxy (allorigins.win) and parse RSS XML in-browser
import NewsCard from "./NewsCard";
import NewsCardSkeleton from "./NewsCardSkeleton";

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

interface NewsPageProps {
  currentLanguage: string;
}

const CATEGORIES = ["Technology", "AI", "Legal", "Contracts", "Compliance"];
const API_BASE_URL = "http://localhost:3000";

export default function News({ currentLanguage }: NewsPageProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Technology");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [error, setError] = useState("");

  const content = {
    en: {
      title: "Latest News",
      subtitle: "Stay updated with the latest news in technology, AI, law, and more",
      searchPlaceholder: "Search news by topic...",
      categories: "Categories",
      viewMode: "View Mode",
      gridView: "Grid",
      listView: "List",
      readMore: "Read More",
      noResults: "No news found for this topic. Try another search.",
      errorMessage: "Failed to fetch news. Please try again.",
      publishedOn: "Published on",
    },
    hi: {
      title: "नवीनतम समाचार",
      subtitle: "तकनीक, एआई, कानून और अन्य विषयों में नवीनतम समाचार से अपडेट रहें",
      searchPlaceholder: "विषय के आधार पर समाचार खोजें...",
      categories: "श्रेणियां",
      viewMode: "देखें मोड",
      gridView: "ग्रिड",
      listView: "सूची",
      readMore: "अधिक पढ़ें",
      noResults: "इस विषय के लिए कोई समाचार नहीं मिला। दूसरी खोज का प्रयास करें।",
      errorMessage: "समाचार प्राप्त करने में विफल। कृपया पुनः प्रयास करें।",
      publishedOn: "प्रकाशित",
    },
  };

  const t = content[currentLanguage as keyof typeof content] || content.en;

  useEffect(() => {
    fetchNews(selectedCategory.toLowerCase());
  }, [selectedCategory]);

  const fetchNews = async (topic: string) => {
    setLoading(true);
    setError("");
    try {
      // First try backend proxy endpoint (recommended)
      try {
        const resp = await fetch(`${API_BASE_URL}/news/${encodeURIComponent(topic)}`);
        if (resp.ok) {
          const json = await resp.json();
          if (Array.isArray(json)) {
            setArticles(json as NewsArticle[]);
            return;
          }
        }
        // if backend returns non-OK fall through to client-side parsing fallback
        console.warn('Backend news proxy failed, falling back to client-side RSS parsing');
      } catch (e) {
        console.warn('Backend news fetch error, falling back to client-side RSS parsing', e);
      }

      // Fallback: fetch RSS via public CORS proxy and parse XML in-browser
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;
      const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;

      const resp2 = await fetch(proxy);
      if (!resp2.ok) throw new Error('Failed to fetch news feed');
      const xmlText = await resp2.text();

      // Parse RSS XML
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, 'application/xml');
      const items = Array.from(xml.getElementsByTagName('item'));

      const parsed = items.map((it) => {
        const get = (tag: string) => {
          const el = it.getElementsByTagName(tag)[0];
          return el ? el.textContent || '' : '';
        };

        // Try to get media thumbnail (media:thumbnail) or enclosure
        let image = '';
        const mediaThumb = it.getElementsByTagName('media:thumbnail')[0];
        if (mediaThumb && mediaThumb.getAttribute) image = mediaThumb.getAttribute('url') || '';
        if (!image) {
          const enclosure = it.getElementsByTagName('enclosure')[0];
          if (enclosure && enclosure.getAttribute) image = enclosure.getAttribute('url') || '';
        }

        const link = get('link') || '';
        const title = get('title') || '';
        const description = get('description') || '';
        const pubDate = get('pubDate') || '';
        // Source (Google News embeds source in title sometimes). Try <source> tag
        const sourceEl = it.getElementsByTagName('source')[0];
        const source = sourceEl ? sourceEl.textContent || '' : '';

        return {
          id: link || title || Math.random().toString(36).slice(2),
          title,
          description,
          image,
          publishedDate: pubDate,
          topic,
          source,
          url: link,
        };
      });

      setArticles(parsed || []);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(t.errorMessage);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await fetchNews(searchQuery.toLowerCase());
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayArticles = searchQuery.trim() ? filteredArticles : articles;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-background border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t.subtitle}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-lg"
                />
              </div>
              <Button
                type="submit"
                className="h-12 px-6 rounded-lg"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Categories */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t.categories}
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchQuery("");
                  }}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-end gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-lg"
            >
              {t.gridView}
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-lg"
            >
              {t.listView}
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-20">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {[...Array(6)].map((_, i) => (
              <NewsCardSkeleton key={i} viewMode={viewMode} />
            ))}
          </div>
        ) : displayArticles.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {displayArticles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                viewMode={viewMode}
                currentLanguage={currentLanguage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No News Found
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {t.noResults}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Technology");
              }}
              className="rounded-lg"
            >
              Reset Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
