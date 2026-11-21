import type { Metadata } from "next";
import localFont from "next/font/local";
import { GameProvider } from "@/providers/GameProvider";
import "./globals.css";

const spaceGrotesk = localFont({
  src: "../assets/fonts/SpaceGrotesk-VariableFont_wght.ttf",
  weight: "300 700",
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Connect 4",
  description: "Play Connect 4 online against a friend.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
