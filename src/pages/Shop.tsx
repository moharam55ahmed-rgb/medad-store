import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { allProducts, categories, categoryMeta, skinTypes } from "../data";
import type { Product } from "../types";

const pageSize = 12;

const circleOrder = ["skin", "makeup", "fragrance", "hair", "gifts"];

const trust = [
  { src: "/footer/shield-check.png", title: "منتجات أصلية", note: "100%" },
  { src: "/footer/truck.png", title: "توصيل سريع", note: "لكافة المحافظات" },
  { src: "/footer/shield-drop.png", title: "دفع آمن", note: "ومتعدد الوسائل" },
  { src: "/footer/phone.png", title: "خدمة عملاء", note: "دائمًا معك" },
];

const stories = [
  { src: "/shop/article-skin.jpg?v=2", alt: "روتين العناية بالبشرة لبشرة صافية" },
  { src: "/shop/article-makeup.jpg?v=2", alt: "أهم أدوات المكياج للمبتدئات" },
  { src: "/shop/article-glow.jpg?v=2", alt: "نصائح للحفاظ على بشرة مشرقة" },
];

export function Shop() {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const offers = pathname === "/offers";
  const meta = slug ? categoryMeta[slug] : undefined;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50);
  const [pickedBrands, setPickedBrands] = useState<string[]>([]);
  const [pickedSkin, setPickedSkin] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [saleOnly, setSaleOnly] = useState(false);
  const [sort, setSort] = useState(params.get("sort") === "new" ? "new" : "popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    setPickedBrands([]);
    setPickedSkin([]);
    setSaleOnly(offers);
    setFiltersOpen(false);
  }, [slug, query, offers]);

  const pool = useMemo(() => {
    return allProducts.filter((product) => {
      if (slug && product.category !== slug) return false;
      if (query) {
        const hay = `${product.name} ${product.brand ?? ""} ${product.desc ?? ""}`;
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [slug, query]);

  const brands = [...new Set(pool.map((product) => product.brand).filter(Boolean))] as string[];

  const filtered = pool
    .filter((product) => product.price >= minPrice && product.price <= maxPrice)
    .filter((product) => (pickedBrands.length === 0 ? true : pickedBrands.includes(product.brand ?? "")))
    .filter((product) => (pickedSkin.length === 0 ? true : pickedSkin.includes(product.skinType ?? "")))
    .filter((product) => product.rating >= minRating)
    .filter((product) => (saleOnly ? Boolean(product.oldPrice) : true))
    .sort((a, b) => compare(a, b, sort));

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const crumb = offers ? "العروض" : meta?.label ?? "المتجر";
  const circles = circleOrder.flatMap((id) => {
    const category = categories.find((item) => item.id === id);
    return category ? [category] : [];
  });

  function toggle(list: string[], value: string, setList: (next: string[]) => void) {
    setPage(1);
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  return (
    <div className="container page shop-page">
      <p className="crumbs shop-crumbs">
        <Link to="/">الرئيسية</Link>
        <span>/</span>
        <b>{crumb}</b>
      </p>

      <img className="shop-banner" src="/shop/hero.jpg?v=2" alt="تسوقي كل منتجات الجمال" />

      <div className="shop-cats">
        <button type="button" className="shop-filter-btn" onClick={() => setFiltersOpen(true)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          تصفية النتائج
        </button>
        <Link className={pathname === "/shop" && !query ? "shop-cat on" : "shop-cat"} to="/shop">
          <span className="shop-bubble shop-bubble-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
          <b>كل المنتجات</b>
        </Link>
        {circles.map((category) => (
          <Link key={category.id} className={slug === category.id ? "shop-cat on" : "shop-cat"} to={category.href}>
            <span className="shop-bubble">
              <img src={category.image} alt="" />
            </span>
            <b>{category.label}</b>
          </Link>
        ))}
        <Link className={offers ? "shop-cat on" : "shop-cat"} to="/offers">
          <span className="shop-bubble">
            <img src="/rewards/percent.png" alt="" />
          </span>
          <b>العروض الخاصة</b>
        </Link>
      </div>

      <div className="shop-layout">
        <Filters
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          brands={brands}
          pickedBrands={pickedBrands}
          toggleBrand={(brand) => toggle(pickedBrands, brand, setPickedBrands)}
          skins={skinTypes}
          pickedSkin={pickedSkin}
          toggleSkin={(skin) => toggle(pickedSkin, skin, setPickedSkin)}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={(value) => {
            setMinPrice(value);
            setPage(1);
          }}
          setMaxPrice={(value) => {
            setMaxPrice(value);
            setPage(1);
          }}
          minRating={minRating}
          setMinRating={(value) => {
            setMinRating(value);
            setPage(1);
          }}
          saleOnly={saleOnly}
          setSaleOnly={(value) => {
            setSaleOnly(value);
            setPage(1);
          }}
          activeSlug={slug ?? ""}
          offers={offers}
          onClear={() => {
            setMinPrice(0);
            setMaxPrice(50);
            setPickedBrands([]);
            setPickedSkin([]);
            setMinRating(0);
            setSaleOnly(false);
            setPage(1);
          }}
        />

        <div>
          <div className="shop-toolbar">
            <p>
              عرض <b>{visible.length}</b> من <b>{filtered.length}</b> منتج
            </p>
            <label>
              الترتيب حسب
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
              >
                <option value="popular">الأكثر مبيعًا</option>
                <option value="new">وصل حديثًا</option>
                <option value="price-asc">السعر: من الأقل</option>
                <option value="price-desc">السعر: من الأعلى</option>
                <option value="rating">التقييم</option>
              </select>
            </label>
            <div className="view-toggle">
              <button type="button" className={view === "grid" ? "on" : ""} onClick={() => setView("grid")} aria-label="عرض شبكي">
                ▦
              </button>
              <button type="button" className={view === "list" ? "on" : ""} onClick={() => setView("list")} aria-label="عرض قائمة">
                ☰
              </button>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="empty-card">
              <strong>لا توجد منتجات مطابقة</strong>
              <p>جرّبي توسيع السعر أو مسح الفلاتر.</p>
            </div>
          ) : (
            <div className={view === "list" ? "products list-products" : "products"}>
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} layout={view} />
              ))}
            </div>
          )}

          <div className="shop-trust" aria-label="مزايا التسوق">
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

          <div className="pager">
            <button type="button" aria-label="الصفحة السابقة" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>
              ‹
            </button>
            {Array.from({ length: pages }, (_, index) => (
              <button key={index} type="button" className={safePage === index + 1 ? "on" : ""} onClick={() => setPage(index + 1)}>
                {index + 1}
              </button>
            ))}
            <button type="button" aria-label="الصفحة التالية" disabled={safePage === pages} onClick={() => setPage(safePage + 1)}>
              ›
            </button>
          </div>
        </div>
      </div>

      <section className="shop-stories" aria-label="مقالات ونصائح الجمال">
        <h2>مقالات ونصائح الجمال</h2>
        <div className="shop-story-row">
          {stories.map((story) => (
            <Link key={story.src} to="/#journal">
              <img src={story.src} alt={story.alt} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function compare(a: Product, b: Product, sort: string) {
  if (sort === "price-asc") return a.price - b.price;
  if (sort === "price-desc") return b.price - a.price;
  if (sort === "rating") return b.rating - a.rating;
  if (sort === "new") return Number(b.tone === "new") - Number(a.tone === "new");
  return b.reviews - a.reviews;
}

function countIn(category: string) {
  if (!category) return allProducts.length;
  return allProducts.filter((product) => product.category === category).length;
}

function Filters(props: {
  open: boolean;
  onClose: () => void;
  brands: string[];
  pickedBrands: string[];
  toggleBrand: (brand: string) => void;
  skins: string[];
  pickedSkin: string[];
  toggleSkin: (skin: string) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
  minRating: number;
  setMinRating: (value: number) => void;
  saleOnly: boolean;
  setSaleOnly: (value: boolean) => void;
  activeSlug: string;
  offers: boolean;
  onClear: () => void;
}) {
  const departments = [
    { href: "/shop", label: "جميع المنتجات", id: "" },
    ...circleOrder.map((id) => {
      const category = categories.find((item) => item.id === id);
      return { href: `/category/${id}`, label: category?.label ?? id, id };
    }),
  ];

  return (
    <>
      {props.open ? <button type="button" className="overlay show filter-overlay" aria-label="إغلاق التصفية" onClick={props.onClose} /> : null}
      <aside className={props.open ? "filters open" : "filters"} id="shop-filters">
        <div className="filters-head">
          <h2>تصفية النتائج</h2>
          <button type="button" onClick={props.onClear}>
            مسح
          </button>
        </div>

        <fieldset>
          <legend>الأقسام</legend>
          {departments.map((item) => {
            const on = item.id === "" ? props.activeSlug === "" && !props.offers : props.activeSlug === item.id;
            return (
              <Link key={item.href} to={item.href} className={on ? "filter-link on" : "filter-link"}>
                <i />
                <span>{item.label}</span>
                <small>({countIn(item.id)})</small>
              </Link>
            );
          })}
        </fieldset>

        <label className="filter-block">
          نطاق السعر
          <div className="price-ends" dir="ltr">
            <span>{props.minPrice.toFixed(3)}</span>
            <span>{props.maxPrice.toFixed(3)} د.ب</span>
          </div>
          <div className="price-range" dir="ltr">
            <input type="range" min={0} max={50} value={props.minPrice} onChange={(event) => props.setMinPrice(Number(event.target.value))} />
            <input type="range" min={0} max={50} value={props.maxPrice} onChange={(event) => props.setMaxPrice(Number(event.target.value))} />
          </div>
        </label>

        <fieldset>
          <legend>نوع البشرة</legend>
          {props.skins.map((skin) => (
            <label key={skin}>
              <input type="checkbox" checked={props.pickedSkin.includes(skin)} onChange={() => props.toggleSkin(skin)} />
              {skin}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>العلامة التجارية</legend>
          {props.brands.map((brand) => (
            <label key={brand}>
              <input type="checkbox" checked={props.pickedBrands.includes(brand)} onChange={() => props.toggleBrand(brand)} />
              {brand}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>العروض</legend>
          <label>
            <input type="checkbox" checked={props.saleOnly} onChange={() => props.setSaleOnly(!props.saleOnly)} />
            المنتجات المخفضة فقط
          </label>
        </fieldset>

        <fieldset>
          <legend>تقييم العملاء</legend>
          {[5, 4, 3, 0].map((rating) => (
            <label key={rating}>
              <input type="radio" name="rating" checked={props.minRating === rating} onChange={() => props.setMinRating(rating)} />
              {rating === 0 ? "الكل" : `${rating} نجوم${rating < 5 ? " فأكثر" : ""}`}
            </label>
          ))}
        </fieldset>

        <button type="button" className="btn wide" onClick={props.onClose}>
          تطبيق الفلتر
        </button>
      </aside>
    </>
  );
}
