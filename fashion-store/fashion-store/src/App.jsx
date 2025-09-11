import React, { useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import StoreProvider from "./context/StoreContext";
import { ToastProvider } from "./context/ToastContext";
import Toaster from "./components/Toaster";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Men from "./pages/Men";
import Women from "./pages/Women";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <StoreProvider>
        <BrowserRouter>
          <Navbar />
          <ScrollToTop />
          <Suspense fallback={<div className="p-8">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/men" element={<Men />} />
              <Route path="/women" element={<Women />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
            </Routes>
          </Suspense>
          <Footer />
          <Toaster />
        </BrowserRouter>
      </StoreProvider>
    </ToastProvider>
  );
}
