import { useEffect, useState } from "react";
import { articles } from "../data";
import { Icon, IconChevron } from "./Icons";
import { SectionTitle } from "./SectionTitle";

export function Articles() {
  const [openId, setOpenId] = useState<string | null>(null);
  const article = articles.find((item) => item.id === openId) ?? null;

  useEffect(() => {
    if (!article) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [article]);

  return (
    <section className="section" id="journal">
      <SectionTitle title="مقالات ونصائح الجمال" />
      <div className="articles">
        {articles.map((item) => (
          <article key={item.id} className="article">
            <img src={item.image} alt="" />
            <div>
              <small>{item.tag}</small>
              <h3>{item.title}</h3>
              <button type="button" className="text-link" onClick={() => setOpenId(item.id)}>
                اقرأ المزيد
                <IconChevron dir="left" />
              </button>
            </div>
          </article>
        ))}
      </div>
      {article ? (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="article-title">
          <button type="button" className="modal-backdrop" aria-label="إغلاق" onClick={() => setOpenId(null)} />
          <div className="modal-card">
            <img src={article.image} alt="" />
            <button type="button" className="modal-close" aria-label="إغلاق" onClick={() => setOpenId(null)}>
              <Icon name="close" />
            </button>
            <div className="modal-body">
              <small>{article.tag}</small>
              <h2 id="article-title">{article.title}</h2>
              <p>{article.excerpt}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
