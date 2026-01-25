"""
SEO Audit Micro-SaaS Module
============================
Automated SEO auditing service for websites.
Analyzes meta tags, headers, performance, mobile-friendliness, and more.
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import re
from typing import Dict, List, Any
import time

class SEOAuditor:
    def __init__(self, url: str):
        self.url = url
        self.domain = urlparse(url).netloc
        self.results = {
            "url": url,
            "timestamp": time.time(),
            "score": 0,
            "issues": [],
            "recommendations": [],
            "meta_tags": {},
            "headers": {},
            "links": {
                "internal": 0,
                "external": 0,
                "broken": []
            },
            "images": {
                "total": 0,
                "missing_alt": 0
            },
            "performance": {},
            "mobile_friendly": None
        }

    def audit(self) -> Dict[str, Any]:
        """
        Run complete SEO audit on the URL.
        """
        try:
            # Fetch the page
            start_time = time.time()
            response = requests.get(self.url, timeout=10, headers={
                'User-Agent': 'Mozilla/5.0 (compatible; SEOAuditor/1.0)'
            })
            load_time = time.time() - start_time
            
            if response.status_code != 200:
                self.results["issues"].append(f"Page returned status code {response.status_code}")
                return self.results

            self.results["performance"]["load_time"] = load_time
            
            # Parse HTML
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Run all checks
            self._check_title(soup)
            self._check_meta_description(soup)
            self._check_headings(soup)
            self._check_images(soup)
            self._check_links(soup, response.url)
            self._check_canonical(soup)
            self._check_robots_meta(soup)
            self._check_viewport(soup)
            self._check_schema_markup(soup)
            self._check_performance(load_time)
            
            # Calculate overall score
            self._calculate_score()
            
            return self.results
            
        except Exception as e:
            self.results["issues"].append(f"Error during audit: {str(e)}")
            return self.results

    def _check_title(self, soup):
        """Check title tag."""
        title = soup.find('title')
        if not title:
            self.results["issues"].append("Missing <title> tag")
            self.results["recommendations"].append("Add a descriptive title tag (50-60 characters)")
        else:
            title_text = title.get_text().strip()
            self.results["meta_tags"]["title"] = title_text
            
            if len(title_text) < 30:
                self.results["issues"].append(f"Title too short ({len(title_text)} chars)")
                self.results["recommendations"].append("Title should be 50-60 characters")
            elif len(title_text) > 60:
                self.results["issues"].append(f"Title too long ({len(title_text)} chars)")
                self.results["recommendations"].append("Shorten title to 50-60 characters")

    def _check_meta_description(self, soup):
        """Check meta description."""
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if not meta_desc:
            self.results["issues"].append("Missing meta description")
            self.results["recommendations"].append("Add meta description (150-160 characters)")
        else:
            desc_text = meta_desc.get('content', '').strip()
            self.results["meta_tags"]["description"] = desc_text
            
            if len(desc_text) < 120:
                self.results["issues"].append(f"Meta description too short ({len(desc_text)} chars)")
            elif len(desc_text) > 160:
                self.results["issues"].append(f"Meta description too long ({len(desc_text)} chars)")

    def _check_headings(self, soup):
        """Check heading structure."""
        h1_tags = soup.find_all('h1')
        
        if len(h1_tags) == 0:
            self.results["issues"].append("Missing H1 tag")
            self.results["recommendations"].append("Add exactly one H1 tag per page")
        elif len(h1_tags) > 1:
            self.results["issues"].append(f"Multiple H1 tags found ({len(h1_tags)})")
            self.results["recommendations"].append("Use only one H1 tag per page")
        
        # Count all heading levels
        for level in range(1, 7):
            count = len(soup.find_all(f'h{level}'))
            self.results["headers"][f"h{level}"] = count

    def _check_images(self, soup):
        """Check images for alt attributes."""
        images = soup.find_all('img')
        self.results["images"]["total"] = len(images)
        
        missing_alt = 0
        for img in images:
            if not img.get('alt'):
                missing_alt += 1
        
        self.results["images"]["missing_alt"] = missing_alt
        
        if missing_alt > 0:
            self.results["issues"].append(f"{missing_alt} images missing alt attributes")
            self.results["recommendations"].append("Add descriptive alt text to all images")

    def _check_links(self, soup, base_url):
        """Check internal and external links."""
        links = soup.find_all('a', href=True)
        internal = 0
        external = 0
        
        for link in links:
            href = link['href']
            
            # Resolve relative URLs
            full_url = urljoin(base_url, href)
            parsed = urlparse(full_url)
            
            if parsed.netloc == self.domain or not parsed.netloc:
                internal += 1
            else:
                external += 1
        
        self.results["links"]["internal"] = internal
        self.results["links"]["external"] = external

    def _check_canonical(self, soup):
        """Check for canonical URL."""
        canonical = soup.find('link', attrs={'rel': 'canonical'})
        if canonical:
            self.results["meta_tags"]["canonical"] = canonical.get('href')
        else:
            self.results["recommendations"].append("Consider adding canonical URL")

    def _check_robots_meta(self, soup):
        """Check robots meta tag."""
        robots = soup.find('meta', attrs={'name': 'robots'})
        if robots:
            self.results["meta_tags"]["robots"] = robots.get('content')

    def _check_viewport(self, soup):
        """Check for viewport meta tag (mobile-friendliness)."""
        viewport = soup.find('meta', attrs={'name': 'viewport'})
        if viewport:
            self.results["mobile_friendly"] = True
            self.results["meta_tags"]["viewport"] = viewport.get('content')
        else:
            self.results["mobile_friendly"] = False
            self.results["issues"].append("Missing viewport meta tag")
            self.results["recommendations"].append("Add viewport meta tag for mobile optimization")

    def _check_schema_markup(self, soup):
        """Check for structured data."""
        schema_scripts = soup.find_all('script', attrs={'type': 'application/ld+json'})
        if schema_scripts:
            self.results["meta_tags"]["schema_markup"] = len(schema_scripts)
        else:
            self.results["recommendations"].append("Consider adding Schema.org structured data")

    def _check_performance(self, load_time):
        """Check page load performance."""
        if load_time > 3.0:
            self.results["issues"].append(f"Slow page load time ({load_time:.2f}s)")
            self.results["recommendations"].append("Optimize images and reduce HTTP requests")
        elif load_time > 2.0:
            self.results["recommendations"].append("Consider optimizing page load time")

    def _calculate_score(self):
        """Calculate overall SEO score (0-100)."""
        score = 100
        
        # Deduct points for issues
        score -= len(self.results["issues"]) * 5
        
        # Bonus points for good practices
        if self.results["meta_tags"].get("title"):
            score += 5
        if self.results["meta_tags"].get("description"):
            score += 5
        if self.results["headers"].get("h1") == 1:
            score += 5
        if self.results["mobile_friendly"]:
            score += 10
        
        # Ensure score is within bounds
        self.results["score"] = max(0, min(100, score))


def run_audit(url: str) -> Dict[str, Any]:
    """
    Run SEO audit on a given URL.
    """
    auditor = SEOAuditor(url)
    return auditor.audit()


if __name__ == "__main__":
    import sys
    import json
    
    if len(sys.argv) < 2:
        print("Usage: python seo_auditor.py <url>")
        sys.exit(1)
    
    url = sys.argv[1]
    results = run_audit(url)
    
    print(json.dumps(results, indent=2))
