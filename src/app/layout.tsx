"use client";

import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "@/context/AuthContext";
import Providers from "./providers/providers";
import { SessionProvider } from "next-auth/react";

// export const metadata: Metadata = {
//   title: "SkillBridge",
//   description: "Skill verification platform",
//   icons: {
//     icon: "/favicon.png",
//   },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        

        <SessionProvider>
          <AuthProvider>
            <Providers>
              <Navbar />
              {children}
              <Footer />
              <ToastContainer position="top-right" />
            </Providers>
          </AuthProvider>
        </SessionProvider>

        
      </body>
    </html>
  );
}
