
import React, { useEffect, useMemo, useState } from 'react';
import { FaFacebookF } from 'react-icons/fa';
import { FaInstagram, FaTiktok } from 'react-icons/fa6';
import AdminPanel from './AdminPanel.jsx';
import { CartProvider } from './Cart/CartContext.jsx';
import QuantityControl from './Cart/QuantityControl.jsx';
import CartDrawer from './Cart/CartDrawer.jsx';
import Checkout from './Cart/Checkout.jsx';

const menu = [
  { category: 'برجر لحوم', title: 'برجر لحوم', image: 'sandwiches', items: [
    ['بيف كلاسيك', 100], ['بيف لافا', 110], ['بيف بوم', 130], ['بيف مشروم', 110],
    ['بيف هالبينو', 110], ['دابل كلاسيك', 155], ['دابل لافا', 175], ['F16', 125]
  ]},
  { category: 'برجر فراخ', title: 'برجر فراخ', image: 'sandwiches', items: [
    ['تشيكن كلاسيك', 100], ['تشيكن لافا', 110], ['تشيكن أونيون', 110], ['تشيكن هالبينو', 110],
    ['تشيكن بوم', 130], ['تشيكن والو', 115], ['تشيكن سلو', 115], ['تشيكن تندوري', 120], ['تشيكن شيتوس', 115]
  ]},
  { category: 'وجبات', title: 'وجبات برجراية', image: 'sandwiches', items: [
    ['وجبة تشيكن فايبر', 140], ['وجبة تندوري', 140], ['وجبة كريسبي', 140], ['وجبة فاهيتا', 140], ['وجبة مشوي', 140]
  ]},
  { category: 'برجر ساندوتش', title: 'برجر ساندوتش', image: 'sandwiches', items: [
    ['سماش كلاسيك سينجل', 85], ['سماش كلاسيك دبل', 110], ['سماش مشروم دبل', 120],
    ['سماش هالبينو دبل', 120], ['سماش هيو', 140], ['سماش أونيون مشروم دبل', 140], ['سماش كريمي مشروم', 130]
  ]},
  { category: 'برجر سبيشال', title: 'برجر سبيشال', image: 'sandwiches', items: [
    ['هوت دوج', 50], ['ميلانو', 65], ['كلاسيك ميكس', 155], ['لافا ميكس', 175]
  ]},
  { category: 'بطاطس', title: 'بطاطس', image: 'sandwiches', items: [
    ['باكت بطاطس', 45], ['بطاطس كاتشب ومايونيز', 50], ['بطاطس جبنة', 65], ['بطاطس ميلانو', 80],
    ['بطاطس كريسبي', 90], ['بطاطس ميكسيكي', 80], ['بطاطس والو', 100], ['بطاطس شيتوس', 75]
  ]},
  { category: 'إضافات', title: 'إضافات', image: 'sandwiches', items: [
    ['قطعة لحم', 55], ['قطعة فراخ', 55], ['قطعة لحم مدخنة', 65], ['قطعة فراخ مدخنة', 65],
    ['كانز', 20], ['سلطة كول سلو', 15], ['صوصات (أي نوع)', 10], ['صوص شيدر', 20],
    ['بيف بيكون', 20], ['تركي مدخن', 15], ['بصل مكرمل', 10], ['أونيون رينجز', 10],
    ['موزاريلا ستيكس', 20], ['هالبينو', 10], ['مشروم', 15], ['قطعة سماش', 40], ['صياح هوت دوج', 20]
  ]}
];

const categories = ['الكل', ...menu.map(({ category }) => category)];

function Brand({ footer = false, onClick }) {
  return (
    <a
      className={footer ? 'footer-brand' : 'brand'}
      href="#home"
      aria-label="برجراية - الرئيسية"
      onClick={onClick}
    >
      <img
        src="/assets/burgeraya-logo.png"
        alt="شعار برجراية"
      />
    </a>
  );
}

