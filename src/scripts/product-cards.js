const productCardImage = new URL('../images/product-card.jpg', import.meta.url).href;
const favoriteIcon = new URL('../images/favorite-icon.svg', import.meta.url).href;
const compareIcon = new URL('../images/catalog-icon.svg', import.meta.url).href;

const CARD_HTML = `
  <article class="product-card">
    <div class="product-card__media">
      <img src="${productCardImage}" alt="Vickers Smart VCH-07HE" />
      <div class="product-card__icons" aria-hidden="true">
        <img src="${favoriteIcon}" alt="" aria-hidden="true" />
        <img src="${compareIcon}" alt="" aria-hidden="true" />
      </div>
    </div>
    <div class="product-card__body">
      <p class="product-card__kicker">Настенный кондиционер</p>
      <h3>Vickers Smart VCH-07HE</h3>
      <dl>
        <div><dt>Компрессор</dt><dd>Не инвертор</dd></div>
        <div><dt>Площадь, м²</dt><dd>20</dd></div>
        <div><dt>Охлаждение, кВт</dt><dd>2.05</dd></div>
      </dl>
      <div class="product-card__footer">
        <strong>14 тыс ₽</strong>
        <div class="product-card__buttons">
          <a href="/src/pages/product.html">подробнее</a>
          <a class="is-dark" href="#">добавить в корзину</a>
        </div>
      </div>
    </div>
  </article>
`;

function renderCards() {
  document.querySelectorAll('[data-product-cards]').forEach((host) => {
    const count = Number(host.getAttribute('data-product-cards')) || 4;
    host.innerHTML = Array.from({ length: count }, () => CARD_HTML).join('');
  });
}

renderCards();
