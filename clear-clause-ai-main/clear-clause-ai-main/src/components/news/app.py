from flask import Flask, jsonify
from flask_cors import CORS
import feedparser
import requests
import logging
from datetime import datetime
import re

app = Flask(__name__)
CORS(app)

# Disable logging noise
logging.getLogger("urllib3").setLevel(logging.CRITICAL)
logging.getLogger("feedparser").setLevel(logging.CRITICAL)






def extract_image_from_entry(entry):
    """
    Extracts image directly from RSS feed entry.
    Google News RSS includes images in media:content tags.
    """
    try:
        # Debug: Print all available keys in entry
        available_keys = list(entry.keys())
        print(f"      📋 Entry keys: {available_keys}")
        
        # Check for media content (most reliable)
        if hasattr(entry, 'media_content') and entry.media_content:
            for media in entry.media_content:
                if media.get('url'):
                    print(f"      ✅ Found media_content image: {media.get('url')[:60]}")
                    return media.get('url')
        
        # Check for media:thumbnail
        if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
            for thumb in entry.media_thumbnail:
                if thumb.get('url'):
                    print(f"      ✅ Found media_thumbnail image: {thumb.get('url')[:60]}")
                    return thumb.get('url')
        
        # Check for image link
        if hasattr(entry, 'image') and entry.image:
            if hasattr(entry.image, 'url'):
                print(f"      ✅ Found image.url: {entry.image.url[:60]}")
                return entry.image.url
        
        # Check for links with rel="image"
        if hasattr(entry, 'links') and entry.links:
            for link in entry.links:
                if link.get('rel') == 'image' or link.get('type', '').startswith('image/'):
                    print(f"      ✅ Found image link: {link.get('href', '')[:60]}")
                    return link.get('href', '')
        
        # Parse image from summary HTML (fallback)
        summary = entry.get('summary', '')
        if summary and '<img' in summary:
            # Extract src from img tag
            match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', summary)
            if match:
                img_url = match.group(1)
                if img_url and not any(x in img_url.lower() for x in ['logo', 'favicon', '1x1', 'spacer']):
                    print(f"      ✅ Found image in summary HTML: {img_url[:60]}")
                    return img_url
        
        print(f"      ⚠️  No image found in entry")
        return ""
    
    except Exception as e:
        print(f"      ❌ Error extracting image: {str(e)}")
        return ""


def fetch_news_from_rss(topic: str):
    """
    Fetches news from Google News RSS feed.
    RSS is faster, stable, and never blocked compared to HTML scraping.
    """
    print(f"\n🔍 Fetching news from Google News RSS: '{topic}'")
    
    # Google News RSS endpoint
    rss_url = f"https://news.google.com/rss/search?q={topic.replace(' ', '+')}"
    
    try:
        print(f"   📡 URL: {rss_url}")

        # Fetch the RSS using requests with a browser-like User-Agent to avoid remote blocks
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) LegalAI/1.0"
        }
        resp = requests.get(rss_url, headers=headers, timeout=10)
        if resp.status_code != 200:
            print(f"   ❌ RSS fetch failed: status={resp.status_code}")
            return []

        # Parse the RSS content
        feed = feedparser.parse(resp.content)

        # Check if feed parsed successfully
        entries = getattr(feed, "entries", None)
        if not entries:
            print(f"   ❌ Failed to parse feed or no entries found")
            return []

        print(f"   ✅ Feed parsed successfully, found {len(entries)} entries")
        
        articles = []
        seen_titles = set()
        
        for idx, entry in enumerate(entries[:10]):
            try:
                # Extract basic fields
                title = entry.get('title', '').strip()
                
                # Skip empty or duplicate titles
                if not title or title in seen_titles:
                    continue
                seen_titles.add(title)
                
                # Extract URL
                url = entry.get('link', '')
                
                # Extract description/summary
                description = entry.get('summary', '').strip()
                # Remove HTML tags if present
                if '<' in description and '>' in description:
                    # Remove all HTML tags properly
                    description = re.sub(r'<[^>]+>', '', description).strip()
                
                # Extract published date
                published_date = entry.get('published', 'Recently')
                
                # Extract source (from title sometimes contains source info)
                source = entry.get('source', {}).get('title', 'Google News')
                
                # Extract thumbnail image directly from RSS entry
                image = extract_image_from_entry(entry)
                
                article = {
                    "id": f"{topic.lower()}-{len(articles)}",
                    "title": title,
                    "description": description[:250] if description else title[:200],
                    "url": url,
                    "publishedDate": published_date,
                    "source": source,
                    "image": image,  # Images from RSS feed metadata
                    "topic": topic.lower()
                }
                
                articles.append(article)
                if image:
                    print(f"   ✓ Article {len(articles)}: {title[:50]}... [📸 RSS Image]")
                else:
                    print(f"   ✓ Article {len(articles)}: {title[:50]}...")
                
            except Exception as e:
                print(f"   ⚠️  Error parsing entry {idx}: {str(e)}")
                continue
        
        if articles:
            print(f"\n   🎉 SUCCESS! Found {len(articles)} articles for '{topic}'")
            return articles
        else:
            print(f"   ⚠️  No valid articles extracted from feed")
            return []
    
    except Exception as e:
        print(f"   ❌ Error fetching RSS feed: {str(e)}")
        return []


@app.route('/news/<topic>', methods=['GET'])
def get_news(topic):
    """
    GET /news/<topic>
    Fetches news articles for a given topic from Google News RSS feed.
    
    Returns JSON array of articles or 404 error if none found.
    """
    topic_clean = topic.lower().strip()
    
    print(f"\n{'='*70}")
    print(f"📨 NEWS REQUEST: {topic_clean}")
    print(f"{'='*70}")
    
    # Fetch articles from RSS feed
    articles = fetch_news_from_rss(topic_clean)
    
    if not articles:
        error_msg = f"No news found for '{topic_clean}'"
        print(f"\n❌ RETURNING ERROR")
        return jsonify({"error": error_msg}), 404
    
    print(f"\n✅ RETURNING {len(articles)} ARTICLES")
    return jsonify(articles), 200

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "✅ Backend is running!", "port": 3000}), 200


if __name__ == '__main__':
    print("\n" + "="*70)
    print("🚀 LEGALAI NEWS BACKEND - GOOGLE NEWS RSS FEED")
    print("="*70)
    print("📍 Server: http://localhost:3000")
    print("📰 Endpoint: GET /news/<topic>")
    ...
    app.run(debug=False, port=3000, threaded=True)
