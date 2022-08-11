const { assert } = require('chai');

const BASE = '/hw/store/';

const getUrl = (url) => BASE + (url ?? '');

describe('Корзина', async function() {
    it('если товаров в корзине нет, то цифра в шапке не отображается', async function() {
        await this.browser.url(getUrl());

        const navbar = await this.browser.$('.navbar-nav');
        await navbar.waitForExist({ timeout: 5000 });
        const cartLinkTitle = await navbar.$(`.nav-link[href="${getUrl('cart')}"]`).getText();

        assert.equal(cartLinkTitle.toLowerCase(), 'cart');
    });

    it('если корзина пустая, отображается ссылка на страницу "каталог"', async function() {
        await this.browser.url(getUrl('cart'));

        const cart = await this.browser.$('.Cart');
        await cart.waitForExist({ timeout: 5000 });
        const linkToCatalog = await cart.$('a').getAttribute('href');

        assert.equal(linkToCatalog, getUrl('catalog'));
    });

    it('если добавить в корзину два одинаковых товара, то в шапке будет цифра - один', async function() {
        await this.browser.url(getUrl('catalog'));

        const product = await this.browser.$('.ProductItem');
        await product.waitForExist({ timeout: 5000 });
        await product.$('.card-link').click();
    
        const buttonAddProduct = await this.browser.$('.ProductDetails-AddToCart');
        await buttonAddProduct.waitForExist({ timeout: 5000 });
        await buttonAddProduct.click();
        await buttonAddProduct.click();

        const cartLinkTitle = await this.browser.$(`.nav-link[href="${getUrl('cart')}"]`).getText();

        assert.equal(cartLinkTitle.toLowerCase(), 'cart (1)');
    });

    it('если добавить в корзину два разных товара, то в шапке будет цифра - два', async function() {
        await this.browser.url(getUrl('catalog'));

        const productOne = await this.browser.$('.Catalog > .row:last-child > div:nth-child(1)');
        await productOne.waitForExist({ timeout: 5000 });
        await productOne.$('.card-link').click();
    
        let buttonAddProduct = await this.browser.$('.ProductDetails-AddToCart');
        await buttonAddProduct.waitForExist({ timeout: 5000 });
        await buttonAddProduct.click();

        await this.browser.url(getUrl('catalog'));

        const productTwo = await this.browser.$('.Catalog > .row:last-child > div:nth-child(2)');
        await productTwo.waitForExist({ timeout: 5000 });
        await productTwo.$('.card-link').click();

        buttonAddProduct = await this.browser.$('.ProductDetails-AddToCart');
        await buttonAddProduct.waitForExist({ timeout: 5000 });
        await buttonAddProduct.click();

        const cartLinkTitle = await this.browser.$(`.nav-link[href="${getUrl('cart')}"]`).getText();

        assert.equal(cartLinkTitle.toLowerCase(), 'cart (2)');
    });

    it('если добавить товар в корзину, то в корзине отображается таблица', async function() {
        await this.browser.url(getUrl('catalog'));

        const productOne = await this.browser.$('.ProductItem');
        await productOne.waitForExist({ timeout: 5000 });
        await productOne.$('.card-link').click();
    
        const buttonAddProduct = await this.browser.$('.ProductDetails-AddToCart');
        await buttonAddProduct.waitForExist({ timeout: 5000 });
        await buttonAddProduct.click();

        await this.browser.url(getUrl('cart'));

        const table = await this.browser.$('.Cart-Table');
        await table.waitForExist({ timeout: 5000 });
        const tableIsExisting = await table.isExisting();

        assert.isTrue(tableIsExisting);
    });

    it('нажав на кнопку "очистить корзину", пропадает таблица с товарами', async function() {
        await this.browser.url(getUrl('catalog'));

        const productOne = await this.browser.$('.ProductItem');
        await productOne.waitForExist({ timeout: 5000 });
        await productOne.$('.card-link').click();
    
        const buttonAddProduct = await this.browser.$('.ProductDetails-AddToCart');
        await buttonAddProduct.waitForExist({ timeout: 5000 });
        await buttonAddProduct.click();

        await this.browser.url(getUrl('cart'));

        const buttonClearProducts = await this.browser.$('.Cart-Clear');
        await buttonClearProducts.waitForExist({ timeout: 5000 });
        await buttonClearProducts.click();
        const tableIsExisting = await this.browser.$('.Cart-Table').isExisting();

        assert.isFalse(tableIsExisting);
    });
});
