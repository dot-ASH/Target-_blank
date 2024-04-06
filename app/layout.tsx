import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { DataProvider } from "@/context/DataProvider";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthProvider";

export const metadata: Metadata = {
  title: "Target Blank",
  description: "My App is a...",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <DataProvider>
            <Header />
            {children}
            <Footer />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
