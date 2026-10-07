import type { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { SectionTitle } from "./SectionTitle";

type Props = {
  id: string;
  title: string;
  products: Product[];
  href?: string;
};

export function ProductSection({ id, title, products, href = "/shop" }: Props) {
  return (
    <section className="section" id={id}>
      <SectionTitle title={title} action="عرض الكل" href={href} />
      <div className="products">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
