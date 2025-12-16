import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
}

const SEO = ({
    title = "StayHub | Find Your Perfect Stay",
    description = "Discover and book luxury hotels, resorts, and vacation rentals worldwide. StayHub offers seamless booking, reviews, and exclusive deals.",
    image = "/og-image.png",
    type = "website"
}: SEOProps) => { // Use default props for cleaner usage
    const siteTitle = title.includes("StayHub") ? title : `${title} | StayHub`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
