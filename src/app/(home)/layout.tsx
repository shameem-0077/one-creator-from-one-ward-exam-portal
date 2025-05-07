import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "@/styles/globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Steyp | Community-First Digital University Platform",
  description:
    "Community-First Digital University platform for students, engineers, and scientists to explore, learn, and collaborate.",
  robots: "https://techatschool.steyp.com akkane",
  openGraph: {
    url: "https://techatschool.steyp.com akkane",
    title: "Steyp | Community-First Digital University Platform",
    description:
      "Community-First Digital University platform for students, engineers, and scientists to explore, learn, and collaborate.",
    images: [
      {
        url: "https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/06-02-2025/tech-at-school-og.jpg",
        width: 1200,
        height: 600,
        alt: "Steyp | An EdTech company",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      {children}
    </main>
  
  );
}
