import "./globals.css";
import type { Metadata } from "next";
import { StandardProvider } from "@/components/standard-provider";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = { title: "MEP-Calc Engine Pro" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StandardProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden p-8">{children}</main>
          </div>
        </StandardProvider>
      </body>
    </html>
  );
}
