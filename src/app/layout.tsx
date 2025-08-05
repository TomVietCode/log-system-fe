import "./globals.css";
import { AuthProvider } from "@/context/auth.context";
import MuiProvider from "@/components/provider/MuiProvider";
import { ToastContainer } from "@/components/ui/alert";
import { NotificationProvider } from "@/context/notification.context";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider 
          locale={locale}
          messages={messages}
        >
          <MuiProvider>
            <AuthProvider>
              <NotificationProvider>
                {children}
                <ToastContainer />  
              </NotificationProvider>
            </AuthProvider>
          </MuiProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
