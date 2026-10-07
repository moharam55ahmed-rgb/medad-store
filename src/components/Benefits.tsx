import { Link } from "react-router-dom";
import { benefits } from "../data";
import { useStore } from "../store";

export function Benefits() {
  const { profile, points } = useStore();
  const firstName = profile.name.split(" ")[0];

  return (
    <section className="benefits" aria-label="مزايا مداد">
      <div className="benefits-row">
        {benefits.map((item) => (
          <article key={item.id} className="benefit">
            <span className="bubble">
              <img src={item.image} alt="" />
            </span>
            <span className="benefit-copy">
              <strong>{item.id === "welcome" ? `مرحبا ${firstName}!` : item.title}</strong>
              <span>{item.id === "welcome" ? `لديك ${points.toLocaleString("en-US")} نقطة` : item.text}</span>
            </span>
          </article>
        ))}
        <Link className="btn benefits-cta" to="/rewards">
          عرض مكافآتي
        </Link>
      </div>
    </section>
  );
}
