import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import RevealProvider from "@/components/RevealProvider";
import SiteChrome from "@/components/SiteChrome";
import AuthProvider from "@/components/AuthProvider";
import JsonLd from "@/components/JsonLd";
import {
    absoluteUrl,
    organizationJsonLd,
    SITE_DESCRIPTION,
    SITE_KEYWORDS,
    SITE_NAME,
    SITE_TAGLINE,
    SITE_URL,
    websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} — ${SITE_TAGLINE}`,
        template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    alternates: {
        canonical: absoluteUrl("/"),
    },
    openGraph: {
        type: "website",
        url: absoluteUrl("/"),
        siteName: SITE_NAME,
        title: `${SITE_NAME} — ${SITE_TAGLINE}`,
        description: SITE_DESCRIPTION,
        locale: "en_US",
        images: [
            {
                url: `${SITE_URL}/opengraph-image`,
                width: 1200,
                height: 630,
                alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} — ${SITE_TAGLINE}`,
        description: SITE_DESCRIPTION,
        images: [`${SITE_URL}/opengraph-image`],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    category: "travel",
    manifest: "/manifest.webmanifest",
    // icon.svg (favicon) and apple-icon.tsx (apple touch icon) are
    // auto-discovered by Next.js from src/app/ and injected into <head>
    // with their correct URLs, so no manual `icons` config is needed here.
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
};

export const viewport: Viewport = {
    themeColor: "#10161f",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router: <link> in the root layout <head> is the supported pattern for external fonts */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
                <a href="#main" className="skip-link">
                    Skip to content
                </a>
                <AuthProvider>
                    <SiteChrome>
                        <Header />
                    </SiteChrome>
                    <main id="main">{children}</main>
                    <SiteChrome>
                        <Footer />
                        <ChatBot />
                    </SiteChrome>
                    <RevealProvider />
                </AuthProvider>
                <noscript>
                    <style>{`.reveal{opacity:1;transform:none}`}</style>
                </noscript>
            </body>
        </html>
    );
}
