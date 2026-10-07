import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { WaveTop } from "../components/SectionCurve";

export function AboutPage() {
  return (
    <div className="page">
      <div className="container">
        <p className="crumbs">
          <Link to="/">الرئيسية</Link>
          <span>/</span>
          <span>عن مداد</span>
        </p>
        <section className="page-hero">
          <img src="/images/hero-face-1.jpg" alt="" />
          <div>
            <h1>عن مداد</h1>
            <p className="lead">بيت جمال هادئ، يختار العناية والمكياج والعطور كأننا نروي حكايتك.</p>
          </div>
        </section>
        <div className="info-grid">
          <article className="panel">
            <h2>حكايتنا</h2>
            <p>
              بدأت مداد من فكرة بسيطة: الجمال لا يحتاج ضجيجًا. نجمع علامات نثق بها، ونرتّب الروتين حسب بشرتك، ونغلّف كل طلب كأنه هدية.
            </p>
            <p>من البحرين إلى بابك، نختار المستحضر الذي يستحق مكانًا على تسريحتك، لا رفًا ممتلئًا بلا سبب.</p>
          </article>
          <article className="panel">
            <h2>ما نعدكِ به</h2>
            <ul className="info-list">
              <li>منتجات أصلية من علامات نعرفها.</li>
              <li>اقتراحات حسب احتياج البشرة، لا حسب الصيحة فقط.</li>
              <li>تغليف هادئ، وشحن نتابعه معكِ حتى يصل.</li>
            </ul>
            <Link className="btn" to="/contact">
              تواصلي معنا
            </Link>
          </article>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSent(true);
  }

  return (
    <div className="page">
      <div className="container">
        <p className="crumbs">
          <Link to="/">الرئيسية</Link>
          <span>/</span>
          <span>تواصلي معنا</span>
        </p>
        <section className="info-contact">
          <WaveTop className="wave-top info-wave" />
          <div className="info-contact-fill">
            <div>
              <h1>تواصلي معنا</h1>
              <p className="lead">اكتبي لنا وسنرد خلال يوم عمل. للاستفسار عن طلب، اتركي رقمه.</p>
              <p>المنامة، البحرين</p>
              <p dir="ltr">+973 3999 1234</p>
              <p>hello@medad.store</p>
            </div>
            {sent ? (
              <p className="panel form-ok">وصلت رسالتك. سنرد عليكِ قريبًا.</p>
            ) : (
              <form className="panel form-grid" onSubmit={submit}>
                <label>
                  الاسم
                  <input name="name" required minLength={2} />
                </label>
                <label>
                  البريد
                  <input name="email" type="email" required />
                </label>
                <label>
                  الرسالة
                  <textarea name="message" required minLength={8} />
                </label>
                <button className="btn" type="submit">
                  إرسال
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
