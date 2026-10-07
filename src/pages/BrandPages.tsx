import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { allProducts, brandDirectory, categories } from "../data";

const letters = ["الكل", "ا", "ب", "ت", "ج", "د", "ر", "س", "ع", "ف", "ك", "ل", "م", "ن", "ه", "و", "ي"];

export function BrandsPage() {
  const groups = [
    { id: "all", label: "الكل" },
    ...categories.map((category) => ({ id: category.id === "fragrance" ? "fragrance" : category.id, label: category.label })),
  ];
  return (
    <div className="container page">
      <section className="page-hero tall">
        <img src="/images/hero-face-1.jpg" alt="" />
        <div>
          <p className="crumbs">
            <Link to="/">الرئيسية</Link>
            <span>/</span>
            <b>العلامات التجارية</b>
          </p>
          <h1>أجمل العلامات التجارية</h1>
          <p>اكتشفي أشهر وأرقى علامات الجمال العالمية في مكان واحد</p>
        </div>
      </section>
      <div className="icon-picks">
        {categories.slice(0, 6).map((category) => (
          <Link key={category.id} to={`/category/${category.id}`}>
            <span>{category.label}</span>
          </Link>
        ))}
      </div>
      <div className="chips">
        {letters.map((letter) => (
          <span key={letter}>{letter}</span>
        ))}
      </div>
      <h2>أبرز العلامات التجارية</h2>
      <div className="feature-brands">
        {brandDirectory.filter((brand) => brand.featured).slice(0, 4).map((brand) => (
          <article key={brand.slug}>
            <img src={brand.image} alt="" />
            <div>
              <strong className={brand.italic ? "italic" : undefined}>{brand.name}</strong>
              <Link to={`/brand/${brand.slug}`}>تسوقي الآن</Link>
            </div>
          </article>
        ))}
      </div>
      <h2>جميع العلامات التجارية</h2>
      <div className="brand-grid">
        {brandDirectory.map((brand) => (
          <Link key={brand.slug} to={`/brand/${brand.slug}`} className={brand.italic ? "italic" : undefined}>
            {brand.name}
          </Link>
        ))}
      </div>
      <div className="chips quiet">
        {groups.map((group) => (
          <Link key={group.id} to={group.id === "all" ? "/brands" : `/category/${group.id}`}>
            {group.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BrandPage() {
  const { slug } = useParams();
  const brand = brandDirectory.find((item) => item.slug === slug);
  const products = allProducts.filter((product) => product.brandSlug === slug);

  if (!brand) {
    return (
      <div className="container page-narrow">
        <h1>العلامة غير متوفرة</h1>
        <Link className="btn" to="/brands">
          كل العلامات
        </Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <section className="page-hero tall brand-hero">
        <img src={brand.image} alt="" />
        <div>
          <p className="crumbs">
            <Link to="/">الرئيسية</Link>
            <span>/</span>
            <Link to="/brands">العلامات التجارية</Link>
            <span>/</span>
            <b>{brand.name}</b>
          </p>
          <h1 className={brand.italic ? "italic" : undefined}>{brand.name}</h1>
          <p>{brand.title}</p>
          <a className="btn" href="#brand-products">
            تسوقي الآن
          </a>
        </div>
      </section>
      <section className="about-brand">
        <img src="/brand/icon.png" alt="" />
        <div>
          <h2>عن {brand.name}</h2>
          <p>{brand.about}</p>
        </div>
      </section>
      <section id="brand-products">
        <h2>منتجات {brand.name}</h2>
        {products.length === 0 ? (
          <div className="empty-card">
            <strong>التشكيلة ستصل قريبًا</strong>
            <p>نجهّز منتجات {brand.name} الآن. تصفحي بقية المتجر في هذه الأثناء.</p>
            <Link className="btn" to="/shop">
              تسوقي الكل
            </Link>
          </div>
        ) : (
          <div className="products">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