function MenuCard({ section, term }) {
  const items = section.items.filter(([name]) =>
    name.toLowerCase().includes(term) || section.title.toLowerCase().includes(term)
  );

  if (!items.length) return null;

  return (
    <article className="menu-card">
      <header className="card-head">
        <div className="card-title">
          <h3>{section.title}</h3>
          <span className="card-count">{String(items.length).padStart(2, '0')} أصناف</span>
        </div>
        <MenuArt type={section.image} />
      </header>
      {items.map(([name, smallPrice, largePrice]) => {
        const variants = [
          smallPrice != null && { size: 'M', price: smallPrice },
          largePrice != null && { size: 'L', price: largePrice }
        ].filter(Boolean);
        if (variants.length === 1 && largePrice == null) variants[0].size = null;
        return (
          <div className="menu-item" key={name}>
            <span className="item-name">{name}</span>
            <div className="kc-item-end kc-size-options">
              {variants.map(({ size, price }) => {
                const product = { id: `${section.title}::${name}::${size || 'regular'}`, name: size ? `${name} (${size})` : name, price: Number(price) };
                return (
                  <div className="kc-size-option" key={size || 'regular'}>
                    <span className="item-price">{size && <small>{size} </small>}{price} <small>ج.م</small></span>
                    <QuantityControl product={product} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </article>
  );
}

function MenuArt() {
  return (
    <div className="menu-photo" aria-hidden="true">
      <img src="/assets/burgeraya-logo.png" alt="" />
    </div>
  );
}
function CafeSite() {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const menuSections = menu;
  const [activeSection, setActiveSection] = useState('home');
  const [search, setSearch] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [menuPdfOpen, setMenuPdfOpen] = useState(false);

  const term = search.trim().toLowerCase();

  const visibleSections = useMemo(
    () =>
      menuSections.filter((section) => {
        const inCategory =
          activeCategory === 'الكل' ||
          section.category === activeCategory;

        const hasMatch = section.items.some(
          ([name]) =>
            name.toLowerCase().includes(term) ||
            section.title.toLowerCase().includes(term)
        );

        return inCategory && hasMatch;
      }),
    [activeCategory, term, menuSections]
  );

  const itemCount = visibleSections.reduce(
    (sum, section) =>
      sum +
      section.items.filter(
        ([name]) =>
          name.toLowerCase().includes(term) ||
          section.title.toLowerCase().includes(term)
      ).length,
    0
  );

  const closeMobileNav = () => setMobileNavOpen(false);

  useEffect(() => {
    const sectionIds = ['home', 'menu', 'about', 'locations'];

    const updateActiveSection = () => {
      let current = 'home';

      for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (
          section &&
          section.getBoundingClientRect().top <= window.innerHeight * 0.36
        ) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', updateActiveSection, {
      passive: true
    });

    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, []);

  const handleNavClick = (section) => {
    setActiveSection(section);
    closeMobileNav();
  };

  useEffect(() => {
    if (!menuPdfOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuPdfOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuPdfOpen]);

  return (
    <>
      {menuPdfOpen && (
        <div className="menu-pdf-viewer">
          <button
            className="menu-pdf-backdrop"
            type="button"
            aria-label="إغلاق المنيو المصور"
            onClick={() => setMenuPdfOpen(false)}
          />
          <section className="menu-pdf-dialog" role="dialog" aria-modal="true" aria-label="المنيو المصور لبرجراية">
            <div className="menu-pdf-toolbar">
              <h2>المنيو المصور</h2>
              <div className="menu-pdf-actions">
                <a href="/assets/burgeraya-menu.pdf" download="Burgeraya-Menu.pdf">تنزيل PDF</a>
                <button type="button" onClick={() => setMenuPdfOpen(false)} aria-label="رجوع إلى الموقع">
                  <span aria-hidden="true">→</span> رجوع
                </button>
              </div>
            </div>
            <div className="menu-pdf-pages" aria-label="صفحات المنيو المصور">
              <img src="/assets/burgeraya-menu-page-1.jpg" alt="الصفحة الأولى من منيو برجراية" />
              <img src="/assets/burgeraya-menu-page-2.jpg" alt="الصفحة الثانية من منيو برجراية" />
            </div>
          </section>
        </div>
      )}

      {mobileNavOpen && (
        <div className="mobile-menu-layer">
          <button
            className="mobile-menu-backdrop"
            type="button"
            aria-label="إغلاق القائمة"
            onClick={closeMobileNav}
          />

          <nav className="mobile-menu-panel" aria-label="قائمة الهاتف">
            <div className="mobile-menu-heading">
              <Brand onClick={closeMobileNav} />
              <button
                className="mobile-menu-back"
                type="button"
                aria-label="رجوع وإغلاق القائمة"
                onClick={closeMobileNav}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <a
              className={`mobile-menu-link${activeSection === 'home' ? ' active' : ''}`}
              href="#home"
              onClick={() => handleNavClick('home')}
            >
              <span>الرئيسية</span>
              <span className="nav-arrow" aria-hidden="true">↗</span>
            </a>

            <a
              className={`mobile-menu-link${activeSection === 'menu' ? ' active' : ''}`}
              href="#menu"
              onClick={() => handleNavClick('menu')}
            >
              <span>المنيو</span>
              <span className="nav-arrow" aria-hidden="true">↗</span>
            </a>

            <a
              className={`mobile-menu-link${activeSection === 'about' ? ' active' : ''}`}
              href="#about"
              onClick={() => handleNavClick('about')}
            >
              <span>حكايتنا</span>
              <span className="nav-arrow" aria-hidden="true">↗</span>
            </a>

          </nav>
        </div>
      )}

      <header className="site-header">
        <Brand />

        <button
          className={`menu-toggle${mobileNavOpen ? ' is-open' : ''}`}
          type="button"
          aria-label={
            mobileNavOpen ? 'إغلاق القائمة' : 'فتح القائمة'
          }
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          <span></span>
          <span></span>
        </button>

        <nav className="main-nav" aria-label="القائمة الرئيسية">
          <a
            className={activeSection === 'home' ? 'active' : ''}
            href="#home"
            onClick={() => handleNavClick('home')}
          >
            الرئيسية
          </a>

          <a
            className={activeSection === 'menu' ? 'active' : ''}
            href="#menu"
            onClick={() => handleNavClick('menu')}
          >
            المنيو
          </a>

          <a
            className={activeSection === 'about' ? 'active' : ''}
            href="#about"
            onClick={() => handleNavClick('about')}
          >
            حكايتنا
          </a>

          <a
            className={activeSection === 'locations' ? 'active' : ''}
            href="#locations"
            onClick={() => handleNavClick('locations')}
          >
            العنوان والتواصل
          </a>
        </nav>

        <a className="header-cta" href="#menu">
          اختار طلبك <span>↗</span>
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <span className="eyebrow">
              <i></i> برجراية · طعمها حكاية
            </span>

            <h1>
              كل لقمة
              <br />
              لها <em>حكاية</em>
            </h1>

            <p>
              برجر طازة، فرايز سخنة، وطعم يرجعك تاني. اختار طلبك من المنيو.
            </p>

            <a className="primary-button" href="#menu">
              شوف المنيو <span>↓</span>
            </a>

            <div className="hero-note">
              <span className="note-line"></span>
              <span>أحلى برجر في حكاية</span>
            </div>
          </div>

          <div className="hero-art" aria-label="شعار برجراية">
            <div className="art-halo"></div>
            <img src="/assets/burgeraya-logo.png" alt="شعار برجراية" />
            <span className="hero-logo-caption">برجراية<br/><b>طعمها حكاية</b></span>
          </div>

          <div className="hero-bottom">
            <span>برجر · فرايز · طعمها حكاية</span>
            <span>اسحب واكتشف ↓</span>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <i></i> اختار اللي بتحبه
              </span>

              <h2>
                منيو <em>برجراية</em>
              </h2>
            </div>

            <p>
              اختار البرجر والوجبة اللي على مزاجك.
            </p>
            <button className="menu-pdf-link" type="button" onClick={() => setMenuPdfOpen(true)}>
              المنيو المصور كاملًا <span>↗</span>
            </button>
          </div>

          <div className="menu-tools">
            <div
              className="category-tabs"
              role="tablist"
              aria-label="تصنيفات المنيو"
            >
              {categories.map((category) => (
                <button
                  className={`category-tab${activeCategory === category ? ' active' : ''}`}
                  role="tab"
                  aria-selected={activeCategory === category}
                  type="button"
                  key={category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <label className="search-box">
              <span aria-hidden="true">⌕</span>

              <input
                type="search"
                placeholder="دور على برجر أو وجبة..."
                aria-label="ابحث في المنيو"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          <div className="menu-count" aria-live="polite">
            {itemCount} أصناف ·{' '}
            {activeCategory === 'الكل' ? 'كل المنيو' : activeCategory}
          </div>

          {visibleSections.length > 0 ? (
            <div className="menu-grid">
              {visibleSections.map((section) => (
                <MenuCard
                  section={section}
                  term={term}
                  key={section.title}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              مفيش صنف بالاسم ده. جرب تبحث باسم تاني.
            </div>
          )}
        </section>

        <section className="story-section" id="about">
          <div className="story-copy">
            <span className="eyebrow">
              <i></i> حكاية برجراية
            </span>

            <h2>
              كل لقمة
              <br />
              لها <em>حكاية</em>
            </h2>

            <p>
              في برجراية بنهتم بكل تفصيلة، من أول اختيار المكونات لحد ما طلبك يوصلك بطعم يفتح النفس.
            </p>

            <a href="#menu" className="text-link">
              اختار طلبك <span>↗</span>
            </a>
          </div>

          <div className="story-stamp">
            <span>طعم</span>
            <strong>♡</strong>
            <span>يفرق</span>
          </div>
        </section>

        <section className="locations-section" id="locations">
          <div className="locations-heading">
            <span className="eyebrow">
              <i></i> تواصل معانا
            </span>

            <h2>
              اطلب <em>اللي نفسك فيه</em>
            </h2>

            <p>
              كلمنا واطلب اللي نفسك فيه. إحنا على بُعد رسالة.
            </p>
          </div>

          <div className="locations-layout">
            <div className="locations-details">
              <article className="location-card">
                <div className="location-card-heading">
                  <span className="contact-icon pin-icon">⌖</span>

                  <div>
                    <span className="footer-label">
                      برجراية · طعمها حكاية
                    </span>
                    <h3>موقعنا
</h3>
                  </div>

                  <a className="directions-button" href="https://www.google.com/maps/dir/?api=1&destination=30.8206005%2C30.8157997" target="_blank" rel="noreferrer">الاتجاهات <span>↗</span></a>
                </div>

                <p className="address-line">
                  كفر الزيات - حي رمسيس - بجوار محل عصفور الجنة
                </p>
              </article>

              <article className="location-card hotline-card">
                <div className="location-card-heading">
                  <span className="contact-icon phone-icon">⌕</span>

                  <div>
                    <span className="footer-label">اتصل أو ابعتلنا</span>
                    <h3>تواصل مع برجراية</h3>
                  </div>
                </div>

                <div className="contact-rows">
                  <div className="contact-row">
                    <div>
                      <span className="contact-type">موبايل</span>
                      <a
                        className="contact-number"
                        href="tel:+201557622521"
                      >
                        01557622521
                      </a>
                    </div>

                    <div className="contact-actions">
                      <a className="call-button" href="tel:+201557622521">
                        <span className="call-symbol">📞</span>
                        <span>اتصل بنا</span>
                      </a>

                      <a
                        className="chat-button"
                        href="https://wa.me/201557622521"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="واتساب برجراية على 01557622521"
                      >
                        <svg
                          className="wa-symbol"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M12.04 2a9.94 9.94 0 0 0-8.53 15.05L2.1 22l5.1-1.34A10 10 0 1 0 12.04 2Zm0 18.2a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.03.8.81-2.95-.2-.31A8.16 8.16 0 1 1 12.04 20.2Zm4.48-6.11c-.25-.13-1.47-.73-1.7-.81-.23-.09-.39-.13-.55.13-.17.25-.64.81-.78.97-.15.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.01-.39.11-.52.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.55-1.33-.76-1.83-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.42.06-.64.31-.22.25-.85.84-.85 2.04s.87 2.37.99 2.53c.12.17 1.72 2.63 4.16 3.69.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.59.21-1.09.15-1.19-.06-.1-.22-.16-.47-.29Z"
                          />
                        </svg>
                        <span>واتساب</span>
                      </a>
                    </div>
                  </div>


                </div>
              </article>
              <article className="location-card social-card">
                <div className="burgeraya-social-links">
                  <a className="burgeraya-social-link facebook" href="https://www.facebook.com/burgerayaa" target="_blank" rel="noreferrer" aria-label="صفحة برجراية على فيسبوك" title="فيسبوك">
                    <FaFacebookF />
                  </a>
                  <a className="burgeraya-social-link instagram" href="https://www.instagram.com/burgeraia/" target="_blank" rel="noreferrer" aria-label="صفحة برجراية على إنستجرام" title="إنستجرام">
                    <FaInstagram />
                  </a>
                  <a className="burgeraya-social-link tiktok" href="https://www.tiktok.com/@burgraia" target="_blank" rel="noreferrer" aria-label="صفحة برجراية على تيك توك" title="تيك توك">
                    <FaTiktok />
                  </a>
                </div>
              </article>
            </div>
            <div className="map-card burgeraya-map-card">
              <iframe
                title="خريطة موقع برجراية في حي رمسيس"
                src="https://www.google.com/maps?q=30.8206005%2C30.8157997&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-reference-row">
          <Brand footer />

          <nav aria-label="Footer navigation">
            <a href="#home">الرئيسية</a>
            <a href="#menu">المنيو</a>
            <a href="#locations">العنوان والتواصل</a>
          </nav>

          <a href="#home" className="footer-top-button">
            فوق تاني ↑
          </a>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <span>برجراية · طعمها حكاية</span>
            <span>
              © {new Date().getFullYear()} برجراية. جميع الحقوق محفوظة.
            </span>
          </div>
          <a className="developer-credit" href="https://wa.me/201004365028" target="_blank" rel="noreferrer" aria-label="Contact Mohamed Abofard on WhatsApp">
            Developed by Mohamed Abofard
          </a>
        </div>
      </footer>
    </>
  );
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/admin') {
    return <AdminPanel defaultMenu={menu} />;
  }

  return (
    <CartProvider>
      {path === '/checkout' ? (
        <Checkout />
      ) : (
        <>
          <CafeSite />
          <CartDrawer />
        </>
      )}
    </CartProvider>
  );
}

export default App;

