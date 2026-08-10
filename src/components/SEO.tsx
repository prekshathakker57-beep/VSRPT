import { useEffect } from "react";
import { CENTRAL_CONFIG } from "../config";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  schemaType?: "LocalBusiness" | "EducationalOrganization" | "Course";
  schemaData?: Record<string, any>;
}

export default function SEO({
  title,
  description,
  keywords,
  canonicalPath = "",
  schemaType,
  schemaData
}: SEOProps) {
  const fullTitle = `${title} | ${CENTRAL_CONFIG.instituteName} Pune`;
  const metaDescription = description || CENTRAL_CONFIG.seo.defaultDescription;
  const metaKeywords = keywords || CENTRAL_CONFIG.seo.defaultKeywords;
  const canonicalUrl = `https://www.${CENTRAL_CONFIG.domainName}${canonicalPath}`;

  useEffect(() => {
    // 1. Update document title
    document.title = fullTitle;

    // 2. Manage meta tags
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
      metaDescTag = document.createElement("meta");
      metaDescTag.setAttribute("name", "description");
      document.head.appendChild(metaDescTag);
    }
    metaDescTag.setAttribute("content", metaDescription);

    let metaKeywordsTag = document.querySelector('meta[name="keywords"]');
    if (!metaKeywordsTag) {
      metaKeywordsTag = document.createElement("meta");
      metaKeywordsTag.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywordsTag);
    }
    metaKeywordsTag.setAttribute("content", metaKeywords);

    // 3. Open Graph Tags
    const ogTags = [
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl },
      { property: "og:site_name", content: CENTRAL_CONFIG.instituteName },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // 4. Link Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 5. Inject Structured Data (JSON-LD)
    const existingScript = document.getElementById("structured-data-jsonld");
    if (existingScript) {
      existingScript.remove();
    }

    const schemas: any[] = [];

    // Core LocalBusiness Structured Data
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": CENTRAL_CONFIG.instituteName,
      "image": `https://www.${CENTRAL_CONFIG.domainName}/assets/logo.png`,
      "telephone": CENTRAL_CONFIG.phoneNumberFormatted,
      "email": CENTRAL_CONFIG.emailAddress,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": CENTRAL_CONFIG.fullAddress,
        "addressLocality": "Kothrud",
        "addressRegion": "Maharashtra",
        "postalCode": "411038",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 18.505705,
        "longitude": 73.811566
      },
      "url": `https://www.${CENTRAL_CONFIG.domainName}`,
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "11:00",
          "closes": "20:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Sunday",
          "opens": "10:00",
          "closes": "14:00"
        }
      ]
    };

    schemas.push(localBusinessSchema);

    // EducationalOrganization Schema
    const eduSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": CENTRAL_CONFIG.instituteName,
      "address": localBusinessSchema.address,
      "telephone": CENTRAL_CONFIG.phoneNumberFormatted,
      "url": localBusinessSchema.url,
      "description": CENTRAL_CONFIG.seo.defaultDescription
    };

    schemas.push(eduSchema);

    // Custom Contextual Schema (e.g., Course)
    if (schemaType && schemaData) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": schemaType,
        ...schemaData
      });
    }

    const script = document.createElement("script");
    script.id = "structured-data-jsonld";
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schemas);
    document.head.appendChild(script);

    return () => {
      // Cleanup schemas script on unmount
      const scriptToRemove = document.getElementById("structured-data-jsonld");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [fullTitle, metaDescription, metaKeywords, canonicalUrl, schemaType, schemaData]);

  return null;
}
