import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../store";
import { BottomNav } from "./BottomNav";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { TopBar } from "./TopBar";

export function Layout() {
  const { cart, cartOpen, setCartOpen, setQty, toast } = useStore();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  return (
    <>
      <a className="skip" href="#main">
        تخطي إلى المحتوى
      </a>
      <TopBar />
      <Header />
      <main id="main" className="site-main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onQty={setQty}
        onRemove={(id) => setQty(id, 0)}
      />
      <BottomNav />
      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </>
  );
}

export function NotFound() {
  return (
    <div className="container page-narrow">
      <h1>الصفحة غير موجودة</h1>
      <p>ما لقينا هذه الصفحة. ارجعي للمتجر وتصفحي التشكيلة.</p>
      <Link className="btn" to="/">
        العودة للرئيسية
      </Link>
    </div>
  );
}
