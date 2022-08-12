const { assert } = require('chai');
const { getUrl } = require('../utils/getUrl');

const MAIN_PAGE = getUrl();
const CATALOG_PAGE = getUrl('catalog');
const CART_PAGE = getUrl('cart');

const navbarNavSelector = '.navbar-nav';
const cartSelector = '.Cart';
const productItemSelector = '.ProductItem';
const cardLinkSelector = '.card-link';
const buttonAddToCartSelector = '.ProductDetails-AddToCart';
const cartTableSelector = '.Cart-Table';
const buttonCartClearSelector = '.Cart-Clear';


describe('Корзина', async function() {
    it('если товаров в корзине нет, то цифра в шапке не отображается', async function() {
        await this.browser.url(MAIN_PAGE);

        const navbar = await this.browser.$(navbarNavSelector);
        await navbar.waitForExist({ timeout: 5000 });
        const cartLinkTitle = await navbar.$(`.nav-link[href="${CART_PAGE}"]`).getText().toLowerCase();

        assert.equal(cartLinkTitle, 'cart');
    });

    it('если корзина пустая, отображается ссылка на страницу "каталог"', async function() {
        await this.browser.url(CART_PAGE);

        const cart = await this.browser.$(cartSelector);
        await cart.waitForExist({ timeout: 5000 });
        const linkToCatalog = await cart.$('a').getAttribute('href');

        assert.equal(linkToCatalog, CATALOG_PAGE);
    });

    it('если добавить в корзину два одинаковых товара, то в шапке будет цифра - один', async function() {
        await this.browser.url(CATALOG_PAGE);

        const product = await this.browser.$(productItemSelector);
        await product.waitForExist({ timeout: 5000 });
        await product.$(cardLinkSelector).click();
    
        const buttonAddProduct = await this.browser.$(buttonAddToCartSelector);
        await buttonAddProduct.waitForExist({ timeout: 5000 });
        await buttonAddProduct.click();
        await buttonAddProduct.click();

        const cartLinkTitle = await this.browser.$(`.nav-link[href="${CART_PAGE}"]`).getText().toLowerCase();

        assert.equal(cartLinkTitle, 'cart (1)');
    });

    it('если добавить в корзину два разных товара, то в шапке будет цифра - два', async function() {
        await this.browser.url(CATALOG_PAGE);

        const productOne = await this.browser.$('.Catalog > .row:last-child > div:nth-child(1)');
        await productOne.waitForExist({ timeout: 5000 });
        await productOne.$(cardLinkSelector).click();
    
        let buttonAddProduct = await this.browser.$(buttonAddToCartSelector);
        await buttonAddProduct.waitForExist({ timeout: 5000 });
        await buttonAddProduct.click();

        await this.browser.url(CATALOG_PAGE);

        const productTwo = await this.browser.$('.Catalog > .row:last-child > div:nth-child(2)');
        await productTwo.waitForExist({ timeout: 5000 });
        await productTwo.$(cardLinkSelector).click();

        buttonAddProduct = await this.browser.$(buttonAddToCartSelector);
        await buttonAddProduct.waitForExist({ timeout: 5000 });
        await buttonAddProduct.click();

        const cartLinkTitle = await this.browser.$(`.nav-link[href="${CART_PAGE}"]`).getText().toLowerCase();

        assert.equal(cartLinkTitle, 'cart (2)');
    });

    it('если добавить товар в корзину, то в корзине отображается таблица', async function() {
        await this.browser.url(CATALOG_PAGE);

        const productOne = await this.browser.$(productItemSelector);
        await productOne.waitForExist({ timeout: 5000 });
        await productOne.$(cardLinkSelector).click();
    
        const buttonAddProduct = await this.browser.$(buttonAddToCartSelector);
        await buttonAddProduct.waitForExist({ timeout: 5000 });
        await buttonAddProduct.click();

        await this.browser.url(CART_PAGE);

        const table = await this.browser.$(cartTableSelector);
        await table.waitForExist({ timeout: 5000 });
        const tableIsExisting = await table.isExisting();

        assert.isTrue(tableIsExisting);
    });

    it('нажав на кнопку "очистить корзину", пропадает таблица с товарами', async function() {
        await this.browser.url(CATALOG_PAGE);

        const productOne = await this.browser.$(productItemSelector);
        await productOne.waitForExist({ timeout: 5000 });
        await productOne.$(cardLinkSelector).click();
    
        const buttonAddProduct = await this.browser.$(buttonAddToCartSelector);
        await buttonAddProduct.waitForExist({ timeout: 5000 });
        await buttonAddProduct.click();

        await this.browser.url(CART_PAGE);

        const buttonClearProducts = await this.browser.$(buttonCartClearSelector);
        await buttonClearProducts.waitForExist({ timeout: 5000 });
        await buttonClearProducts.click();
        const tableIsExisting = await this.browser.$(cartTableSelector).isExisting();

        assert.isFalse(tableIsExisting);
    });
});
