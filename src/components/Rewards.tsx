export function Rewards() {
  return (
    <section className="section rewards-section" id="rewards">
      <div className="rewards-card">
        <div className="reward-brand">
          <img src="/rewards/logo.png?v=5" alt="Medad" />
        </div>
        <div className="reward-perks">
          <strong>مكافآت مداد</strong>
          <span>حول نقاطك إلى:</span>
          <ul>
            <li className="perk-plain">
              <img src="/rewards/shield.png?v=5" alt="" />
              تخفيضات مميزة
            </li>
            <li className="perk-plain">
              <img src="/rewards/gift.png?v=5" alt="" />
              هدايا مجانية
            </li>
            <li>
              <img src="/rewards/percent.png?v=5" alt="" />
              خصومات حصرية
            </li>
          </ul>
        </div>
        <div className="reward-tier">
          <div className="tier-head">
            <img src="/rewards/crown.png?v=5" alt="" />
            <div>
              <strong>عضوة بلاتينية</strong>
              <em>مستواي مميز</em>
            </div>
          </div>
          <div className="track" aria-hidden="true">
            <span />
            <img className="tier-gem" src="/rewards/diamond.png?v=5" alt="" />
          </div>
          <small>اجمعي 2,150 نقطة للوصول إلى مستوى الملوك</small>
        </div>
        <div className="reward-user">
          <img src="/rewards/sara.png" alt="سارة" />
          <div>
            <strong>مرحبا، سارة</strong>
            <span>
              <img src="/rewards/coins.png?v=5" alt="" />
              لديك <b>2,850</b> نقطة
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
