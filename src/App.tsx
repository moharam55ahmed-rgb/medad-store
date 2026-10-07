import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthLayout } from "./components/AuthLayout";
import { Layout, NotFound } from "./components/Layout";
import { AccountPage, AddressesPage, NotificationsPage, OrdersPage, PaymentsPage, ReturnsPage } from "./pages/AccountPages";
import { ForgotPage, LoginPage, PasswordDonePage, PreferencesPage, RegisterPage, ResetPage, VerifyPage, WelcomePage } from "./pages/AuthPages";
import { BrandPage, BrandsPage } from "./pages/BrandPages";
import { CheckoutPage, ThanksPage, TrackPage } from "./pages/CheckoutPages";
import { Home } from "./pages/Home";
import { AboutPage, ContactPage } from "./pages/InfoPages";
import { ProductPage } from "./pages/ProductPage";
import { RewardsPage, WishlistPage } from "./pages/RewardsPages";
import { Shop } from "./pages/Shop";
import { StoreProvider } from "./store";

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="category/:slug" element={<Shop />} />
            <Route path="search" element={<Shop />} />
            <Route path="offers" element={<Shop />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="brand/:slug" element={<BrandPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="rewards" element={<RewardsPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="thanks" element={<ThanksPage />} />
            <Route path="track" element={<TrackPage />} />
            <Route path="track/:id" element={<TrackPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="returns" element={<ReturnsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="welcome" element={<WelcomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="verify" element={<VerifyPage />} />
            <Route path="preferences" element={<PreferencesPage />} />
            <Route path="forgot" element={<ForgotPage />} />
            <Route path="reset" element={<ResetPage />} />
            <Route path="password-done" element={<PasswordDonePage />} />
          </Route>
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  );
}
