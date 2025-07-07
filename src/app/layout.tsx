import "./globals.css";
import { AuthProvider } from "@/context/auth.context";
import MuiProvider from "@/components/provider/MuiProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning={true}>
        <MuiProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
