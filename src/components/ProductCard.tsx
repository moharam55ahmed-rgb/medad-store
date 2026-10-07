import { useState } from "react";
import { Link } from "react-router-dom";
import { money } from "../format";
import { useStore } from "../store";
import type { Product } from "../types";
import { IconHeart, IconStar } from "./Icons";

export function ProductCard({ product, layout = "grid" }: { product: Product; layout?: "grid" | "list" }) {
  const { wished, toggleWish, addToCart } = useStore();
  const loved = wished.includes(product.id);
  const [added, setAdded] = useState(false);

  return (
    <article className={layout === "list" ? "product-card list-card" : "product-card"} id={`product-${product.id}`}>
      <div className="product-media">
        {product.badge ? (
          <span className={product.tone === "sale" ? "badge sale" : "badge"} dir={product.tone === "sale" ? "ltr" : undefined}>
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          className={loved ? "wish on" : "wish"}
          aria-label={loved ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          aria-pressed={loved}
          onClick={() => toggleWish(product.id)}
        >
          <IconHeart filled={loved} />
        </button>
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} />
        </Link>
      </div>
      <div className="product-copy">
        {product.brand ? <small className="brand-name">{product.brand}</small> : null}
        <h3>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        {product.volume ? <p className="volume">{product.volume}</p> : null}
        <div className="rating">
          <span className="stars" aria-label={`التقييم ${product.rating} من 5`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconStar key={star} on={star <= Math.round(product.rating)} />
            ))}
          </span>
          <span>({product.reviews})</span>
        </div>
        <div className="price">
          <strong dir="ltr">{money(product.price)}</strong>
          {product.oldPrice ? <s dir="ltr">{money(product.oldPrice)}</s> : null}
        </div>
        <button
          type="button"
          className="add"
          onClick={() => {
            addToCart(product);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1200);
          }}
        >
          {added ? "تمت الإضافة" : "أضف إلى السلة"}
        </button>
      </div>
    </article>
  );
}
