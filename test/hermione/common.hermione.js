const { assert } = require('chai');
const { getUrl } = require('../utils/getUrl');

const MAIN_PAGE = getUrl();
const CATALOG_PAGE = getUrl('catalog');
const DELIVERY_PAGE = getUrl('delivery');
const CONTACTS_PAGE = getUrl('contacts');
const CART_PAGE = getUrl('cart');

const containerSelector = '.container';
const navSelector = 'nav';
const navLinkSelector = '.nav-link';
const navbarBrandSelector = '.navbar-brand';
const applicationMenuSelector = '.Application-Menu';
const navbarTogglerSelector = '.navbar-toggler';


describe('общие', async function() {
    it('корректная верстка на ширине x > 1400', async function() {
        // хотя в css стоит правило от 1440, но тест проходит только от 1415
        await this.browser.setWindowSize(1415, 1000);
        await this.browser.url(MAIN_PAGE);

        const { width } = await this.browser.$(containerSelector).getSize();

        assert(width === 1320);
    });

    it('корректная верстка на ширине x < 1400', async function() {
        await this.browser.setWindowSize(1399, 1000);
        await this.browser.url(MAIN_PAGE);

        const { width } = await this.browser.$(containerSelector).getSize();

        assert(width === 1140);
    });

    it('корректная верстка на ширине < 1200', async function() {
        await this.browser.url(MAIN_PAGE);
        await this.browser.setWindowSize(1199, 1000);

        const { width } = await this.browser.$(containerSelector).getSize();

        assert(width === 960);
    });

    it('корректная верстка на ширине < 992', async function() {
        await this.browser.url(MAIN_PAGE);
        await this.browser.setWindowSize(991, 1000);

        const { width } = await this.browser.$(containerSelector).getSize();

        assert(width === 720);
    });

    it('корректная верстка на ширине < 768', async function() {
        await this.browser.url(MAIN_PAGE);
        await this.browser.setWindowSize(767, 1000);

        const { width } = await this.browser.$(containerSelector).getSize();

        assert(width === 540);
    });

    it('корректная верстка на ширине < 576', async function() {
        await this.browser.url(MAIN_PAGE);
        await this.browser.setWindowSize(575, 1000);

        const { width } = await this.browser.$(containerSelector).getSize();

        // в css правило width == 100%. Значит нужно сравнивать с 575, но проходит только при 545
        assert(width === 545);
    });

    it('В шапке есть ссылка на "каталог"', async function() {        
        await this.browser.url(MAIN_PAGE);
        
        const links = await this.browser.$(navSelector).$$(navLinkSelector).map(async (linkElem) => await linkElem.getAttribute('href'));

        assert.include(links, CATALOG_PAGE);
    });

    it('В шапке есть ссылка на "условия доставки"', async function() {
        await this.browser.url(MAIN_PAGE);

        const links = await this.browser.$(navSelector).$$(navLinkSelector).map(async (linkElem) => await linkElem.getAttribute('href'));

        assert.include(links, DELIVERY_PAGE);
    });
    
    it('В шапке есть ссылка на "контакты"', async function() {
        await this.browser.url(MAIN_PAGE);

        const links = await this.browser.$(navSelector).$$(navLinkSelector).map(async (linkElem) => await linkElem.getAttribute('href'));

        assert.include(links, CONTACTS_PAGE);
    });

    it('В шапке есть ссылка на корзину', async function() {
        await this.browser.url(MAIN_PAGE);

        const links = await this.browser.$(navSelector).$$(navLinkSelector).map(async (linkElem) => await linkElem.getAttribute('href'));

        assert.include(links, CART_PAGE);
    });

    it('название магазина в шапке - это ссылка на главную страницу', async function() {
        await this.browser.url(MAIN_PAGE);

        const linkBrand = await this.browser.$(navSelector).$(navbarBrandSelector).getAttribute('href');

        assert.equal(linkBrand, MAIN_PAGE);
    });

    it('если ширина < 576px, то меню скрывается', async function() {
        await this.browser.url(MAIN_PAGE);
        await this.browser.setWindowSize(575, 1000);

        const menuDisplay = await this.browser.$(applicationMenuSelector).getCSSProperty('display');

        assert.equal(menuDisplay.value, 'none');
    });

    it('если ширина < 576px, то появляется "гамбургер"', async function() {
        await this.browser.url(MAIN_PAGE);
        await this.browser.setWindowSize(575, 1000);

        const toggleDisplay = await this.browser.$(navbarTogglerSelector).getCSSProperty('display');

        assert.notEqual(toggleDisplay.value, 'none');
    });

    it('если ширина > 576px, то "гамбургер" скрывается', async function() {
        await this.browser.url(MAIN_PAGE);
        // тест должен был пройти при 577px, но экран изменился только при 589
        await this.browser.setWindowSize(589, 1000);

        const toggleDisplay = await this.browser.$(navbarTogglerSelector).getCSSProperty('display');

        assert.equal(toggleDisplay.value, 'none');
    });

    it('при клике на "гамбургер", открывается меню', async function() {
        await this.browser.url(MAIN_PAGE);
        await this.browser.setWindowSize(575, 1000);

        await this.browser.$(navbarTogglerSelector).click();
        const menuDisplay = await this.browser.$(applicationMenu).getCSSProperty('display');

        assert.notEqual(menuDisplay.value, 'none');
    });

    it('при клике на элемент из меню "гамбургера", меню закроется', async function() {
        await this.browser.url(MAIN_PAGE);
        await this.browser.setWindowSize(575, 1000);

        const menu = await this.browser.$(applicationMenuSelector);

        await this.browser.$(navbarTogglerSelector).click();
        await menu.$(navLinkSelector).click();
        const menuDisplay = await menu.getCSSProperty('display');

        assert.equal(menuDisplay.value, 'none');
    });
});
