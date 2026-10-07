import { NavLink } from "react-router-dom";
import { useStore } from "../store";
import { Icon, IconHeart } from "./Icons";

export function BottomNav() {
  const { count, setCartOpen } = useStore();
  return (
    <nav className="bottom-nav" aria-label="تنقل الجوال">
      <NavLink to="/" end>
        <Icon name="home" />
        الرئيسية
      </NavLink>
      <NavLink to="/shop">
        <Icon name="grid" />
        المتجر
      </NavLink>
      <NavLink to="/wishlist">
        <IconHeart filled={false} />
        المفضلة
      </NavLink>
      <button type="button" onClick={() => setCartOpen(true)}>
        <Icon name="bag" />
        السلة
        {count > 0 ? <em>{count}</em> : null}
      </button>
      <NavLink to="/account">
        <Icon name="user" />
        حسابي
      </NavLink>
    </nav>
  );
}
