import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import ChatBot from "@/components/ui/ChatBot";
import "./globals.css";

// ============================================
// Google Fonts – Athletic heading + clean body
// ============================================

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// ============================================
// Root Layout - Metadata and global shell
// ============================================

export const metadata: Metadata = {
  metadataBase: new URL("https://fitnessplus.example.com"),
  title: "Fitness Plus Gym | Kurla East, Mumbai | Empowering Wellness Journeys",
  description:
    "Fitness Plus is a premium unisex gym in Kurla East, Mumbai. Expert trainers, modern equipment, and personalized fitness programs. Start your transformation today!",
  keywords: [
    "gym kurla east",
    "fitness plus mumbai",
    "best gym mumbai",
    "personal training kurla",
    "weight loss gym mumbai",
    "strength training mumbai",
  ],
  openGraph: {
    title: "Fitness Plus Gym | Your Fitness Goals, Our Mission",
    description:
      "Premium unisex gym in Kurla East, Mumbai. Strength training, cardio, personal coaching and more.",
    type: "website",
    url: "/",
    locale: "en_IN",
    siteName: "Fitness Plus Gym",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitness Plus Gym | Kurla East, Mumbai",
    description: "Empowering Wellness Journeys",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`scroll-smooth ${oswald.variable} ${inter.variable}`}
    >
      <body suppressHydrationWarning className="bg-[#050505] text-white antialiased overflow-x-hidden">
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
