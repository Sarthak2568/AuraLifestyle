import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StoreProvider from "./context/StoreContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Men from "./pages/Men";
import Women from "./pages/Women";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import MiniCart from "./components/MiniCart";
import MiniWishlist from "./components/MiniWishlist";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Returns from "./pages/Returns";
import OrderSuccess from "./pages/OrderSuccess";

// NEW pages
import Shipping from "./pages/Shipping";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        {/* Force top-of-page on every route change */}
        <ScrollToTop behavior="auto" />

        <Navbar />
        <MiniCart />
        <MiniWishlist />

        <Suspense fallback={<div className="p-8">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/men" element={<Men />} />
            <Route path="/women" element={<Women />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/returns" element={<Returns />} />

            {/* NEW help pages */}
            <Route path="/help/shipping" element={<Shipping />} />
            <Route path="/help/contact" element={<Contact />} />
          </Routes>
        </Suspense>

        <Footer />
      </BrowserRouter>
    </StoreProvider>
  );
}
