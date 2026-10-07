import { useState } from "react";
import { Link } from "react-router-dom";
import { allProducts } from "../data";
import { money } from "../format";
import { useStore } from "../store";

const rewards = [
  { cost: 500, title: "خصم 5 د.ب", text: "على أي منتج" },
  { cost: 1000, title: "خصم 10 د.ب", text: "على أي منتج" },
  { cost: 2000, title: "هدية مجانية", text: "منتج مختار" },
];

const levels = [
  { name: "برونزي", at: 0 },
  { name: "فضي", at: 500 },
  { name: "ذهبي", at: 1000 },
  { name: "بلاتيني", at: 2000 },
];

export function RewardsPage() {
  const { points, redeem } = useStore();
  const [pick, setPick] = useState<number | null>(null);
  const level = [...levels].reverse().find((item) => points >= item.at) ?? levels[0];
  const next = levels.find((item) => item.at > points);
  const progress = Math.min(100, (points / 2000) * 100);

  return (
    <div className="container page">
      <header className="checkout-head">
        <h1>النقاط والمكافآت</h1>
        <p>اجمعي النقاط من مشترياتك واستبدليها بمكافآت مميزة</p>
      </header>
      <section className="points-card">
        <div>
          <p>المستوى {level.name}</p>
          <strong>{points.toLocaleString("en-US")}</strong>
          <span>نقطة متاحة</span>
          <small>{next ? `أنتِ على بعد ${next.at - points} نقطة للوصول إلى مستوى ${next.name}` : "وصلتِ إلى أعلى مستوى"}</small>
        </div>
        <div className="level-track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <ol className="level-names">
          {levels.map((item) => (
            <li key={item.name} className={points >= item.at ? "on" : ""}>
              {item.name}
              <small>{item.at}</small>
            </li>
          ))}
        </ol>
      </section>
      <h2>استبدال النقاط</h2>
      <div className="reward-grid">
        {rewards.map((reward) => (
          <article key={reward.cost}>
            <b>{reward.cost.toLocaleString("en-US")} نقطة</b>
            <strong>{reward.title}</strong>
            <p>{reward.text}</p>
            <button type="button" className="btn" disabled={points < reward.cost} onClick={() => setPick(reward.cost)}>
              استبدال الآن
            </button>
          </article>
        ))}
      </div>
      <section className="panel promo-strip">
        <div>
          <h2>مكافآت حصرية لأعضائنا</h2>
          <p>اكتشفي العروض الخاصة المخصصة لك</p>
        </div>
        <Link className="btn" to="/offers">
          تصفح العروض
        </Link>
      </section>
      <h2>كيف تحصلين على النقاط؟</h2>
      <div className="earn-grid">
        <article>
          <b>1 نقطة</b>
          <span>لكل 1 د.ب</span>
        </article>
        <article>
          <b>+50</b>
          <span>عند إنشاء الحساب</span>
        </article>
        <article>
          <b>+100</b>
          <span>عند تقييم منتج</span>
        </article>
        <article>
          <b>+20</b>
          <span>عند مشاركة التقييم</span>
        </article>
      </div>
      {pick ? (
        <div className="modal" role="dialog" aria-modal="true" aria-label="استبدال النقاط">
          <button type="button" className="overlay show" aria-label="إغلاق" onClick={() => setPick(null)} />
          <div className="sheet">
            <h2>استبدال النقاط</h2>
            <p>سيتم خصم {pick.toLocaleString("en-US")} نقطة من رصيدك.</p>
            <button
              type="button"
              className="btn wide"
              onClick={() => {
                if (redeem(pick)) setPick(null);
              }}
            >
              تأكيد الاستبدال
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function WishlistPage() {
  const { wished, toggleWish, addToCart } = useStore();
  const products = allProducts.filter((product) => wished.includes(product.id));
  return (
    <div className="container page">
      <header className="checkout-head">
        <h1>المفضلة</h1>
        <p>كل المنتجات التي حفظتها في مكان واحد</p>
      </header>
      <div className="chips">
        <Link to="/wishlist" className="on">
          الكل ({products.length})
        </Link>
        <Link to="/category/skin">العناية بالبشرة</Link>
        <Link to="/category/makeup">المكياج</Link>
        <Link to="/category/fragrance">العطور</Link>
      </div>
      {products.length === 0 ? (
        <div className="empty-card">
          <strong>قائمة المفضلة فارغة</strong>
          <p>اضغطي على القلب في أي منتج ليظهر هنا.</p>
          <Link className="btn" to="/shop">
            تسوقي الآن
          </Link>
        </div>
      ) : (
        <div className="wish-list">
          {products.map((product) => (
            <article key={product.id}>
              <button type="button" aria-label="إزالة من المفضلة" onClick={() => toggleWish(product.id)}>
                ♥
              </button>
              <img src={product.image} alt="" />
              <div>
                <h2>
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h2>
                <p>{product.volume}</p>
                <strong dir="ltr">{money(product.price)}</strong>
                <button type="button" className="btn" onClick={() => addToCart(product)}>
                  أضف إلى السلة
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
