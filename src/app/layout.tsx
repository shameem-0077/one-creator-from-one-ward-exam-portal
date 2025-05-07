import type { Metadata } from "next";
import ZohoSalesIQ from "@/components/zoho/ZohoSalesIQ";
import { Figtree } from "next/font/google";
import NoInternet from "@/components/general/NoInternet";
import { Toaster } from "react-hot-toast";


const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "My App",
  description: "Next.js App Router with Zoho SalesIQ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className={`${figtree.className} antialiased`}>
        <NoInternet /> {/* Show offline warning when internet is lost */}
        <Toaster position="bottom-center" />
        <ZohoSalesIQ />  {/* This will run on every page */}
        {children}
      </body>
    </html>
  );
}
