import { Link } from "react-router-dom";

type LogoProps = {
  large?: boolean;
};

export function Logo({ large = false }: LogoProps) {
  return (
    <Link to="/" className={large ? "logo large" : "logo"} aria-label="مداد Medad Beauty Store">
      <img src="/brand/logo.png" alt="" />
    </Link>
  );
}
