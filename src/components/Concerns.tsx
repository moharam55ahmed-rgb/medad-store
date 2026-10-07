import { Link } from "react-router-dom";
import { concerns } from "../data";
import { WaveBottom, WaveTop } from "./SectionCurve";
import { SectionTitle } from "./SectionTitle";

const band = "#fbe4de";

export function Concerns() {
  return (
    <section className="concern-band" id="concerns">
      <WaveTop fill={band} />
      <div className="concern-fill">
        <div className="container">
          <SectionTitle
            title="تسوقي حسب احتياج بشرتك"
            kicker="لأن كل بشرة لها حكاية.. ونحن نعرف الحل"
            action="عرض جميع الحلول"
            href="/category/skin"
          />
          <div className="concerns">
            {concerns.map((item) => (
              <Link key={item.id} className={`concern concern-${item.id}`} to={`/category/skin?need=${item.id}`}>
                <span className="concern-visual">
                  <img className="concern-photo" src={item.photo} alt="" />
                  <span className="concern-ico">
                    <img src={item.icon} alt="" />
                  </span>
                </span>
                <span className="concern-copy">
                  <strong>{item.label}</strong>
                  <small>تسوقي الآن</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <WaveBottom fill={band} />
    </section>
  );
}
