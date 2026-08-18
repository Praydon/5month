"use client";

import { useEffect, useMemo, useState } from "react";
import { content, type Photo } from "../src/data/content";

type IntroState = "closed" | "opening" | "open";

function PhotoButton({ photo, index, onOpen }: { photo: Photo; index: number; onOpen: (photo: Photo) => void }) {
  return (
    <button
      className={`memory-card memory-card--${photo.layout ?? "small"}`}
      type="button"
      onClick={() => onOpen(photo)}
      aria-label={`Открыть фотографию ${index + 1}: ${photo.alt}`}
      data-reveal
    >
      <span className="memory-card__tape" aria-hidden="true" />
      <span className="memory-card__image-wrap">
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          style={{ objectPosition: photo.position }}
        />
      </span>
      {photo.caption && <span className="handwritten memory-card__caption">{photo.caption}</span>}
    </button>
  );
}

export default function LoveInvitation() {
  const [intro, setIntro] = useState<IntroState>("closed");
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [openedHints, setOpenedHints] = useState<number[]>([]);
  const [secretStage, setSecretStage] = useState(0);
  const [saidYes, setSaidYes] = useState(false);

  const hearts = useMemo(() => Array.from({ length: 12 }, (_, index) => index), []);

  useEffect(() => {
    document.body.style.overflow = intro !== "open" || lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [intro, lightbox]);

  useEffect(() => {
    const elements = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -6%" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const openInvitation = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setIntro("opening");
    window.setTimeout(() => {
      (document.activeElement as HTMLElement | null)?.blur();
      setIntro("open");
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
    }, 950);
  };

  const toggleHint = (index: number) => {
    setOpenedHints((current) => current.includes(index)
      ? current.filter((item) => item !== index)
      : [...current, index]);
  };

  return (
    <>
      {intro !== "open" && (
        <div className={`intro ${intro === "opening" ? "intro--opening" : ""}`}>
          <div className="intro__photo" aria-hidden="true" />
          <div className="intro__veil" aria-hidden="true" />
          <div className="intro__light-leak" aria-hidden="true" />
          <section className="intro__card" aria-labelledby="invitation-title">
            <p className="handwritten intro__eyebrow">{content.intro.eyebrow}</p>
            <span className="intro__ornament" aria-hidden="true">✦</span>
            <h1 id="invitation-title" className="display intro__title">{content.intro.title}</h1>
            <p className="intro__subtitle">{content.intro.subtitle}</p>
            <p className="intro__copy">{content.intro.text}</p>
            <button className="button button--light intro__button" type="button" onClick={openInvitation}>
              <span>{content.intro.button}</span>
              <span className="intro__heart" aria-hidden="true">♡</span>
            </button>
          </section>
        </div>
      )}

      <main className="site">
        <span className="floating-heart floating-heart--one" aria-hidden="true">♡</span>
        <span className="floating-heart floating-heart--two" aria-hidden="true">♡</span>

        <section className="opening-shot" aria-labelledby="opening-title">
          <div className="opening-shot__photo">
            <img
              src="/photos/hero-main.JPG"
              alt="Руслан нежно обнимает любимую во время уютного вечера"
              width="900"
              height="1600"
              fetchPriority="high"
              style={{ objectPosition: "50% 66%" }}
            />
          </div>
          <div className="opening-shot__shade" aria-hidden="true" />
          <div className="opening-shot__copy">
            <p className="eyebrow eyebrow--light">our favorite chapter</p>
            <h2 id="opening-title">{content.months} месяцев<br />с моей любимой <span aria-hidden="true">🤍</span></h2>
            <p className="handwritten opening-shot__note">и это только начало...</p>
          </div>
          <div className="scroll-note" aria-hidden="true"><span />листай</div>
        </section>

        <section className="section memories" aria-labelledby="memories-title">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">маленькая фотокнига</p>
            <h2 id="memories-title" className="display">Мои любимые моменты</h2>
            <p>Несколько кадров, в которых для меня — целый мир.</p>
          </div>
          <div className="scrapbook">
            {content.gallery.map((photo, index) => (
              <PhotoButton key={photo.src} photo={photo} index={index} onOpen={setLightbox} />
            ))}
            <p className="handwritten scrapbook__note" data-reveal>любимое время — время с тобой ♡</p>
          </div>
        </section>

        <section className="section story" aria-labelledby="story-title">
          <div className="section-heading section-heading--left" data-reveal>
            <p className="handwritten story__kicker">our little story</p>
            <h2 id="story-title">Три вещи, которые я люблю в «нас»</h2>
          </div>
          <div className="story__list">
            {content.story.map((episode) => (
              <article className="story-card" key={episode.number} data-reveal>
                <div className="story-card__photo">
                  <img
                    src={episode.photo.src}
                    alt={episode.photo.alt}
                    width={episode.photo.width}
                    height={episode.photo.height}
                    loading="lazy"
                    style={{ objectPosition: episode.photo.position }}
                  />
                </div>
                <div className="story-card__copy">
                  <span className="story-card__number">{episode.number}</span>
                  <h3 className="display">{episode.title}</h3>
                  <p>{episode.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="months-section" aria-labelledby="months-title">
          <div className="months-section__inner" data-reveal>
            <p className="eyebrow eyebrow--light">пять месяцев рядом</p>
            <h2 id="months-title" className="display">Уже 5 месяцев</h2>
            <p className="months-section__letter">
              Иногда мне кажется, что время с тобой летит слишком быстро. С тобой даже самые обычные моменты становятся особенными. Спасибо тебе за твою доброту, твою улыбку, твою заботу и за то, что ты есть в моей жизни. Альхамдулиллях, я очень счастлив, что ты у меня есть.
            </p>
            <div className="romantic-counts" aria-label="Наши пять месяцев">
              <div><strong>5</strong><span>месяцев<br />вместе</span></div>
              <div><strong>∞</strong><span>тёплых<br />моментов</span></div>
              <div><strong>ещё</strong><span>столько всего<br />впереди ♡</span></div>
            </div>
          </div>
        </section>

        <section className="section hints" aria-labelledby="hints-title">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">секретный раздел</p>
            <h2 id="hints-title" className="display">Маленькие подсказки</h2>
            <p className="handwritten hints__subtitle">Ну совсем чуть-чуть 🤭</p>
          </div>
          <div className="hint-grid">
            {content.hints.map((hint, index) => {
              const isOpen = openedHints.includes(index);
              return (
                <button
                  className={`hint-card ${isOpen ? "hint-card--open" : ""}`}
                  type="button"
                  key={hint.title}
                  onClick={() => toggleHint(index)}
                  aria-expanded={isOpen}
                  data-reveal
                >
                  <span className="hint-card__top">
                    <span className="hint-card__icon" aria-hidden="true">{hint.icon}</span>
                    <span className="hint-card__plus" aria-hidden="true">{isOpen ? "×" : "+"}</span>
                  </span>
                  <strong>{hint.title}</strong>
                  <span className="hint-card__answer">{hint.text}</span>
                  {!isOpen && <span className="hint-card__tap">нажми, чтобы открыть</span>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="secret-section" aria-labelledby="secret-title">
          <div className="secret-card" data-reveal>
            <span className="secret-card__eyes" aria-hidden="true">👀</span>
            <p className="eyebrow">главный вопрос</p>
            <h2 id="secret-title">Хочешь узнать,<br />куда мы едем?</h2>
            <button className="button button--dark" type="button" onClick={() => setSecretStage((stage) => Math.min(stage + 1, 2))}>
              {secretStage === 0 ? "Узнать секрет" : "Ну пожалуйста..."}
            </button>
            <div className={`secret-card__answer ${secretStage > 0 ? "secret-card__answer--visible" : ""}`} aria-live="polite">
              {secretStage === 1 && <><strong>Не-а, жаным 😌</strong><span>Так просто я тебе не расскажу 🤍</span></>}
              {secretStage >= 2 && <><strong>Осталось совсем немного потерпеть</strong><span>Обещаю, ожидание того стоит ♡</span></>}
            </div>
          </div>
        </section>

        <section className="section invitation-section" aria-labelledby="letter-title">
          <div className="letter" data-reveal>
            <span className="letter__monogram" aria-hidden="true">R</span>
            <p className="letter__date">{content.dateLabel} · {content.time}</p>
            <h2 id="letter-title" className="display">{content.addressee} ❤️</h2>
            <div className="letter__body">
              {content.invitation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="details" aria-label="Детали приглашения">
              <div className="detail"><span>Время</span><strong>Будь готова в {content.time}</strong></div>
              <div className="detail"><span>Формат</span><strong>Сюрприз + совместный ужин</strong></div>
              <div className="detail"><span>Дресс-код</span><strong>Удобная одежда</strong><em>Ты всё равно будешь самой красивой ❤️</em></div>
              <div className="detail"><span>С собой</span><strong>Только прекрасное настроение</strong></div>
            </div>
            <p className="letter__closing">С нетерпением жду нашей встречи, принцесса.</p>
            <p className="handwritten letter__signature">{content.signature}</p>
          </div>
        </section>

        {content.ai.enabled && (
          <section className="section imagined" aria-labelledby="imagined-title">
            <div className="section-heading" data-reveal>
              <p className="eyebrow">как на открытке</p>
              <h2 id="imagined-title" className="display">Немного нас в другой вселенной</h2>
            </div>
            <figure className="imagined__card" data-reveal>
              <img src={content.ai.image} alt={content.ai.alt} width="1792" height="936" loading="lazy" />
              <figcaption className="handwritten">как в нашем добром кино...</figcaption>
            </figure>
          </section>
        )}

        <section className="finale" aria-labelledby="finale-title">
          <img className="finale__photo" src="/photos/gallery-6.JPG" alt="Счастливая пара улыбается в золотом свете" width="1600" height="900" loading="lazy" />
          <div className="finale__shade" aria-hidden="true" />
          <div className="finale__content" data-reveal>
            <p className="display finale__kicker">Күнім...</p>
            <h2 id="finale-title">Готова провести этот день вместе? ❤️</h2>
            <button className="button button--light" type="button" onClick={() => setSaidYes(true)} disabled={saidYes}>
              {saidYes ? "Конечно ❤️" : "Конечно ❤️"}
            </button>
            <div className={`finale__answer ${saidYes ? "finale__answer--visible" : ""}`} aria-live="polite">
              <strong>Тогда жди меня, жаным 🤍</strong>
              <span>Завтра будет наш особенный день.</span>
              <em className="display">Люблю тебя.</em>
            </div>
            {saidYes && <div className="heart-confetti" aria-hidden="true">{hearts.map((heart) => <span key={heart}>♡</span>)}</div>}
          </div>
        </section>
      </main>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фотографии" onClick={() => setLightbox(null)}>
          <button className="lightbox__close" type="button" onClick={() => setLightbox(null)} aria-label="Закрыть фотографию">×</button>
          <img src={lightbox.src} alt={lightbox.alt} width={lightbox.width} height={lightbox.height} onClick={(event) => event.stopPropagation()} />
          {lightbox.caption && <p className="handwritten">{lightbox.caption}</p>}
        </div>
      )}
    </>
  );
}
