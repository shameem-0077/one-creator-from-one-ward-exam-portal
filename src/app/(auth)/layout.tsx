import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "@/styles/globals.css";
import Image from "next/image";
import TalropLogo from "../../../public/assets/icons/talrop_icon.svg";
import Link from "next/link";
import ZohoSalesIQ from "@/components/zoho/ZohoSalesIQ";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Steyp | Community-First Digital University Platform",
  description:
    "Community-First Digital University platform for students, engineers, and scientists to explore, learn, and collaborate.",
  robots: "https://techatschool.steyp.com",
  openGraph: {
    url: "https://techatschool.steyp.com",
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
    <section className="min-h-screen w-full p-4 sm:p-6 md:p-8">
      <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-8 h-full">
        <div className="w-full">
          <div className="flex justify-between items-center px-0 sm:px-4">
            <Link href="/" className="transform hover:scale-105 transition-transform">
              <Image
                src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/23-11-2021/steyp-logo.svg"
                width={110}
                height={34}
                alt="steyp logo"
                className="w-[90px] sm:w-[110px] h-auto"
              />
            </Link>
            <div>
              <Link href="/" className="transform hover:scale-105 transition-transform">
                <Image
                  src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/18-03-2025/Initiative.svg"
                  width={150}
                  height={48}
                  alt="talrop logo"
                  className="w-[120px] sm:w-[150px] h-auto"
                />
              </Link>
            </div>
          </div>
          <div className="flex justify-center items-center mt-8 lg:mt-0" style={{ minHeight: "calc(100vh - 180px)" }}>
            {children}
          </div>
        </div>

        <div className="w-full lg:max-w-[540px] hidden lg:block">
          <div className="w-full h-full relative aspect-[3/4]">
            <Image
              src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/06-02-2025/tech-at-school.jpg"
              className="w-full h-full object-cover rounded-lg"
              alt="blog"
              width={540}
              height={716}
              loading="lazy"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
