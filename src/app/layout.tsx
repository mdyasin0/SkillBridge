import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Providers from "./providers/providers";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "SkillBridge",
  description: "Skill verification platform",
   icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Providers>
          {children}
          <ToastContainer position="top-right" />
        </Providers>
        
        <Footer/>
      </body>
    </html>
  );
}