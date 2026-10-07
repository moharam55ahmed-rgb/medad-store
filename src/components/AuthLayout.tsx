import { Link, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

export function AuthLayout() {
  const navigate = useNavigate();
  return (
    <div className="auth-shell">
      <header className="auth-top">
        <button type="button" className="text-btn" onClick={() => navigate(-1)}>
          رجوع
        </button>
        <Logo />
        <Link to="/" className="text-btn">
          المتجر
        </Link>
      </header>
      <Outlet />
    </div>
  );
}
