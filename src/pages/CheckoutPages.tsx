import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { allProducts } from "../data";
import { money } from "../format";
import { useStore } from "../store";
import type { Order } from "../types";

const payments = [
  { id: "card", label: "بطاقة بنكية" },
  { id: "apple", label: "Apple Pay" },
  { id: "cod", label: "الدفع عند الاستلام" },
  { id: "tamara", label: "تمارا - تقسيط بدون فوائد" },
  { id: "tabby", label: "تابي - تقسيط بدون فوائد" },
];

const steps = ["المراجعة", "الدفع", "الشحن"];

export function CheckoutPage() {
  const { cart } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("card");
  const [note, setNote] = useState("");
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal >= 20 ? 2 : 0;
  const shipping = subtotal === 0 ? 0 : subtotal >= 30 ? 0 : 1.5;
  const total = Math.max(subtotal - discount + shipping, 0);

  if (cart.length === 0) {
    return (
      <div className="container page-narrow">
        <h1>سلتك فارغة</h1>
        <p>أضيفي منتجاتك أولًا ثم أتممي الطلب.</p>
        <Link className="btn" to="/shop">
          تسوقي الآن
        </Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <header className="checkout-head">
        <h1>مراجعة الطلب</h1>
        <p>أكملي بياناتك لإتمام الطلب بأمان</p>
        <ol className="steps">
          {steps.map((label, index) => (
            <li key={label} className={index <= step ? "on" : ""}>
              <button type="button" onClick={() => setStep(index)}>
                {label}
              </button>
            </li>
          ))}
        </ol>
      </header>
      <div className="split">
        <div className="stack">
          <section className="panel">
            <h2>المنتجات ({cart.length})</h2>
            {cart.map((item) => (
              <article key={item.id} className="line-item">
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {item.volume ?? "قطعة"} × {item.qty}
                  </span>
                </div>
                <b dir="ltr">{money(item.price * item.qty)}</b>
              </article>
            ))}
          </section>
          {step >= 1 ? (
            <section className="panel">
              <h2>طرق الدفع</h2>
              {payments.map((item) => (
                <label key={item.id} className={payment === item.id ? "pay-option on" : "pay-option"}>
                  <input type="radio" name="pay" checked={payment === item.id} onChange={() => setPayment(item.id)} />
                  {item.label}
                </label>
              ))}
              <button type="button" className="btn wide" onClick={() => setStep(2)}>
                متابعة إلى الشحن
              </button>
            </section>
          ) : null}
          {step >= 2 ? (
            <section className="panel">
              <h2>عنوان الشحن</h2>
              <p>سارة أحمد</p>
              <p>المنامة، الدبلوماسية، البحرين</p>
              <p dir="ltr">+973 3999 1234</p>
              <label>
                ملاحظة للطلب
                <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="مثال: اتركي الطلب عند الاستقبال" />
              </label>
              <Link className="text-btn" to="/addresses">
                تغيير العنوان
              </Link>
            </section>
          ) : null}
        </div>
        <aside className="panel summary">
          <h2>ملخص الطلب</h2>
          <p>
            <span>المجموع الفرعي</span>
            <b dir="ltr">{money(subtotal)}</b>
          </p>
          <p>
            <span>خصم</span>
            <b dir="ltr">{discount ? `- ${money(discount)}` : money(0)}</b>
          </p>
          <p>
            <span>رسوم الشحن</span>
            <b>{shipping === 0 ? "مجاناً" : money(shipping)}</b>
          </p>
          <p className="total">
            <span>إجمالي الطلب</span>
            <b dir="ltr">{money(total)}</b>
          </p>
          <PlaceButton payment={payments.find((item) => item.id === payment)?.label ?? payment} note={note} />
          <small>جميع المعاملات مؤمنة ومشفرة</small>
        </aside>
      </div>
      <button type="button" className="btn wide mobile-only" onClick={() => navigate("/shop")}>
        متابعة التسوق
      </button>
    </div>
  );
}

function PlaceButton({ payment }: { payment: string; note: string }) {
  const { placeOrder } = useStore();
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="btn wide"
      onClick={() => {
        const order = placeOrder(payment);
        if (order) navigate("/thanks", { state: { id: order.id } });
      }}
    >
      إتمام الدفع بأمان
    </button>
  );
}

