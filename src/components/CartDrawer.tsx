import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { money } from "../format";
import type { CartItem } from "../types";
import { Icon } from "./Icons";

type Props = {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
};

export function CartDrawer({ open, items, onClose, onQty, onRemove }: Props) {
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {open ? <button type="button" className="overlay show" aria-label="إغلاق السلة" onClick={onClose} /> : null}
      <aside className={open ? "drawer open" : "drawer"} inert={!open} aria-label="سلة التسوق">
        <header className="drawer-head">
          <h2>السلة {count > 0 ? `(${count})` : ""}</h2>
          <button type="button" className="icon-btn" aria-label="إغلاق" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <Icon name="bag" />
            <strong>سلتك فارغة</strong>
            <p>أضيفي منتجًا من التشكيلة لتبدئي طلبك.</p>
            <Link className="btn" to="/shop" onClick={onClose}>
              ابدئي التسوق
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer-list">
              {items.map((item) => (
                <article key={item.id} className="cart-item">
                  <img src={item.image} alt="" />
                  <div>
                    <h3>{item.name}</h3>
                    <strong dir="ltr">{money(item.price)}</strong>
                    <div className="cart-actions">
                      <div className="qty">
                        <button type="button" aria-label="إنقاص الكمية" onClick={() => onQty(item.id, item.qty - 1)}>
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button type="button" aria-label="زيادة الكمية" onClick={() => onQty(item.id, item.qty + 1)}>
                          +
                        </button>
                      </div>
                      <button type="button" className="remove" onClick={() => onRemove(item.id)}>
                        حذف
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <footer className="drawer-foot">
              <div>
                <span>المجموع</span>
                <strong dir="ltr">{money(total)}</strong>
              </div>
              <p>الشحن مجاني للطلبات فوق 30 د.ب.</p>
              <button
                type="button"
                className="btn wide"
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
              >
                إتمام الطلب
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
