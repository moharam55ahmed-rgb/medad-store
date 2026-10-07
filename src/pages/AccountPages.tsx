import { useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icons";
import { money } from "../format";
import { useStore } from "../store";
import type { IconName } from "../types";
import { StatusLine } from "./CheckoutPages";

const side: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: "/account", label: "حسابي", icon: "user", end: true },
  { to: "/orders", label: "طلباتي", icon: "box" },
  { to: "/wishlist", label: "المفضلة", icon: "reward" },
  { to: "/rewards", label: "نقاطي ومكافآتي", icon: "points" },
  { to: "/addresses", label: "عناويني", icon: "pin" },
  { to: "/payments", label: "طرق الدفع", icon: "card" },
  { to: "/notifications", label: "الإشعارات", icon: "bell" },
  { to: "/returns", label: "الإرجاع والاستبدال", icon: "refresh" },
];

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
        {side.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}>
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
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

export function AccountPage() {
  const { profile, points, orders, wished, login } = useStore();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [saved, setSaved] = useState(false);

  function save(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 3) return;
    login({ name: name.trim(), email: email.trim(), phone: phone.trim() }, true);
    setSaved(true);
  }

  return (
    <Shell title="حسابي">
      <p className="lead">مرحبًا بكِ في عالم مداد.. حيث الجمال دائمًا أقرب إليك</p>
      <section className="profile-card">
        <img src="/images/face-sara.jpg" alt="" />
        <div>
          <h2>{profile.name}</h2>
          <p>عضوة منذ مارس 2024 · البحرين</p>
          <p>{profile.email}</p>
        </div>
      </section>
      <div className="stat-grid">
        <article>
          <b>{points.toLocaleString("en-US")}</b>
          <span>النقاط المتاحة</span>
        </article>
        <article>
          <b>{orders.length}</b>
          <span>إجمالي الطلبات</span>
        </article>
        <article>
          <b>{wished.length}</b>
          <span>منتجات في المفضلة</span>
        </article>
        <article>
          <b>3</b>
          <span>كوبونات نشطة</span>
        </article>
      </div>
      <section className="panel">
        <h2>طلباتي</h2>
        {orders.slice(0, 3).map((order) => (
          <article key={order.id} className="order-row">
            <div>
              <strong>#{order.id}</strong>
              <span>
                {order.date} · {order.statusLabel}
              </span>
            </div>
            <div className="order-thumbs">
              {order.items.map((item) => (
                <img key={item.id} src={item.image} alt="" />
              ))}
            </div>
            <Link to={`/track/${order.id}`}>تتبع الطلب</Link>
          </article>
        ))}
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
    </Shell>
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
