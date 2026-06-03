import footerLogo from '../images/logo.svg';
import footerDevIcon from '../images/slay-x0020-1.png';

const FOOTER_HTML = `
  <div class="container">
    <div class="site-footer__top">
      <div class="site-footer__logo">
        <img class="site-footer__logo-mark" src="${footerLogo}" alt="MiCi" />
      </div>

      <div class="site-footer__block site-footer__block--contacts">
        <div>
          <h3>Телефон</h3>
          <a href="tel:+79999999999">+7 999 999 99 99</a>
        </div>
        <div>
          <h3>Почта</h3>
          <a href="mailto:info@mircl.ru">info@mircl.ru</a>
        </div>
      </div>

      <div class="site-footer__block">
        <h3>Каталог</h3>
        <a href="/src/pages/catalog.html">сплит-системы</a>
        <a href="/src/pages/catalog.html">доп. оборудование</a>
      </div>

      <div class="site-footer__block">
        <h3>Меню</h3>
        <a href="/src/pages/about.html">о компании</a>
        <a href="/src/pages/contacts.html">контакты</a>
        <a href="/src/pages/blog.html">блог</a>
        <a href="/src/pages/promotions.html">акции</a>
        <a href="/src/pages/service.html">установка и обслуживание</a>
      </div>
    </div>

    <div class="site-footer__bottom">
      <span>© 2025</span>
      <a href="/src/pages/privacy.html">Политика конфиденциальности</a>
      <a href="#">Политика оферты</a>
      <a href="#">Политика пользовательского соглашения</a>
      <a class="site-footer__dev" href="#" aria-label="Разработка">
        <span>Разработал</span>
        <img src="${footerDevIcon}" alt="" aria-hidden="true" />
      </a>
    </div>
  </div>
`;

export function renderFooter() {
  document.querySelectorAll('.site-footer').forEach((host) => {
    host.innerHTML = FOOTER_HTML;
  });
}

renderFooter();
