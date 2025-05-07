import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "./_components/Header";
import ZohoSalesIQ from "@/components/zoho/ZohoSalesIQ";

export const metadata: Metadata = {
  title: "Entrance",
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
    <main className="min-h-screen">
      <ZohoSalesIQ />  {/* This will run on every page */}
      <Header />
      {children}
    </main>
  );
}
