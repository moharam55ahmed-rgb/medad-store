import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { allProducts, nav } from "../data";
import { money } from "../format";
import { useStore } from "../store";
import { Icon, IconHeart } from "./Icons";
import { Logo } from "./Logo";

const menuLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/shop", label: "المتجر" },
  { to: "/brands", label: "العلامات التجارية" },
  { to: "/wishlist", label: "المفضلة" },
  { to: "/offers", label: "العروض" },
  { to: "/orders", label: "طلباتي" },
  { to: "/rewards", label: "نقاطي ومكافآتي" },
  { to: "/account", label: "حسابي" },
  { to: "/addresses", label: "عناوين الشحن" },
  { to: "/payments", label: "طرق الدفع" },
  { to: "/returns", label: "طلبات الإرجاع" },
  { to: "/notifications", label: "الإشعارات" },
];

export function Header() {
  const { count, wished, points, profile, loggedIn, logout, setCartOpen } = useStore();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const results = allProducts.filter((product) => product.name.includes(query.trim()) || product.brand?.includes(query.trim())).slice(0, 6);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!barRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  return (
    <header className="header">
      <div className="container" ref={barRef}>
        <div className="header-row">
          <nav className="nav" aria-label="الأقسام">
            {nav.map((item) => (
              <NavLink key={item.href} to={item.href} end={item.href === "/"} className={({ isActive }) => (isActive ? "active" : undefined)}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Logo />
          <div className="tools">
            <form
              className="search"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                const term = query.trim();
                if (!term) return;
                setSearchOpen(false);
                navigate(`/search?q=${encodeURIComponent(term)}`);
              }}
            >
              <Icon name="search" />
              <input
                type="search"
                placeholder="ابحثي عن منتجاتك المفضلة"
                value={query}
                aria-label="بحث"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
              />
              {searchOpen && query.trim() ? (
                <div className="search-results">
                  {results.length === 0 ? (
                    <p className="search-empty">لا توجد نتائج مطابقة</p>
                  ) : (
                    results.map((product) => (
                      <Link
                        key={product.id}
                        className="search-hit"
                        to={`/product/${product.id}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                        }}
                      >
                        <img src={product.image} alt="" />
                        <span>
                          <b>{product.name}</b>
                          <span dir="ltr">{money(product.price)}</span>
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              ) : null}
            </form>
            <div className="tool">
              <button
                type="button"
                className="icon-btn"
                aria-label="الحساب"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((open) => !open)}
              >
                <Icon name="user" />
              </button>
              {accountOpen ? (
                <div className="popover account-pop">
                  {loggedIn ? (
                    <>
                      <strong>مرحبًا {profile.name.split(" ")[0]}</strong>
                      <p>لديك {points.toLocaleString("en-US")} نقطة</p>
                      <span className="tier-pill">عضوة ذهبية</span>
                      <Link to="/account">حسابي</Link>
                      <Link to="/orders">طلباتي</Link>
                      <Link to="/rewards">النقاط والمكافآت</Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          navigate("/login");
                        }}
                      >
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <>
                      <strong>أهلًا بكِ</strong>
                      <p>سجّلي الدخول لمتابعة طلباتك ونقاطك.</p>
                      <Link className="btn" to="/login">
                        تسجيل الدخول
                      </Link>
                    </>
                  )}
                </div>
              ) : null}
            </div>
            <Link to="/wishlist" className="icon-btn" aria-label="المفضلة">
              <IconHeart filled={wished.length > 0} />
              {wished.length > 0 ? <span className="badge-count">{wished.length}</span> : null}
            </Link>
            <button type="button" className="icon-btn" aria-label="السلة" onClick={() => setCartOpen(true)}>
              <Icon name="bag" />
              {count > 0 ? <span className="badge-count">{count}</span> : null}
            </button>
            <button
              type="button"
              className="icon-btn menu-btn"
              aria-label="القائمة"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </div>
      {menuOpen ? (
        <>
          <button type="button" className="overlay show" aria-label="إغلاق القائمة" onClick={() => setMenuOpen(false)} />
          <aside className="menu-panel" aria-label="قائمة الجوال">
            <div className="menu-user">
              <img src="/images/face-sara.jpg" alt="" />
              <div>
                <strong>{loggedIn ? profile.name : "زائرة"}</strong>
                <span>{loggedIn ? `${points.toLocaleString("en-US")} نقطة` : "سجّلي الدخول"}</span>
              </div>
            </div>
            {menuLinks.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            {loggedIn ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                  navigate("/login");
                }}
              >
                تسجيل الخروج
              </button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                تسجيل الدخول
              </Link>
            )}
          </aside>
        </>
      ) : null}
      <div className="header-curve" aria-hidden="true">
        <svg viewBox="0 0 230 10" preserveAspectRatio="none">
          <path fill="#fffcfb" d="M0,0 H28 C64,0 78,10 115,10 C152,10 166,0 202,0 H230 Z" />
        </svg>
      </div>
    </header>
  );
}
