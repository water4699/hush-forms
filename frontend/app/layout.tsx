{/* Auto-generated comment for hourly collaboration - 2025-11-08 17:08:05 */}
{/* Auto-generated comment for hourly collaboration - 2025-11-08 17:08:04 */}
{/* Auto-generated comment for hourly collaboration - 2025-11-08 17:08:03 */}
{/* Auto-generated comment for hourly collaboration - 2025-11-08 17:08:01 */}
{/* Auto-generated comment for hourly collaboration - 2025-11-08 17:08:00 */}
{/* Auto-generated comment for hourly collaboration - 2025-11-08 17:07:59 */}
{/* Auto-generated comment for hourly collaboration - 2025-11-08 17:07:59 */}
{/* Auto-generated comment for hourly collaboration - 2025-11-08 17:07:57 */}
{/* Auto-generated comment for collaboration - 2025-11-08 16:39:23 */}
{/* Auto-generated comment for collaboration - 2025-11-08 16:39:22 */}
{/* Auto-generated comment for collaboration - 2025-11-08 16:39:22 */}
{/* Auto-generated comment for collaboration - 2025-11-08 16:39:21 */}
{/* Auto-generated comment for collaboration - 2025-11-08 16:39:20 */}
{/* Auto-generated comment for collaboration - 2025-11-08 16:39:18 */}
{/* Auto-generated comment for collaboration - 2025-11-08 16:39:17 */}
import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import Image from "next/image";
import { WalletConnectButton } from "@/components/WalletConnectButton";

export const metadata: Metadata = {
  title: "Encrypted Survey dApp",
  description: "Privacy-preserving survey using Zama FHEVM",
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`zama-bg antialiased`}>
        <div className="fixed inset-0 w-full h-full zama-bg z-[-20]"></div>
        <Providers>
          <main className="flex flex-col max-w-screen-lg mx-auto pb-20 px-4 sm:px-6 lg:px-8">
            <nav className="flex w-full h-fit py-8 sm:py-10 justify-between items-center">
              <Image
                src="/app-logo.svg"
                alt="App Logo"
                width={140}
                height={140}
                priority
                style={{ width: "auto", height: "auto" }}
              />
              <div>
                <WalletConnectButton />
              </div>
            </nav>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
