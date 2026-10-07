import { Link } from "react-router-dom";
import { brands } from "../data";
import { SectionTitle } from "./SectionTitle";

export function Brands() {
  return (
    <section className="section brands" id="brands">
      <SectionTitle title="أشهر العلامات التجارية" action="عرض الكل" href="/brands" />
      <div className="brands-row">
        {brands.map((brand) => (
          <Link key={brand.slug} to={`/brand/${brand.slug}`} className={brand.italic ? "brand italic" : "brand"}>
            {brand.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
