import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/site";

interface SEOProps {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;
  noindex?: boolean;
}

const defaultProps = {
  title: siteConfig.title,
  description: siteConfig.description,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  pathname: "/",
};

export function SEO({
  title = defaultProps.title,
  description = defaultProps.description,
  pathname = defaultProps.pathname,
  image = defaultProps.image,
  noindex = false,
}: SEOProps) {
  const canonical = `${siteConfig.url}${pathname}`;
  const fullTitle =
    title === siteConfig.title ? title : `${title} | ${siteConfig.name}`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: "Ingeniería Multimedia e Inteligencia Artificial",
    url: siteConfig.url,
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <link rel="canonical" href={canonical} />
          <meta name="robots" content="index, follow" />
        </>
      )}

      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="es_AR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
    </Helmet>
  );
}
