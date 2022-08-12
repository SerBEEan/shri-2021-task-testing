const { assert } = require('chai');
const { getUrl } = require('../utils/getUrl');

const CATALOG_PAGE = getUrl('catalog');
const CART_PAGE = getUrl('cart');

const productItemSelector = '.ProductItem';
const cardTitleSelector = '.card-title';
const cardLinkSelector = '.card-link';
const productDetailsNameSelector = '.ProductDetails-Name';
const productDetailsSelector = '.ProductDetails';
const cartBadgeSelector = '.CartBadge.text-success';
const buttonAddToCartSelector = '.ProductDetails-AddToCart';
const productItemName = '.ProductItem-Name';
const cartTableSelector = '.Cart-Table';
const cartNameSelector = '.Cart-Name';
const cartCountSelector = '.Cart-Count';

describe('страница "Каталог"', async function() {
    it('с сервера приходит минимум один товар', async function() {
        await this.browser.url(CATALOG_PAGE);

        await this.browser.$(productItemSelector).waitForExist({ timeout: 5000 });
        const products = await this.browser.$$(productItemSelector);

        assert(products.length >= 1);
    });

    it('по клику на ссылку в карточке товара, переходит на страницу деталей этого товара', async function() {
        await this.browser.url(CATALOG_PAGE);

        const product = await this.browser.$(productItemSelector);
        await product.waitForExist({ timeout: 5000 });
        const titleProduct = await product.$(cardTitleSelector).getText();

        await product.$(cardLinkSelector).click();
        const productDetails = await this.browser.$(productDetailsNameSelector);
        await productDetails.waitForExist({ timeout: 5000 });
        const titleFromProductDetails = await productDetails.getText();

        assert.equal(titleProduct, titleFromProductDetails);
    });

    it('если товар не добавлен в корзину, то на странице товара, сообщение об этом, не отобразится', async function() {
        await this.browser.url(CATALOG_PAGE);

        const product = await this.browser.$(productItemSelector);
        await product.waitForExist({ timeout: 5000 });
        await product.$(cardLinkSelector).click();

        await (await this.browser.$(productDetailsSelector)).waitForExist({ timeout: 5000 });
        const successItemIsExisting = await this.browser.$(cartBadgeSelector).isExisting();

        assert.isFalse(successItemIsExisting);
    });

    it('если добавить товар в корзину, то на странице товара отобразится сообщение об этом', async function() {
        await this.browser.url(CATALOG_PAGE);

        const product = await this.browser.$(productItemSelector);
        await product.waitForExist({ timeout: 5000 });
        await product.$(cardLinkSelector).click();

        const buttonAddCard = await this.browser.$(buttonAddToCartSelector);
        await buttonAddCard.waitForExist({ timeout: 5000 });
        await buttonAddCard.click();

        const successItem = await this.browser.$(cartBadgeSelector);
        await successItem.waitForExist({ timeout: 5000 });
        const successItemIsExisting = await successItem.isExisting();

        assert.isTrue(successItemIsExisting);
    });

    it('если добавить товар в корзину, в каталоге отобразится сообщение об этом', async function() {
        await this.browser.url(CATALOG_PAGE);

        const product = await this.browser.$(productItemSelector);
        await product.waitForExist({ timeout: 5000 });
        await product.$(cardLinkSelector).click();

        const buttonAddCard = await this.browser.$(buttonAddToCartSelector);
        await buttonAddCard.waitForExist({ timeout: 5000 });
        await buttonAddCard.click();

        await this.browser.url(CATALOG_PAGE);

        const successItem = await product.$(cartBadgeSelector);
        await successItem.waitForExist({ timeout: 5000 });
        const successItemIsExisting = await successItem.isExisting();

        assert.isTrue(successItemIsExisting);
    });

    it('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" увеличит его количество', async function() {
        await this.browser.url(CATALOG_PAGE);

        const product = await this.browser.$(productItemSelector);
        await product.waitForExist({ timeout: 5000 });
        const titleProduct = await product.$(productItemName).getText();
        await product.$(cardLinkSelector).click();

        const buttonAddCard = await this.browser.$(buttonAddToCartSelector);
        await buttonAddCard.waitForExist({ timeout: 5000 });
        await buttonAddCard.click();
        await buttonAddCard.click();

        await this.browser.url(CART_PAGE);

        const table = await this.browser.$(cartTableSelector);
        await table.waitForExist({ timeout: 5000 });
        const titleProductFromCart = await table.$(cartNameSelector).getText();
        const countProductFromCart = await table.$(cartCountSelector).getText();

        assert.equal(titleProduct, titleProductFromCart);
        assert.equal(2, countProductFromCart);
    });

    it('если добавить товар в корзину и перезагрузить страницу, то содержимое корзины не очиститься', async function() {
        await this.browser.url(CATALOG_PAGE);

        const product = await this.browser.$(productItemSelector);
        await product.waitForExist({ timeout: 5000 });
        await product.$(cardLinkSelector).click();

        const buttonAddCard = await this.browser.$(buttonAddToCartSelector);
        await buttonAddCard.waitForExist({ timeout: 5000 });
        await buttonAddCard.click();

        await this.browser.refresh();

        const successItem = await this.browser.$(cartBadgeSelector);
        await successItem.waitForExist({ timeout: 5000 });
        const successItemIsExisting = await successItem.isExisting();

        assert.isTrue(successItemIsExisting);
    });
});
