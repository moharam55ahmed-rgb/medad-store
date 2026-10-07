import { Link } from "react-router-dom";
import { WaveTop } from "./SectionCurve";

export function Studio() {
  return (
    <section className="studio" aria-label="عن مداد والتواصل">
      <WaveTop className="wave-top studio-wave" fill="#f8efe9" />
      <div className="studio-fill">
        <div className="container studio-grid">
          <article>
            <h2>عن مداد</h2>
            <p>نختار ما يستحق بشرتك، ونرتّبه كحكاية هادئة من العناية إلى آخر لمسة.</p>
            <Link to="/about">اقرئي حكايتنا</Link>
          </article>
          <article>
            <h2>تواصلي معنا</h2>
            <p>سؤال عن طلب، أو تركيبة، أو هدية؟ اكتبي لنا ونرد خلال يوم عمل.</p>
            <Link to="/contact">أرسلي رسالة</Link>
          </article>
        </div>
      </div>
    </section>
  );
}
