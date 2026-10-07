import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../store";

function Card({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <section className="auth-card">
      <h1>{title}</h1>
      {text ? <p>{text}</p> : null}
      {children}
    </section>
  );
}

export function WelcomePage() {
  return (
    <section className="auth-card welcome">
      <img src="/images/hero-prod-1.jpg" alt="" />
      <h1>جمالك يبدأ من هنا</h1>
      <p>اكتشفي أفضل منتجات العناية والتجميل من الماركات العالمية</p>
      <Link className="btn wide" to="/register">
        إنشاء حساب جديد
      </Link>
      <Link className="btn ghost wide" to="/login">
        تسجيل الدخول
      </Link>
    </section>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 3) return setError("اكتبي اسمك الكامل");
    if (!/^\d{8}$/.test(phone)) return setError("رقم البحرين 8 أرقام بعد +973");
    if (!email.includes("@")) return setError("البريد الإلكتروني غير مكتمل");
    if (password.length < 8) return setError("كلمة المرور 8 أحرف على الأقل");
    if (password !== confirm) return setError("كلمتا المرور غير متطابقتين");
    if (!agree) return setError("وافقي على الشروط أولًا");
    sessionStorage.setItem("medad-draft", JSON.stringify({ name, email, phone: `+973 ${phone}` }));
    navigate("/verify?next=register");
  }

  return (
    <Card title="إنشاء حساب جديد" text="ابدئي رحلتك معنا واستمتعي بتجربة تسوق مميزة">
      <form className="form-grid" onSubmit={submit}>
        <label>
          الاسم الكامل
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          رقم الجوال
          <span className="phone-row" dir="ltr">
            <b>+973</b>
            <input value={phone} inputMode="numeric" onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 8))} />
          </span>
        </label>
        <label>
          البريد الإلكتروني
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          كلمة المرور
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <label>
          تأكيد كلمة المرور
          <input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
        </label>
        <label className="check">
          <input type="checkbox" checked={agree} onChange={(event) => setAgree(event.target.checked)} />
          أوافق على الشروط والأحكام وسياسة الخصوصية
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" className="btn wide">
          إنشاء حساب
        </button>
      </form>
      <p>
        لديك حساب؟ <Link to="/login">تسجيل الدخول</Link>
      </p>
    </Card>
  );
}

export function VerifyPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = params.get("next") ?? "register";
  const inputs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (digits.join("").length < 4) {
      setError("أدخلي رمز التحقق المكوّن من 4 أرقام");
      return;
    }
    navigate(next === "reset" ? "/reset" : "/preferences");
  }

  return (
    <Card title="تحقق من رقم الجوال" text="أدخل الرمز المكوّن من 4 أرقام الذي أرسلناه إلى جوالك">
      <form onSubmit={submit}>
        <div className="otp" dir="ltr">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={inputs[index]}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              aria-label={`الرقم ${index + 1}`}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "").slice(-1);
                const nextDigits = [...digits];
                nextDigits[index] = value;
                setDigits(nextDigits);
                if (value && inputs[index + 1]) inputs[index + 1].current?.focus();
              }}
            />
          ))}
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" className="btn wide">
          تحقق
        </button>
      </form>
    </Card>
  );
}

const interests = ["العطور", "المكياج", "العناية بالبشرة", "العناية بالشعر", "العناية بالجسم"];

export function PreferencesPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string[]>(["العناية بالبشرة"]);
  const [birthday, setBirthday] = useState("");

  function finish(event: FormEvent) {
    event.preventDefault();
    const draft = sessionStorage.getItem("medad-draft");
    const parsed = draft ? (JSON.parse(draft) as { name?: string; email?: string; phone?: string }) : {};
    login({ name: parsed.name, email: parsed.email, phone: parsed.phone });
    sessionStorage.removeItem("medad-draft");
    navigate("/account");
  }

  return (
    <Card title="أهلًا بك في مداد" text="أكملي ملفك الشخصي لتحصلي على تجربة مخصصة">
      <form className="form-grid" onSubmit={finish}>
        <label>
          تاريخ الميلاد
          <input type="date" value={birthday} onChange={(event) => setBirthday(event.target.value)} />
        </label>
        <p>اختاري تفضيلاتك</p>
        <div className="chips">
          {interests.map((item) => (
            <button
              key={item}
              type="button"
              className={picked.includes(item) ? "on" : ""}
              onClick={() => setPicked((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]))}
            >
              {item}
            </button>
          ))}
        </div>
        <button type="submit" className="btn wide">
          حفظ واستكمال
        </button>
      </form>
    </Card>
  );
}

export function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@") || password.length < 4) {
      setError("تحققي من البريد وكلمة المرور");
      return;
    }
    login({ email });
    navigate("/account");
  }

  return (
    <Card title="تسجيل الدخول" text="مرحبًا بعودتك. سجّلي دخولك لمتابعة طلباتك ونقاطك والمفضلة">
      <form className="form-grid" onSubmit={submit}>
        <label>
          البريد الإلكتروني أو رقم الجوال
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          كلمة المرور
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <Link to="/forgot">نسيت كلمة المرور؟</Link>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" className="btn wide">
          تسجيل الدخول
        </button>
      </form>
      <p>
        ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
      </p>
    </Card>
  );
}

export function ForgotPage() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  return (
    <Card title="نسيت كلمة المرور؟" text="أدخلي بريدك أو رقم جوالك وسنرسل رمز التحقق">
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          if (value.trim().length < 6) {
            setError("أدخلي بريدًا أو رقمًا صحيحًا");
            return;
          }
          navigate("/verify?next=reset");
        }}
      >
        <label>
          البريد أو الجوال
          <input value={value} onChange={(event) => setValue(event.target.value)} />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" className="btn wide">
          إرسال رمز التحقق
        </button>
      </form>
      <Link to="/login">العودة لتسجيل الدخول</Link>
    </Card>
  );
}

export function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const rules = [
    { ok: password.length >= 8, label: "8 أحرف على الأقل" },
    { ok: /[A-Z]/.test(password) && /[a-z]/.test(password), label: "حرف كبير وحرف صغير" },
    { ok: /\d/.test(password), label: "رقم واحد على الأقل" },
    { ok: /[^A-Za-z0-9]/.test(password), label: "رمز خاص" },
  ];

  return (
    <Card title="كلمة مرور جديدة" text="اختاري كلمة مرور قوية لحسابك">
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          if (rules.some((rule) => !rule.ok)) return setError("كلمة المرور لا تحقق الشروط");
          if (password !== confirm) return setError("التأكيد غير مطابق");
          navigate("/password-done");
        }}
      >
        <label>
          كلمة المرور الجديدة
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <label>
          تأكيد كلمة المرور
          <input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
        </label>
        <ul className="rules">
          {rules.map((rule) => (
            <li key={rule.label} className={rule.ok ? "ok" : ""}>
              {rule.label}
            </li>
          ))}
        </ul>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" className="btn wide">
          تحديث كلمة المرور
        </button>
      </form>
    </Card>
  );
}

export function PasswordDonePage() {
  return (
    <Card title="تم بنجاح!" text="تم تحديث كلمة المرور. يمكنك الآن تسجيل الدخول بحسابك الجديد">
      <Link className="btn wide" to="/login">
        الذهاب إلى تسجيل الدخول
      </Link>
    </Card>
  );
}
