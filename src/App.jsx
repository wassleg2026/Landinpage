import { useEffect, useRef, useState } from 'react';

const STORY = ["اطلب رحلتك","اطلب توصيل","وادفع كما تحب"];
const STORY_MS = 3800;
const FAQ = [
  [
    "ما هو وصّل؟",
    "تطبيق يجمع الرحلات وطلبات التوصيل في مكان واحد، مع تطبيق مخصص للكباتن."
  ],
  [
    "كيف أحجز رحلة أو أطلب توصيلاً؟",
    "اختر رحلة أو توصيل، حدّد من أين وإلى أين، ثم أكّد طلبك وتابع الكابتن على الشاشة."
  ],
  [
    "ما طرق الدفع المتاحة؟",
    "يمكنك الدفع نقداً أو عبر إنستا باي أو المحافظ الإلكترونية."
  ],
  [
    "هل أستطيع إلغاء طلبي؟",
    "نعم، يمكنك إلغاء الرحلة أو الطلب من شاشة المتابعة."
  ],
  [
    "كيف أنضم ككابتن؟",
    "سجّل بياناتك وبيانات مركبتك وارفع مستنداتك، ثم تراجعها الإدارة قبل اعتماد حسابك."
  ]
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [tab, setTab] = useState('rider');
  const [story, setStory] = useState(0);
  const [tick, setTick] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const railRef = useRef(null);

  const goStory = (i) => { setStory(i); setTick((t) => t + 1); };

  // Header border + parallax on the hero stage
  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stage = stageRef.current, hero = heroRef.current;
    let ticking = false;
    const par = () => {
      if (stage) {
        const r = stage.getBoundingClientRect();
        const p = Math.max(-1, Math.min(1, (r.top - window.innerHeight * 0.45) / window.innerHeight));
        stage.style.setProperty('--py', (p * -26).toFixed(1) + 'px');
      }
      ticking = false;
    };
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (!calm && !ticking) { ticking = true; requestAnimationFrame(par); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const move = (e) => {
      const b = hero.getBoundingClientRect();
      stage.style.setProperty('--mx', ((e.clientX - b.left) / b.width - 0.5).toFixed(3));
      stage.style.setProperty('--my', ((e.clientY - b.top) / b.height - 0.5).toFixed(3));
    };
    const leave = () => { stage.style.setProperty('--mx', 0); stage.style.setProperty('--my', 0); };
    if (!calm && hero && stage) { hero.addEventListener('pointermove', move); hero.addEventListener('pointerleave', leave); }
    return () => { window.removeEventListener('scroll', onScroll); if (hero) { hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave); } };
  }, []);

  // Reveal on scroll (transform only) + draw the step rail
  useEffect(() => {
    const items = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
    const rail = railRef.current;
    const ro = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { rail.classList.add('in'); ro.disconnect(); } });
    }, { threshold: 0.25 });
    if (rail) ro.observe(rail);
    return () => { io.disconnect(); ro.disconnect(); };
  }, []);

  // Hero story: cycles the phone screens (restarts whenever a step is picked)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setTimeout(() => { setStory((s) => (s + 1) % STORY.length); setTick((x) => x + 1); }, STORY_MS);
    return () => clearTimeout(t);
  }, [tick]);

  return (
    <div style={{ display: 'contents' }}>
      <div dir="rtl" lang="ar">
        <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="top">
          <div className="wrap bar">
            <a className="logo" href="#top" aria-label="وصّل"><img src="assets/logo.png" width="120" height="48" alt="وصّل" /></a>
            <nav className="nav" aria-label="التنقل الرئيسي">
              <a href="#features">المميزات</a>
              <a href="#how">كيف يعمل</a>
              <a href="#apps">التطبيقان</a>
              <a href="#faq">الأسئلة الشائعة</a>
            </nav>
            <a className="btn btn-primary btn-sm" href="#download">حمّل التطبيق</a>
          </div>
        </header>
      
        <main>
          <div className="hero" ref={heroRef}>
            <div className="wrap hero-grid">
              <div className="hero-copy">
                <span className="badge"><i></i>رحلات وتوصيل في تطبيق واحد</span>
                <h1><span className="w" style={{ '--i': 0 }}>رحلتك</span> <span className="w" style={{ '--i': 1 }}>وطلبك…</span><br /><em className="w" style={{ '--i': 2 }}>أقرب لك</em> <span className="w" style={{ '--i': 3 }}>دائماً</span></h1>
                <p className="lead">احجز رحلتك أو اطلب توصيلك في خطوات بسيطة، وتابع الكابتن لحظة بلحظة حتى الوصول.</p>
                <div className="cta-row">
                  <a className="btn btn-primary" href="#download">حمّل التطبيق مجاناً</a>
                  <a className="btn btn-quiet" href="#apps" onClick={() => setTab('captain')}>انضم ككابتن</a>
                </div>
                <div className="story" role="tablist" aria-label="جولة سريعة في التطبيق">
                  <button key={story === 0 ? 'on0-' + tick : 'off0'} className={`st${story === 0 ? ' on' : ''}`} role="tab" aria-selected={story === 0} aria-label="اطلب رحلتك" onClick={() => goStory(0)}><i></i></button>
                  <button key={story === 1 ? 'on1-' + tick : 'off1'} className={`st${story === 1 ? ' on' : ''}`} role="tab" aria-selected={story === 1} aria-label="اطلب توصيل" onClick={() => goStory(1)}><i></i></button>
                  <button key={story === 2 ? 'on2-' + tick : 'off2'} className={`st${story === 2 ? ' on' : ''}`} role="tab" aria-selected={story === 2} aria-label="وادفع كما تحب" onClick={() => goStory(2)}><i></i></button>
                  <span className="story-cap">{STORY[story]}</span>
                </div>
              </div>
      
              <div className="stage" ref={stageRef}>
                <div className="rings" aria-hidden="true"><i></i><i></i><i></i></div>
                <div className="phone main"><img className={`slide${story === 0 ? ' on' : ''}`} src="assets/rider-ride.jpg" width="540" height="1178" alt="شاشة طلب رحلة في تطبيق وصّل" /><img className={`slide${story === 1 ? ' on' : ''}`} src="assets/rider-order.jpg" width="540" height="1178" alt="شاشة طلب توصيل في تطبيق وصّل" /><img className={`slide${story === 2 ? ' on' : ''}`} src="assets/rider-pay.jpg" width="540" height="1178" alt="شاشة طرق الدفع في تطبيق وصّل" /></div>
                <div className="phone back"><img src="assets/drv-online.jpg" width="540" height="1178" alt="الشاشة الرئيسية في تطبيق الكابتن" /></div>
                <div className="chip c1"><svg viewBox="0 0 26 26"><circle cx="13" cy="13" r="13" fill="#A3FF3B"/><path d="M7.5 13.5l3.7 3.7 7.3-8" fill="none" stroke="#0F1113" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>تتبّع كابتنك لحظة بلحظة</div>
                <div className="chip c2"><svg viewBox="0 0 26 26"><circle cx="13" cy="13" r="13" fill="#A3FF3B"/><path d="M7.5 13.5l3.7 3.7 7.3-8" fill="none" stroke="#0F1113" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>ادفع نقداً أو عبر إنستا باي</div>
              </div>
            </div>
          </div>
      
          <section id="features">
            <div className="wrap">
              <div className="sec-head reveal">
                <span className="eyebrow">لماذا وصّل</span>
                <h2>كل ما تحتاجه في تطبيق واحد</h2>
                <p>رحلات وتوصيل وأرباح، بتجربة هادئة وواضحة من أول خطوة حتى الوصول.</p>
              </div>
              <div className="grid3">
                <article className="card reveal">
                  <div className="art"><img src="assets/art-ride.svg" width="280" height="248" alt="" /></div>
                  <h3>رحلات سريعة</h3>
                  <p>حدّد وجهتك واحجز رحلتك في ثوانٍ، واختر طريقة الدفع التي تناسبك.</p>
                </article>
                <article className="card reveal">
                  <div className="art"><img src="assets/art-order.svg" width="280" height="248" alt="" /></div>
                  <h3>توصيل إلى بابك</h3>
                  <p>اطلب من المتاجر والمطاعم وتابع طلبك حتى يصل إليك.</p>
                </article>
                <article className="card reveal">
                  <div className="art"><img src="assets/art-earnings.svg" width="280" height="248" alt="" /></div>
                  <h3>أرباح أوضح للكباتن</h3>
                  <p>تابع أرباحك وعمولة المنصة، واطلب سحب رصيدك من التطبيق.</p>
                </article>
              </div>
            </div>
          </section>
      
          <section id="how">
            <div className="wrap">
              <div className="sec-head reveal">
                <span className="eyebrow">كيف يعمل</span>
                <h2>من الطلب إلى الوصول في أربع خطوات</h2>
                <p>بسيط وواضح، وكل مرحلة تراها على الشاشة.</p>
              </div>
              <ol className="steps" ref={railRef}>
                <li className="step reveal"><span className="num">١</span><div><h3>سجّل وابدأ</h3><p>أنشئ حسابك أو سجّل دخولك في دقائق.</p></div></li>
                <li className="step reveal"><span className="num">٢</span><div><h3>اختر رحلة أو توصيل</h3><p>حدّد من أين وإلى أين، وأضف تفاصيل الطلب.</p></div></li>
                <li className="step reveal"><span className="num">٣</span><div><h3>تابع كابتنك</h3><p>شريط التقدم يوضّح كل مرحلة حتى الوصول.</p></div></li>
                <li className="step reveal"><span className="num">٤</span><div><h3>ادفع وقيّم</h3><p>ادفع نقداً أو عبر إنستا باي، ثم قيّم الكابتن.</p></div></li>
              </ol>
            </div>
          </section>
      
          <section id="apps">
            <div className="wrap">
              <div className="sec-head reveal">
                <span className="eyebrow">تطبيقان</span>
                <h2>تطبيق للراكب وتطبيق للكابتن</h2>
                <p>كل طرف يرى ما يحتاجه فقط، بنفس اللغة البصرية البسيطة.</p>
              </div>
              <div className="apps-head">
                <div className="tabs" role="tablist" aria-label="اختر التطبيق">
                  <button className="tab" role="tab" id="tab-rider" aria-controls="panel-rider" aria-selected={tab === 'rider'} onClick={() => setTab('rider')}>تطبيق الراكب</button>
                  <button className="tab" role="tab" id="tab-captain" aria-controls="panel-captain" aria-selected={tab === 'captain'} onClick={() => setTab('captain')}>تطبيق الكابتن</button>
                </div>
              </div>
      
              <div className="panel" id="panel-rider" role="tabpanel" aria-labelledby="tab-rider" hidden={tab !== 'rider'}>
                <div className="copy">
                  <h3>رحلتك وطلبك، من أول خطوة إلى الوصول</h3>
                  <p>احجز رحلة أو اطلب توصيل، وتابع كل مرحلة على الشاشة.</p>
                  <ul className="ticks">
                    <li>رحلات وطلبات توصيل</li>
                    <li>تتبّع الكابتن لحظة بلحظة</li>
                    <li>الدفع نقداً أو إنستا باي أو المحافظ الإلكترونية</li>
                    <li>تقييم الكابتن بعد الرحلة</li>
                  </ul>
                  <a className="btn btn-primary" href="#download" style={{ alignSelf: 'flex-start' }}>حمّل تطبيق الراكب</a>
                </div>
                <div className="gallery">
                  <div className="phone"><img loading="lazy" src="assets/rider-pay.jpg" width="540" height="1178" alt="شاشة طرق الدفع في تطبيق وصّل" /></div>
                  <div className="phone"><img loading="lazy" src="assets/rider-ride.jpg" width="540" height="1178" alt="شاشة طلب رحلة في تطبيق وصّل" /></div>
                  <div className="phone"><img loading="lazy" src="assets/rider-order.jpg" width="540" height="1178" alt="شاشة طلب توصيل في تطبيق وصّل" /></div>
                </div>
              </div>
      
              <div className="panel captain" id="panel-captain" role="tabpanel" aria-labelledby="tab-captain" hidden={tab !== 'captain'}>
                <div className="copy">
                  <h3>اربح من رحلاتك وتوصيلاتك</h3>
                  <p>استقبل الطلبات القريبة منك، واختر ما يناسبك، وتابع أرباحك.</p>
                  <ul className="ticks">
                    <li>قبول الرحلات وطلبات التوصيل</li>
                    <li>متابعة الأرباح وعمولة المنصة</li>
                    <li>طلب سحب الرصيد</li>
                    <li>رفع المستندات ومتابعة حالة الاعتماد</li>
                  </ul>
                  <a className="btn btn-primary" href="#download" style={{ alignSelf: 'flex-start' }}>انضم ككابتن</a>
                </div>
                <div className="gallery">
                  <div className="phone"><img loading="lazy" src="assets/drv-earnings.jpg" width="540" height="1178" alt="شاشة الأرباح في تطبيق الكابتن" /></div>
                  <div className="phone"><img loading="lazy" src="assets/drv-online.jpg" width="540" height="1178" alt="الشاشة الرئيسية في تطبيق الكابتن" /></div>
                  <div className="phone"><img loading="lazy" src="assets/drv-trips.jpg" width="540" height="1178" alt="شاشة الرحلات في تطبيق الكابتن" /></div>
                </div>
              </div>
            </div>
          </section>
      
          <section id="faq">
            <div className="wrap">
              <div className="sec-head reveal">
                <span className="eyebrow">أسئلة</span>
                <h2>الأسئلة الشائعة</h2>
                <p>إجابات سريعة عن الرحلات والتوصيل والدفع.</p>
              </div>
              <div className="faq">
                {FAQ.map(([q, a], i) => (
                  <details key={q} open={openFaq === i}>
                    <summary onClick={(e) => { e.preventDefault(); setOpenFaq(openFaq === i ? -1 : i); }}>{q}</summary>
                    <p>{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
      
          <section id="download" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="cta-panel reveal">
                <h2>ابدأ رحلتك مع وصّل اليوم</h2>
                <p>حمّل التطبيق واحجز أول رحلة أو اطلب أول توصيل في دقائق.</p>
                <div className="stores">
                              <a className="store primary" href="#download"><small>متوفر على</small><b>Google Play</b></a>
                </div>
              </div>
            </div>
          </section>
        </main>
      
        <footer>
          <div className="wrap foot">
            <div className="brand"><img src="assets/logo.png" width="100" height="40" alt="وصّل" /><span>أقرب لك .. دائماً</span></div>
            <span>© <span>{new Date().getFullYear()}</span> وصّل. جميع الحقوق محفوظة.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
