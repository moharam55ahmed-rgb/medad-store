import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { brands } from "../data";
import { Logo } from "./Logo";

const infoLinks = [
  { href: "/about", label: "من نحن" },
  { href: "/about", label: "سياسة الخصوصية" },
  { href: "/about", label: "الشروط والأحكام" },
  { href: "/track", label: "تتبع الطلب" },
  { href: "/returns", label: "خدمة ما بعد البيع" },
];

const serviceLinks = [
  { href: "/contact", label: "تواصل معنا" },
  { href: "/notifications", label: "الأسئلة الشائعة" },
  { href: "/brands", label: "العلامات التجارية" },
  { href: "/#journal", label: "المدونة" },
  { href: "/#journal", label: "مقالات الجمال" },
];

const shopLinks = [
  { href: "/category/skin", label: "العناية بالبشرة" },
  { href: "/category/makeup", label: "المكياج" },
  { href: "/category/fragrance", label: "العطور" },
  { href: "/category/hair", label: "العناية بالشعر" },
  { href: "/category/body", label: "العناية بالجسم" },
  { href: "/offers", label: "العروض" },
];

const socials = [
  { src: "/footer/instagram.png", label: "إنستغرام" },
  { src: "/footer/tiktok.png", label: "تيك توك" },
  { src: "/footer/youtube.png", label: "يوتيوب" },
  { src: "/footer/snapchat.png", label: "سناب شات" },
  { src: "/footer/facebook.png", label: "فيسبوك" },
];

const trust = [
  { src: "/footer/shield-check.png", title: "منتجات أصلية", note: "100%" },
  { src: "/footer/truck.png", title: "شحن سريع", note: "لكافة المحافظات" },
  { src: "/footer/shield-drop.png", title: "دفع آمن", note: "ومضمون" },
  { src: "/footer/returns.png", title: "سهولة الاسترجاع", note: "خلال 14 يوم" },
  { src: "/footer/phone.png", title: "خدمة عملاء مميزة", note: "على مدار الساعة" },
];

export function Footer() {
  const brandsRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [soon, setSoon] = useState(false);

  function subscribe(event: FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setOk(false);
      setMessage("اكتبي بريدًا إلكترونيًا صحيحًا");
      return;
    }
    setOk(true);
    setMessage("تم الاشتراك. أهلًا بكِ في نشرة مداد");
    setEmail("");
  }

  function slideBrands(direction: number) {
    brandsRef.current?.scrollBy({ left: direction * 220, behavior: "smooth" });
  }

  return (
    <footer className="footer" id="footer">
      <div className="footer-brands-wrap">
        <div className="container footer-brands">
          <button type="button" className="brand-arrow" aria-label="السابق" onClick={() => slideBrands(-1)}>
            ‹
          </button>
          <div className="footer-brands-track" ref={brandsRef}>
            {brands.map((brand) => (
              <Link key={brand.slug} to={`/brand/${brand.slug}`} className={brand.italic ? "italic" : undefined}>
                {brand.name}
              </Link>
            ))}
          </div>
          <button type="button" className="brand-arrow" aria-label="التالي" onClick={() => slideBrands(1)}>
            ›
          </button>
        </div>
      </div>

      <div className="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 86" preserveAspectRatio="none">
          <path
            fill="#f6d4c8"
            d="M0,40 C110,10 210,6 330,26 C460,48 540,66 680,56 C820,46 900,18 1040,14 C1180,10 1300,32 1440,28 L1440,86 L0,86 Z"
          />
          <path
            fill="#fde2d7"
            d="M0,58 C150,34 270,30 400,44 C540,60 630,74 780,64 C940,52 1020,34 1160,32 C1300,30 1380,46 1440,50 L1440,86 L0,86 Z"
          />
        </svg>
      </div>

      <div className="footer-body">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Logo />
            <p className="footer-tagline">لأن جمالك .. حكاية نكتبها معاً</p>
            <div className="footer-stores">
              <button type="button" onClick={() => setSoon(true)} aria-label="App Store">
                <img src="/footer/app-store.png" alt="Download on the App Store" />
              </button>
              <button type="button" onClick={() => setSoon(true)} aria-label="Google Play">
                <img src="/footer/google-play.png" alt="Google Play" />
              </button>
            </div>
            {soon ? <p className="soon">التطبيق قريبًا على المتاجر</p> : null}
            <div className="footer-pay" aria-label="وسائل الدفع">
              <img src="/footer/payments.png" alt="VISA وMastercard ومدى وJCB" />
            </div>
          </div>

          <div className="footer-news-col">
            <h3>اشتركي في نشرتنا البريدية</h3>
            <p>ليصلك كل جديد من عروض ونصائح الجمال</p>
            <form className="footer-news" onSubmit={subscribe}>
              <input
                type="email"
                name="email"
                placeholder="بريدك الإلكتروني"
                value={email}
                aria-label="البريد الإلكتروني"
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" aria-label="اشتركي">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 12H6M11 7l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
            {message ? <p className={ok ? "form-ok" : "form-error"}>{message}</p> : null}
            <div className="footer-social" aria-label="وسائل التواصل">
              {socials.map((item) => (
                <a key={item.label} href="#footer" aria-label={item.label}>
                  <img src={item.src} alt="" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3>معلومات</h3>
            {infoLinks.map((link) => (
              <Link key={link.label} to={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div>
            <h3>خدمات مداد</h3>
            {serviceLinks.map((link) => (
              <Link key={link.label} to={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div>
            <h3>تسوقي</h3>
            {shopLinks.map((link) => (
              <Link key={link.label} to={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container bottom-bar">
            <div className="trust">
              {trust.map((item) => (
                <span key={item.title}>
                  <img src={item.src} alt="" />
                  <span>
                    <b>{item.title}</b>
                    <small>{item.note}</small>
                  </span>
                </span>
              ))}
            </div>
            <p className="copyright">
              © 2026 <strong>قيمة تك</strong>. جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
