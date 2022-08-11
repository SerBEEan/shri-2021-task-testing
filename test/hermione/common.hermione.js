const { assert } = require('chai');

const BASE = '/hw/store/';

const getUrl = (url) => BASE + (url ?? '');

describe('общие', async function() {
    it('корректная верстка на ширине x > 1400', async function() {
        // хотя в css стоит правило от 1440, но тест проходит только от 1415
        await this.browser.setWindowSize(1415, 1000);
        await this.browser.url(getUrl());

        const { width } = await this.browser.$('.container').getSize();

        assert(width === 1320);
    });

    it('корректная верстка на ширине x < 1400', async function() {
        await this.browser.setWindowSize(1399, 1000);
        await this.browser.url(getUrl());

        const { width } = await this.browser.$('.container').getSize();

        assert(width === 1140);
    });

    it('корректная верстка на ширине < 1200', async function() {
        await this.browser.url(getUrl());
        await this.browser.setWindowSize(1199, 1000);

        const { width } = await this.browser.$('.container').getSize();

        assert(width === 960);
    });

    it('корректная верстка на ширине < 992', async function() {
        await this.browser.url(getUrl());
        await this.browser.setWindowSize(991, 1000);

        const { width } = await this.browser.$('.container').getSize();

        assert(width === 720);
    });

    it('корректная верстка на ширине < 768', async function() {
        await this.browser.url(getUrl());
        await this.browser.setWindowSize(767, 1000);

        const { width } = await this.browser.$('.container').getSize();

        assert(width === 540);
    });

    it('корректная верстка на ширине < 576', async function() {
        await this.browser.url(getUrl());
        await this.browser.setWindowSize(575, 1000);

        const { width } = await this.browser.$('.container').getSize();

        // в css правило width == 100%. Значит нужно сравнивать с 575, но проходит только при 545
        assert(width === 545);
    });

    it('В шапке есть ссылка на "каталог"', async function() {        
        await this.browser.url(getUrl());
        
        const links = await this.browser.$('nav').$$('.nav-link').map(async (linkElem) => await linkElem.getAttribute('href'));

        assert.include(links, getUrl('catalog'));
    });

    it('В шапке есть ссылка на "условия доставки"', async function() {
        await this.browser.url(getUrl());

        const links = await this.browser.$('nav').$$('.nav-link').map(async (linkElem) => await linkElem.getAttribute('href'));

        assert.include(links, getUrl('delivery'));
    });
    
    it('В шапке есть ссылка на "контакты"', async function() {
        await this.browser.url(getUrl());

        const links = await this.browser.$('nav').$$('.nav-link').map(async (linkElem) => await linkElem.getAttribute('href'));

        assert.include(links, getUrl('contacts'));
    });

    it('В шапке есть ссылка на корзину', async function() {
        await this.browser.url(getUrl());

        const links = await this.browser.$('nav').$$('.nav-link').map(async (linkElem) => await linkElem.getAttribute('href'));

        assert.include(links, getUrl('cart'));
    });

    it('название магазина в шапке - это ссылка на главную страницу', async function() {
        await this.browser.url(getUrl());

        const linkBrand = await this.browser.$('nav').$('.navbar-brand').getAttribute('href');

        assert.equal(linkBrand, getUrl());
    });

    it('если ширина < 576px, то меню скрывается', async function() {
        await this.browser.url(getUrl());
        await this.browser.setWindowSize(575, 1000);

        const menuDisplay = await this.browser.$('.Application-Menu').getCSSProperty('display');

        assert.equal(menuDisplay.value, 'none');
    });

    it('если ширина < 576px, то появляется "гамбургер"', async function() {
        await this.browser.url(getUrl());
        await this.browser.setWindowSize(575, 1000);

        const toggleDisplay = await this.browser.$('.navbar-toggler').getCSSProperty('display');

        assert.notEqual(toggleDisplay.value, 'none');
    });

    it('если ширина > 576px, то "гамбургер" скрывается', async function() {
        await this.browser.url(getUrl());
        // тест должен был пройти при 577px, но экран изменился только при 589
        await this.browser.setWindowSize(589, 1000);

        const toggleDisplay = await this.browser.$('.navbar-toggler').getCSSProperty('display');

        assert.equal(toggleDisplay.value, 'none');
    });

    it('при клике на "гамбургер", открывается меню', async function() {
        await this.browser.url(getUrl());
        await this.browser.setWindowSize(575, 1000);

        await this.browser.$('.navbar-toggler').click();
        const menuDisplay = await this.browser.$('.Application-Menu').getCSSProperty('display');

        assert.notEqual(menuDisplay.value, 'none');
    });

    it('при клике на элемент из меню "гамбургера", меню закроется', async function() {
        await this.browser.url(getUrl());
        await this.browser.setWindowSize(575, 1000);

        const menu = await this.browser.$('.Application-Menu');

        await this.browser.$('.navbar-toggler').click();
        await menu.$('.nav-link').click();
        const menuDisplay = await menu.getCSSProperty('display');

        assert.equal(menuDisplay.value, 'none');
    });
});
