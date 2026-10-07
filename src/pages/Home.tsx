import { Articles } from "../components/Articles";
import { Studio } from "../components/Studio";
import { Benefits } from "../components/Benefits";
import { Brands } from "../components/Brands";
import { Categories } from "../components/Categories";
import { Concerns } from "../components/Concerns";
import { Gifts } from "../components/Gifts";
import { Hero } from "../components/Hero";
import { ProductSection } from "../components/ProductSection";
import { Rewards } from "../components/Rewards";
import { arrivals, bestsellers } from "../data";

export function Home() {
  return (
    <>
      <div className="hero-wrap">
        <Hero />
        <Benefits />
      </div>
      <div className="container">
        <Categories />
      </div>
      <Concerns />
      <div className="container curve-follow">
        <Rewards />
        <ProductSection id="shop" title="الأكثر مبيعًا" products={bestsellers} href="/shop" />
        <ProductSection id="new" title="وصل حديثًا" products={arrivals} href="/shop?sort=new" />
        <Gifts />
        <Articles />
        <Brands />
      </div>
      <Studio />
    </>
  );
}