export function ThanksPage() {
  const { orders, points } = useStore();
  const order = orders[0];
  const suggested = allProducts.slice(0, 4);
  if (!order) return null;
  return (
    <div className="container page thanks">
      <img className="thanks-art" src="/images/gift.jpg" alt="" />
      <h1>شكرًا لك!</h1>
      <p>تم استلام طلبك بنجاح. سنبدأ في تجهيز طلبك قريبًا، وستصلك رسالة على واتساب عند كل تحديث.</p>
      <div className="meta-row">
        <div>
          <span>رقم الطلب</span>
          <strong>#{order.id}</strong>
        </div>
        <div>
          <span>تاريخ الطلب</span>
          <strong>
            {order.date} {order.time}
          </strong>
        </div>
      </div>
      <StatusLine status={order.status} />
      <div className="pdp-actions">
        <Link className="btn" to={`/track/${order.id}`}>
          تتبع الطلب
        </Link>
        <Link className="btn ghost" to="/">
          العودة إلى التسوق
        </Link>
      </div>
      <section className="points-banner">
        <div>
          <h2>اكسب المزيد من النقاط!</h2>
          <p>رصيدك الآن {points.toLocaleString("en-US")} نقطة</p>
        </div>
        <strong>{points.toLocaleString("en-US")}</strong>
      </section>
      <h2>منتجات قد تعجبك</h2>
      <div className="products">
        {suggested.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export function TrackPage() {
  const { id } = useParams();
  const { orders } = useStore();
  const order = orders.find((item) => item.id === id) ?? orders[0];
  if (!order) {
    return (
      <div className="container page-narrow">
        <h1>لا يوجد طلب</h1>
        <Link className="btn" to="/shop">
          تسوقي الآن
        </Link>
      </div>
    );
  }
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal - order.discount + order.shipping;
  return (
    <div className="container page">
      <header className="checkout-head">
        <h1>تم استلام طلبك بنجاح</h1>
        <p>
          #{order.id} · {order.date} {order.time}
        </p>
      </header>
      <div className="split">
        <div className="stack">
          <section className="panel">
            <h2>حالة الطلب الحالية</h2>
            <StatusLine status={order.status} />
            <p className="muted">جاري تجهيز طلبك في مستودعات مداد. سنقوم بإعلامك بمجرد شحن الطلب.</p>
          </section>
          <section className="panel">
            <h2>تفاصيل الطلب</h2>
            {order.items.map((item) => (
              <article key={item.id} className="line-item">
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {item.volume} × {item.qty}
                  </span>
                </div>
                <b dir="ltr">{money(item.price * item.qty)}</b>
              </article>
            ))}
          </section>
        </div>
        <aside className="stack">
          <section className="panel">
            <h2>ملخص الدفع</h2>
            <p>
              <span>المجموع</span>
              <b dir="ltr">{money(subtotal)}</b>
            </p>
            <p>
              <span>الخصم</span>
              <b dir="ltr">{money(order.discount)}</b>
            </p>
            <p>
              <span>الشحن</span>
              <b>{order.shipping === 0 ? "مجاناً" : money(order.shipping)}</b>
            </p>
            <p className="total">
              <span>الإجمالي</span>
              <b dir="ltr">{money(total)}</b>
            </p>
          </section>
          <section className="panel">
            <h2>عنوان الشحن</h2>
            <p>{order.name}</p>
            <p>{order.address}</p>
            <p dir="ltr">{order.phone}</p>
          </section>
          <Link className="btn wide" to="/returns">
            طلب إرجاع
          </Link>
        </aside>
      </div>
    </div>
  );
}

export function StatusLine({ status }: { status: Order["status"] }) {
  const labels = ["تم استلام الطلب", "تم الدفع", "قيد التجهيز", "تم الشحن", "تم التوصيل"];
  const active = status === "received" ? 0 : status === "preparing" ? 2 : status === "shipped" ? 3 : 4;
  return (
    <ol className="status-line">
      {labels.map((label, index) => (
        <li key={label} className={index <= active ? "on" : ""}>
          {label}
        </li>
      ))}
    </ol>
  );
}
