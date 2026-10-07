import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icons";
import { allProducts } from "../data";
import { money } from "../format";
import { useStore } from "../store";
import type { IconName } from "../types";
import { StatusLine } from "./CheckoutPages";

const side: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: "/account", label: "حسابي", icon: "user", end: true },
  { to: "/account#profile", label: "الملف الشخصي", icon: "user" },
  { to: "/orders", label: "طلباتي", icon: "box" },
  { to: "/wishlist", label: "المفضلة", icon: "reward" },
  { to: "/rewards", label: "نقاطي ومكافآتي", icon: "points" },
  { to: "/addresses", label: "عناويني", icon: "pin" },
  { to: "/payments", label: "طرق الدفع", icon: "card" },
  { to: "/notifications", label: "الإشعارات", icon: "bell" },
];

function MenuLinks() {
  return side.map((item) =>
    item.to.includes("#") ? (
      <a key={item.to} href={item.to}>
        <Icon name={item.icon} />
        {item.label}
      </a>
    ) : (
      <NavLink key={item.to} to={item.to} end={item.end}>
        <Icon name={item.icon} />
        {item.label}
      </NavLink>
    ),
  );
}

function Shell({ title, children }: { title: string; children: ReactNode }) {
  const { loggedIn, profile, logout } = useStore();
  const navigate = useNavigate();
  return (
    <div className="container page account-layout">
      <aside className="account-side">
        <div className="menu-user">
          <img src="/images/face-sara.jpg" alt="" />
          <div>
            <strong>{loggedIn ? profile.name : "زائرة"}</strong>
            <span>{loggedIn ? profile.email : "سجّلي الدخول"}</span>
          </div>
        </div>
        <MenuLinks />
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <Icon name="close" />
          تسجيل الخروج
        </button>
      </aside>
      <div>
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

const steps = ["تم الدفع", "قيد التجهيز", "تم الشحن", "قيد التوصيل", "تم التسليم"];

const dashOrders = [
  {
    id: "MD2485",
    date: "10 مايو 2024",
    total: 32.5,
    step: 3,
    count: 3,
    thumbs: ["/account/wish-cream.png", "/account/wish-serum.png", "/account/wish-lipstick.png"],
    action: "تتبع الطلب",
    href: "/track/MD2485",
  },
  {
    id: "MD2401",
    date: "2 مايو 2024",
    total: 18.9,
    step: 1,
    count: 4,
    thumbs: ["/account/wish-perfume.png", "/account/wish-palette.png", "/account/wish-wash.png", "/account/wish-cream.png"],
    action: "عرض التفاصيل",
    href: "/track/MD2401",
    again: true,
  },
  {
    id: "MD2367",
    date: "18 أبريل 2024",
    total: 45,
    step: 4,
    count: 2,
    thumbs: ["/account/wish-serum.png", "/account/wish-cream.png"],
    action: "اطلب مرة أخرى",
    href: "/orders",
  },
];

const activity = [
  { icon: "/account/st-check.png", title: "تم تسليم الطلب بنجاح", text: "تم توصيل طلبك رقم #MD2485 بنجاح", time: "اليوم، 2:30 مساءً" },
  { icon: "/account/st-truck.png", title: "تم شحن الطلب", text: "طلبك رقم #MD2485 خرج للتوصيل", time: "أمس، 11:15 صباحًا" },
  { icon: "/account/st-gear.png", title: "قيد التجهيز", text: "يتم الآن تجهيز طلبك رقم #MD2485", time: "اليوم، 6:20 مساءً" },
  { icon: "/account/st-box.png", title: "تم تأكيد الطلب", text: "تم تأكيد طلبك رقم #MD2485", time: "أمس، 4:12 مساءً" },
  { icon: "/account/st-back.png", title: "تم إصدار استرجاع", text: "تم إصدار مبلغ مسترجع للطلب رقم #MD2401", time: "8 مايو، 10:30 صباحًا" },
];

const favs = [
  { id: "cleanser", name: "غسول لطيف للبشرة الحساسة", price: 9.3, reviews: 68, rating: 4.8, image: "/account/wish-wash.png" },
  { id: "palette", name: "باليت ظلال العيون", price: 16, reviews: 85, rating: 4.9, image: "/account/wish-palette.png" },
  { id: "serum", name: "سيروم فيتامين سي لإشراقة البشرة", price: 14.5, reviews: 92, rating: 4.8, image: "/account/wish-serum.png" },
  { id: "cream", name: "كريم الترطيب العميق بماء الورد", price: 13.2, reviews: 96, rating: 4.9, image: "/account/wish-cream.png" },
  { id: "lipstick", name: "أحمر شفاه مطفي فاخر", price: 9.2, reviews: 74, rating: 4.7, image: "/account/wish-lipstick.png" },
  { id: "perfume", name: "عطر وردي فاخر", price: 48, reviews: 112, rating: 4.9, image: "/account/wish-perfume.png" },
];

export function AccountPage() {
  const { profile, points, orders, wished, login, addToCart, toggleWish, logout } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [saved, setSaved] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const wishCount = Math.max(wished.length, 12);
  const orderCount = Math.max(orders.length, 8);

  function save(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 3) return;
    login({ name: name.trim(), email: email.trim(), phone: phone.trim() }, true);
    setSaved(true);
  }

  return (
    <div className="account-wash">
      <div className="account-dash">
        <div className="acc-body">
          <aside className="acc-menu">
            <MenuLinks />
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <img src="/account/ico-out.png" alt="" />
              تسجيل الخروج
            </button>
          </aside>

          <div className="acc-main">
            <section className="acc-hero">
              <img src="/account/hero.jpg" alt="" />
              <div className="acc-hero-copy">
                <h1>حسابي</h1>
                <p>مرحباً بك في عالم مداد..</p>
                <strong>حيث الجمال دائماً أقرب إليك</strong>
              </div>
            </section>
            <div className="acc-top">
              <article className="acc-hello">
                <div className="acc-hello-head">
                  <div>
                    <p>مرحباً بك مجدداً</p>
                    <h2>
                      <img src="/account/ico-crown.png" alt="" />
                      {profile.name}
                    </h2>
                    <ul>
                      <li>
                        <img src="/account/ico-cal.png" alt="" />
                        عضو منذ مارس 2024
                      </li>
                      <li>
                        <img src="/account/ico-pin.png" alt="" />
                        البحرين
                      </li>
                      <li>{profile.email}</li>
                    </ul>
                  </div>
                  <div className="acc-avatar">
                    <img src="/account/sara.png" alt="" />
                    <span>
                      <img src="/account/ico-cam.png" alt="" />
                    </span>
                  </div>
                </div>
              </article>

              <article className="acc-points">
                <header>
                  <h2>
                    <img src="/account/gift.png" alt="" />
                    نقاطي ومكافآتي
                  </h2>
                  <Link to="/rewards">عرض كل المكافآت</Link>
                </header>
                <p className="acc-points-num">
                  <b>{points.toLocaleString("en-US")}</b> نقطة
                </p>
                <p className="acc-points-note">اجمع 250 نقطة أخرى لتحصل على قسيمة خصم 10 د.ب</p>
                <div className="acc-bar">
                  <i style={{ width: "83%" }} />
                </div>
                <div className="acc-tiers">
                  <article>
                    <b>2,000 نقطة</b>
                    <span>مجموعة هدايا فاخرة</span>
                  </article>
                  <article>
                    <b>1,500 نقطة</b>
                    <span>قسيمة خصم 10 د.ب</span>
                  </article>
                  <article className="on">
                    <b>الحالي</b>
                    <span>{points.toLocaleString("en-US")} نقطة</span>
                  </article>
                </div>
              </article>
            </div>

            <div className="acc-stats">
              <article>
                <img src="/account/ico-coins.png" alt="" />
                <b>{points.toLocaleString("en-US")}</b>
                <span>النقاط المتاحة</span>
              </article>
              <article>
                <img src="/account/ico-box.png" alt="" />
                <b>{orderCount}</b>
                <span>إجمالي الطلبات</span>
              </article>
              <article>
                <img src="/account/ico-heart.png" alt="" />
                <b>{wishCount}</b>
                <span>منتج في المفضلة</span>
              </article>
              <article>
                <img src="/account/ico-ticket.png" alt="" />
                <b>3</b>
                <span>كوبونات نشطة</span>
              </article>
            </div>

            <div className="acc-mid">
              <section className="acc-orders">
                <header>
                  <h2>طلباتي</h2>
                  <Link to="/orders">عرض الكل</Link>
                </header>
                {dashOrders.map((order) => (
                  <article key={order.id}>
                    <div className="acc-order-top">
                      <div>
                        <strong>#{order.id}</strong>
                        <span>{order.date}</span>
                      </div>
                      <b dir="ltr">{money(order.total)}</b>
                      <em>تم الدفع</em>
                    </div>
                    <div className="acc-order-mid">
                    <div className="acc-thumbs">
                      {order.thumbs.map((src) => (
                        <img key={src} src={src} alt="" />
                      ))}
                    </div>
                    <span>{order.count} منتجات</span>
                    <div className="acc-order-links">
                      <Link to={order.href}>{order.action}</Link>
                      {order.again ? <Link to="/shop">اطلب مرة أخرى</Link> : null}
                    </div>
                    </div>
                    <ol className="acc-steps">
                      {steps.map((label, index) => (
                        <li key={label} className={index <= order.step ? "on" : ""}>
                          <i />
                          {label}
                        </li>
                      ))}
                    </ol>
                  </article>
                ))}
              </section>

              <section className="acc-activity">
                <header>
                  <h2>آخر الأنشطة والإشعارات</h2>
                  <Link to="/notifications">عرض الكل</Link>
                </header>
                {activity.map((item) => (
                  <article key={item.title}>
                    <img src={item.icon} alt="" />
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                      <small>{item.time}</small>
                    </div>
                  </article>
                ))}
              </section>

              <article className="acc-invite">
                <img src="/account/invite.png" alt="" />
                <h2>ادعِ صديقاتك واربح نقاط إضافية</h2>
                <Link to="/rewards">دعوة الآن</Link>
              </article>
            </div>

            <section className="acc-favs">
              <header>
                <h2>
                  <img src="/account/ico-heart.png" alt="" />
                  منتجاتي المفضلة
                </h2>
                <div>
                  <button type="button" aria-label="السابق" onClick={() => scroller.current?.scrollBy({ left: 260, behavior: "smooth" })}>
                    ‹
                  </button>
                  <button type="button" aria-label="التالي" onClick={() => scroller.current?.scrollBy({ left: -260, behavior: "smooth" })}>
                    ›
                  </button>
                </div>
              </header>
              <div className="acc-fav-row" ref={scroller}>
                {favs.map((item) => {
                  const product = allProducts.find((entry) => entry.id === item.id);
                  const loved = wished.includes(item.id);
                  return (
                    <article key={item.id}>
                      <button type="button" className={loved ? "fav on" : "fav"} aria-label="المفضلة" onClick={() => toggleWish(item.id)}>
                        <img src="/account/ico-heart.png" alt="" />
                      </button>
                      <Link to={`/product/${item.id}`}>
                        <img src={item.image} alt="" />
                      </Link>
                      <h3>
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </h3>
                      <small>Medad</small>
                      <p>
                        ({item.reviews}) {"★".repeat(5)}
                      </p>
                      <strong dir="ltr">{money(item.price)}</strong>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          if (product) addToCart(product, 1);
                        }}
                      >
                        <Icon name="bag" />
                        أضف إلى السلة
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="panel" id="profile">
              <h2>الملف الشخصي</h2>
              <form className="form-grid" onSubmit={save}>
                <label>
                  الاسم
                  <input value={name} onChange={(event) => setName(event.target.value)} />
                </label>
                <label>
                  البريد الإلكتروني
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>
                <label>
                  رقم الجوال
                  <input dir="ltr" value={phone} onChange={(event) => setPhone(event.target.value)} />
                </label>
                <button type="submit" className="btn">
                  حفظ التعديلات
                </button>
                {saved ? <p className="form-ok">تم تحديث بياناتك</p> : null}
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrdersPage() {
  const { orders } = useStore();
  return (
    <Shell title="طلباتي">
      {orders.map((order) => {
        const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0) - order.discount + order.shipping;
        return (
          <article key={order.id} className="panel order-card">
            <header>
              <strong>#{order.id}</strong>
              <span>{order.statusLabel}</span>
            </header>
            <p>
              {order.date} {order.time}
            </p>
            <StatusLine status={order.status} />
            <p dir="ltr">{money(total)}</p>
            <Link className="btn" to={`/track/${order.id}`}>
              تفاصيل الطلب
            </Link>
          </article>
        );
      })}
    </Shell>
  );
}

const starterAddresses = [
  { id: "home", title: "المنزل", name: "سارة أحمد", line: "المنامة، الدبلوماسية، البحرين", phone: "+973 3999 1234" },
  { id: "work", title: "العمل", name: "سارة أحمد", line: "ضاحية السيف، البحرين", phone: "+973 3998 6677" },
];

export function AddressesPage() {
  const [rows, setRows] = useState(starterAddresses);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("عنوان جديد");
  const [name, setName] = useState("");
  const [line, setLine] = useState("");
  const [phone, setPhone] = useState("+973 ");

  return (
    <Shell title="عناوين الشحن">
      {rows.map((row) => (
        <article key={row.id} className="panel">
          <h2>{row.title}</h2>
          <p>{row.name}</p>
          <p>{row.line}</p>
          <p dir="ltr">{row.phone}</p>
          <button type="button" className="text-btn" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}>
            حذف
          </button>
        </article>
      ))}
      {open ? (
        <form
          className="panel form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim() || !line.trim()) return;
            setRows((current) => [...current, { id: String(Date.now()), title, name, line, phone }]);
            setOpen(false);
            setName("");
            setLine("");
          }}
        >
          <label>
            اسم العنوان
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>
            الاسم
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            العنوان
            <input value={line} onChange={(event) => setLine(event.target.value)} />
          </label>
          <label>
            الجوال
            <input dir="ltr" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <button type="submit" className="btn">
            حفظ العنوان
          </button>
        </form>
      ) : (
        <button type="button" className="btn" onClick={() => setOpen(true)}>
          إضافة عنوان جديد
        </button>
      )}
    </Shell>
  );
}

const methods = [
  { id: "visa", label: "Visa", detail: "•••• 4242" },
  { id: "master", label: "Mastercard", detail: "•••• 4321" },
  { id: "apple", label: "Apple Pay", detail: "سارة أحمد" },
  { id: "tabby", label: "tabby", detail: "تقسيط بدون فوائد" },
  { id: "tamara", label: "tamara", detail: "تقسيط بدون فوائد" },
];

export function PaymentsPage() {
  const [picked, setPicked] = useState("visa");
  return (
    <Shell title="طرق الدفع">
      {methods.map((method) => (
        <label key={method.id} className={picked === method.id ? "pay-option on" : "pay-option"}>
          <input type="radio" name="method" checked={picked === method.id} onChange={() => setPicked(method.id)} />
          <span>
            <strong>{method.label}</strong>
            <small>{method.detail}</small>
          </span>
        </label>
      ))}
    </Shell>
  );
}

const notes = [
  { title: "تم شحن طلبك", text: "طلب #MD24893 خرج للتوصيل", time: "منذ ساعتين" },
  { title: "تمت إضافة 50 نقطة", text: "رصيدك من برنامج المكافآت زاد", time: "أمس" },
  { title: "عرض خاص لك", text: "خصم 20% على العناية بالبشرة لمدة 3 أيام", time: "منذ 3 أيام" },
  { title: "تم توصيل طلبك", text: "طلب #MD2485 وصل بنجاح", time: "12 مايو" },
  { title: "منتج متوفر مجددًا", text: "كريم الترطيب الوردي عاد للمخزون", time: "منذ أسبوع" },
];

export function NotificationsPage() {
  const [items, setItems] = useState(notes);
  return (
    <Shell title="الإشعارات">
      {items.length === 0 ? <p>لا توجد إشعارات جديدة.</p> : null}
      {items.map((item) => (
        <article key={item.title} className="panel note">
          <h2>{item.title}</h2>
          <p>{item.text}</p>
          <small>{item.time}</small>
        </article>
      ))}
      {items.length > 0 ? (
        <button type="button" className="text-btn" onClick={() => setItems([])}>
          تحديد الكل كمقروء
        </button>
      ) : null}
    </Shell>
  );
}

export function ReturnsPage() {
  const { orders, notify } = useStore();
  const [orderId, setOrderId] = useState(orders[0]?.id ?? "");
  const [reason, setReason] = useState("المنتج لا يناسبني");
  const [details, setDetails] = useState("");
  const [done, setDone] = useState(false);

  return (
    <Shell title="إرجاع أو استبدال">
      {done ? (
        <div className="empty-card">
          <strong>تم إرسال طلب الإرجاع</strong>
          <p>سنتواصل معك خلال يوم عمل لتأكيد الاستلام.</p>
        </div>
      ) : (
        <form
          className="panel form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            if (details.trim().length < 8) {
              notify("وضّحي سبب الإرجاع");
              return;
            }
            setDone(true);
            notify("تم إرسال طلب الإرجاع");
          }}
        >
          <label>
            الطلب
            <select value={orderId} onChange={(event) => setOrderId(event.target.value)}>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  #{order.id} — {order.date}
                </option>
              ))}
            </select>
          </label>
          <label>
            السبب
            <select value={reason} onChange={(event) => setReason(event.target.value)}>
              <option>المنتج لا يناسبني</option>
              <option>وصل تالفًا</option>
              <option>طلبت المقاس الخطأ</option>
              <option>أريد الاستبدال</option>
            </select>
          </label>
          <label>
            التفاصيل
            <textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="اكتبي ما حدث مع الطلب" />
          </label>
          <button type="submit" className="btn">
            إرسال الطلب
          </button>
        </form>
      )}
    </Shell>
  );
}
