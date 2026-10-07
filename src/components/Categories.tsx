import { Link } from "react-router-dom";
import { categories } from "../data";

export function Categories() {
  return (
    <section className="section" aria-label="التصنيفات">
      <div className="categories">
        {categories.map((category) => (
          <Link key={category.id} className="category" to={category.href}>
            <span className="bubble">
              <img src={category.image} alt="" />
            </span>
            <b>{category.label}</b>
          </Link>
        ))}
      </div>
    </section>
  );
}
