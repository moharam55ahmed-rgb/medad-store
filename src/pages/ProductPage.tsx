import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { Icon, IconHeart, IconStar } from "../components/Icons";
import { allProducts, categoryMeta } from "../data";
import { money } from "../format";
import { useStore } from "../store";

const volumes = [
  { label: "15 مل", factor: 0.62 },
  { label: "30 مل", factor: 0.82 },
  { label: "50 مل", factor: 1 },
];

const roseGallery = ["/product/main.png", "/product/jar.png", "/product/smear.png", "/product/face.png"];

const trust = [
  { icon: "/product/ico-authentic.png", title: "منتجات أصلية", text: "100%" },
  { icon: "/product/ico-pay.png", title: "دفع آمن", text: "ومعلومات محمية" },
  { icon: "/product/ico-truck.png", title: "توصيل سريع", text: "خلال 1-2 يوم" },
  { icon: "/product/ico-return.png", title: "إرجاع سهل", text: "خلال 14 يوم" },
  { icon: "/product/ico-support.png", title: "خدمة عملاء متميزة", text: "عبر الواتساب" },
];

const features = [
  { icon: "/product/feat-drop.png", text: "ترطيب عميق يدوم طوال اليوم" },
  { icon: "/product/feat-spark.png", text: "بشرة أكثر إشراقًا ونضارة" },
  { icon: "/product/feat-waves.png", text: "يحسن ملمس البشرة ويمنحها نعومة فورية" },
  { icon: "/product/feat-lotus.png", text: "مستخلص الورد الطبيعي يهدي ويغذي البشرة" },
  { icon: "/product/feat-shield.png", text: "مناسب لجميع أنواع البشرة" },
];

