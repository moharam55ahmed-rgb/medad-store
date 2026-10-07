import { useEffect, useState, type TouchEvent } from "react";
import { Link } from "react-router-dom";
import { slides } from "../data";
import { IconChevron } from "./Icons";

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [paused, index]);

  function go(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  function onTouchStart(event: TouchEvent<HTMLElement>) {
    event.currentTarget.setAttribute("data-x", String(event.touches[0].clientX));
  }

  function onTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = Number(event.currentTarget.getAttribute("data-x") ?? 0);
    const delta = event.changedTouches[0].clientX - start;
    if (delta > 48) go(index - 1);
    if (delta < -48) go(index + 1);
  }

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="عروض مداد"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hero-frame">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;
          const Title = active ? "h1" : "h2";
          return (
            <article key={slide.id} className={active ? "slide active" : "slide"} aria-hidden={!active}>
              <img className="hero-bg" src={slide.bg} alt="" />
              <img className="hero-portrait" src={slide.face} alt="" />
              <img className="hero-products" src={slide.products} alt="" />
              <div className="hero-shade" />
              <div className="hero-copy">
                <div className="hero-copy-inner">
                  <Title>{slide.title}</Title>
                  <p>{slide.text}</p>
                  <Link className="btn" to={slide.href}>
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
        <button type="button" className="hero-arrow prev" onClick={() => go(index - 1)} aria-label="الشريحة السابقة">
          <IconChevron dir="right" />
        </button>
        <button type="button" className="hero-arrow next" onClick={() => go(index + 1)} aria-label="الشريحة التالية">
          <IconChevron dir="left" />
        </button>
        <div className="dots">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              className={slideIndex === index ? "dot on" : "dot"}
              aria-label={`الشريحة ${slideIndex + 1}`}
              onClick={() => go(slideIndex)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
