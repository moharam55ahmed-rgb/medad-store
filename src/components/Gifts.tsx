import { Link } from "react-router-dom";
import type { IconName } from "../types";
import { Icon } from "./Icons";

const points: { icon: IconName; label: string }[] = [
  { icon: "gift", label: "تغليف فاخر" },
  { icon: "card", label: "بطاقة إهداء" },
  { icon: "truck", label: "توصيل سريع" },
];

export function Gifts() {
  return (
    <section className="section" id="gifts">
      <div className="gift-banner">
        <ul className="gift-points">
          {points.map((point) => (
            <li key={point.label}>
              <Icon name={point.icon} />
              {point.label}
            </li>
          ))}
        </ul>
        <div className="gift-copy">
          <p className="eyebrow">موسم الهدايا</p>
          <h2>مجموعات الهدايا الفاخرة</h2>
          <p>لأن كل لحظة تستحق أن تكون أجمل. اختاري مجموعة منسقة بتغليف يليق بها.</p>
          <Link className="btn" to="/category/gifts">
            اكتشفي المجموعات
          </Link>
        </div>
        <img className="gift-art" src="/images/gift.jpg" alt="" />
      </div>
    </section>
  );
}