const pays = [
  { src: "/product/visa.png", alt: "VISA" },
  { src: "/product/mastercard.png", alt: "Mastercard" },
  { src: "/product/applepay.png", alt: "Apple Pay" },
  { src: "/product/benefit.png", alt: "BenefitPay" },
];

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find((item) => item.id === id);
  const { addToCart, toggleWish, wished, notify } = useStore();
  const [volume, setVolume] = useState(2);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "use" | "ingredients" | "reviews">("desc");
  const [payOpen, setPayOpen] = useState(false);
  const [plan, setPlan] = useState<"tabby" | "tamara">("tabby");
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(5);
  const [sent, setSent] = useState(false);
  const gallery = useMemo(() => (product?.id === "cream" ? roseGallery : product ? [product.image] : []), [product]);
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    setPhoto(0);
    setQty(1);
    setVolume(2);
    setTab("desc");
  }, [id]);

  if (!product) {
    return (
      <div className="container page-narrow">
        <h1>المنتج غير متوفر</h1>
        <Link className="btn" to="/shop">
          العودة للتسوق
        </Link>
      </div>
    );
  }

  const price = product.price * volumes[volume].factor;
  const old = product.oldPrice ? product.oldPrice * volumes[volume].factor : undefined;
  const installment = price / 4;
  const off = old ? Math.round((1 - price / old) * 100) : 0;
  const related = allProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 5);
  const loved = wished.includes(product.id);
  const cat = product.category ? categoryMeta[product.category] : undefined;
  const lead = product.id === "cream" ? "لبشرة ناعمة ومضيئة طوال اليوم" : product.brand;
  const story =
    product.id === "cream"
      ? "كريم ترطيب فاخر يمنح بشرتك عناية متكاملة وترطيبًا عميقًا يدوم طوال اليوم. يحتوي على مستخلص الورد الطبيعي ومجموعة من المكونات المغذية التي تساعد على تحسين ملمس البشرة، وتعزيز إشراقها، ومنحها مظهرًا أكثر صحة وحيوية. تركيبته الخفيفة تُمتص بسرعة دون أن تترك ملمسًا دهنيًا، ليمنحك بشرة ناعمة ومشرقة في كل استخدام."
      : product.desc;

  return (
    <div className="container page pdp-page">
      <p className="crumbs">
        <Link to="/">الرئيسية</Link>
        <span>/</span>
        <Link to={product.category ? `/category/${product.category}` : "/shop"}>{cat?.label ?? "المتجر"}</Link>
        <span>/</span>
        <b>{product.name}</b>
      </p>

      <div className="pdp-top">
        <div className="pdp-gallery">
          <div className="pdp-stage">
            <img src={gallery[photo] ?? product.image} alt={product.name} />
            {product.id === "cream" && photo === 0 ? (
              <div className="pdp-badge">
                <small>بشرة أكثر</small>
                <strong>إشراقًا</strong>
                <small>من أول استخدام</small>
              </div>
            ) : null}
          </div>
          {gallery.length > 1 ? (
            <div className="pdp-thumbs">
              {gallery.map((src, index) => (
                <button key={src} type="button" className={photo === index ? "on" : ""} onClick={() => setPhoto(index)}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="pdp-buy">
          {product.badge && !product.badge.startsWith("-") ? <span className="pdp-kicker">{product.badge}</span> : null}
          <h1>{product.name}</h1>
          <p className="pdp-lead">{lead}</p>
          <div className="rating">
            <span className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <IconStar key={star} on={star <= Math.round(product.rating)} />
              ))}
            </span>
            <span>
              ({product.reviews} تقييم)
            </span>
          </div>
          <p className="pdp-story">{story}</p>
          <div className="pdp-price">
            <strong dir="ltr">{money(price)}</strong>
            {old ? <s dir="ltr">{money(old)}</s> : null}
            {off > 0 ? <em className="pdp-off">-{off}%</em> : null}
          </div>

          <p className="field-label">الحجم</p>
          <div className="pdp-sizes">
            {volumes.map((item, index) => (
              <button key={item.label} type="button" className={volume === index ? "on" : ""} onClick={() => setVolume(index)}>
                {item.label}
              </button>
            ))}
          </div>

          <p className="field-label">الكمية</p>
          <div className="qty pdp-qty">
            <button type="button" aria-label="إنقاص الكمية" onClick={() => setQty((value) => Math.max(1, value - 1))}>
              −
            </button>
            <span>{qty}</span>
            <button type="button" aria-label="زيادة الكمية" onClick={() => setQty((value) => value + 1)}>
              +
            </button>
          </div>

          <div className="pdp-actions">
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                addToCart(product, qty);
                navigate("/checkout");
              }}
            >
              اشتري الآن
            </button>
            <button type="button" className="btn" onClick={() => addToCart(product, qty)}>
              <Icon name="bag" />
              أضف إلى السلة
            </button>
          </div>
          <div className="pdp-links">
            <button type="button" className={loved ? "on" : ""} onClick={() => toggleWish(product.id)}>
              <IconHeart filled={loved} />
              {loved ? "في المفضلة" : "أضف إلى المفضلة"}
            </button>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href);
                notify("تم نسخ رابط المنتج");
              }}
            >
              مشاركة المنتج
            </button>
          </div>
        </div>
      </div>

      <button type="button" className="pay-card" onClick={() => setPayOpen(true)}>
        <img className="pay-wallet" src="/product/wallet.png" alt="" />
        <div className="pay-copy">
          <strong>متاح التقسيط على 4 دفعات بدون فوائد</strong>
          <span>لجميع البطاقات في البحرين</span>
          <div className="pay-line">
            <b dir="ltr">{money(installment)} لكل دفعة</b>
            <img src="/product/tabby.png" alt="tabby" />
            <img src="/product/tamara.png" alt="tamara" />
          </div>
        </div>
        <div className="pay-logos">
          {pays.map((item) => (
            <img key={item.alt} src={item.src} alt={item.alt} />
          ))}
        </div>
      </button>

      <ul className="pdp-trust">
        {trust.map((item) => (
          <li key={item.title}>
            <span className="pdp-circle">
              <img src={item.icon} alt="" />
            </span>
            <span>
              <b>{item.title}</b>
              {item.text}
            </span>
          </li>
        ))}
      </ul>

      <ul className="pdp-feats">
        {features.map((item) => (
          <li key={item.text}>
            <span className="pdp-circle">
              <img src={item.icon} alt="" />
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>

      <div className="pdp-tabs">
        {(
          [
            ["desc", "الوصف"],
            ["use", "طريقة الاستخدام"],
            ["ingredients", "المكونات"],
            ["reviews", `التقييمات (${product.reviews})`],
          ] as const
        ).map(([key, label]) => (
          <button key={key} type="button" className={tab === key ? "on" : ""} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className="pdp-panel">
        {tab === "desc" ? (
          <div className="pdp-desc">
            <div className="pdp-desc-photo">
              <img src={product.id === "cream" ? "/product/smear.png" : product.image} alt="" />
            </div>
            <div>
              <h2>وصف المنتج</h2>
              <p>{story}</p>
              <ul>
                <li>خالٍ من البارابين</li>
                <li>خالٍ من الكبريتات</li>
                <li>مناسب للبشرة الحساسة</li>
                <li>مختبر جلديًا</li>
              </ul>
            </div>
          </div>
        ) : null}
        {tab === "use" ? (
          <p>ضعي كمية صغيرة على بشرة نظيفة صباحًا ومساءً، ثم دلّكي بلطف حتى الامتصاص. في النهار أتبعيه بواقي شمس.</p>
        ) : null}
        {tab === "ingredients" ? (
          <p>ماء الورد، جلسرين، حمض الهيالورونيك، فيتامين هـ، ومستخلصات مهدئة. خالٍ من العطور الثقيلة والبارابين والكبريتات.</p>
        ) : null}
        {tab === "reviews" ? (
          <div className="review-box">
            <h2>تقييم المنتج</h2>
            <div className="choice-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" className={reviewStars >= star ? "on" : ""} onClick={() => setReviewStars(star)}>
                  {star} ★
                </button>
              ))}
            </div>
            <textarea value={reviewText} placeholder="شاركي رأيك مع هذا المنتج" onChange={(event) => setReviewText(event.target.value)} />
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (reviewText.trim().length < 8) {
                  notify("اكتبي تقييمًا أوضح");
                  return;
                }
                setSent(true);
                setReviewText("");
                notify("شكرًا، تم إرسال تقييمك");
              }}
            >
              إرسال التقييم
            </button>
            <article className="review">
              <img src="/images/face-sara.jpg" alt="" />
              <div>
                <strong>سارة محمد</strong>
                <p>قوام خفيف وريحة هادية، وبشرتي بقيت مرتاحة طول اليوم.</p>
              </div>
            </article>
            {sent ? (
              <article className="review">
                <strong>تقييمك</strong>
                <p>تم نشر تقييمك ضمن مراجعات المنتج.</p>
              </article>
            ) : null}
          </div>
        ) : null}
      </div>

      {related.length > 0 ? (
        <section className="section pdp-related">
          <h2>منتجات قد تعجبك</h2>
          <div className="pdp-related-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="buy-bar">
        <strong dir="ltr">{money(price)}</strong>
        <button type="button" className="btn" onClick={() => addToCart(product, qty)}>
          أضف إلى السلة
        </button>
      </div>

      {payOpen ? (
        <div className="modal" role="dialog" aria-modal="true" aria-label="التقسيط">
          <button type="button" className="overlay show" aria-label="إغلاق" onClick={() => setPayOpen(false)} />
          <div className="sheet">
            <h2>تفاصيل التقسيط</h2>
            <div className="choice-row">
              <button type="button" className={plan === "tabby" ? "on" : ""} onClick={() => setPlan("tabby")}>
                tabby
              </button>
              <button type="button" className={plan === "tamara" ? "on" : ""} onClick={() => setPlan("tamara")}>
                tamara
              </button>
            </div>
            <ul className="plan-list">
              {["اليوم", "بعد شهر", "بعد شهرين", "بعد 3 أشهر"].map((when) => (
                <li key={when}>
                  <span>{when}</span>
                  <b dir="ltr">{money(installment)}</b>
                </li>
              ))}
            </ul>
            <button type="button" className="btn wide" onClick={() => setPayOpen(false)}>
              اختيار {plan}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
