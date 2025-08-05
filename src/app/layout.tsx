import "./globals.css";
import { AuthProvider } from "@/context/auth.context";
import MuiProvider from "@/components/provider/MuiProvider";
import { ToastContainer } from "@/components/ui/alert";
import { NotificationProvider } from "@/context/notification.context";

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
            <NotificationProvider>
              {children}
              <ToastContainer />  
            </NotificationProvider>
          </AuthProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
