"use client";
import { useState, useEffect } from "react";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound, useParams } from "next/navigation";
import { routing } from "@/i18n/routing";

export default async function RootLayout({
  children, params
}: {
  children: React.ReactNode;
  params: { locale: string }
}) {

  const { locale } = await params;


  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  console.log(locale, "paramsas localee")
  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body>

        <NextIntlClientProvider locale={locale} >

          <ReduxProvider>
            <CartModalProvider>
              <ModalProvider>
                <PreviewSliderProvider>
                  <Header />
                  {children}

                  <QuickViewModal />
                  <CartSidebarModal />
                  <PreviewSliderModal />
                </PreviewSliderProvider>
              </ModalProvider>
            </CartModalProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
        <ScrollToTop />
        <Footer />

      </body>
    </html>
  );
}
