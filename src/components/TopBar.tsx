import { Link } from "react-router-dom";

export function TopBar() {
  return (
    <div className="topbar" id="top">
      <div className="container topbar-inner">
        <Link className="top-cta" to="/shop">
          تسوق الآن
        </Link>
        <p>شحن مجاني للطلبات فوق 30 د.ب</p>
        <span className="top-note">هدية مميزة مع كل طلب</span>
      </div>
    </div>
  );
}
