const { assert } = require('chai');

const BASE = '/hw/store/';

const getUrl = (url) => BASE + (url ?? '');

describe('страница "Каталог"', async function() {
    it('с сервера приходит минимум один товар', async function() {
        await this.browser.url(getUrl('catalog'));

        await this.browser.$('.ProductItem').waitForExist({ timeout: 5000 });
        const products = await this.browser.$$('.ProductItem');

        assert(products.length >= 1);
    });

    it('по клику на ссылку в карточке товара, переходит на страницу деталей этого товара', async function() {
        await this.browser.url(getUrl('catalog'));

        const product = await this.browser.$('.ProductItem');
        await product.waitForExist({ timeout: 5000 });
        const titleProduct = await product.$('.card-title').getText();

        await product.$('.card-link').click();
        const productDetails = await this.browser.$('.ProductDetails-Name');
        await productDetails.waitForExist({ timeout: 5000 });
        const titleFromProductDetails = await productDetails.getText();

        assert.equal(titleProduct, titleFromProductDetails);
    });

    it('если товар не добавлен в корзину, то на странице товара, сообщение об этом, не отобразится', async function() {
        await this.browser.url(getUrl('catalog'));

        const product = await this.browser.$('.ProductItem');
        await product.waitForExist({ timeout: 5000 });
        await product.$('.card-link').click();

        await (await this.browser.$('.ProductDetails')).waitForExist({ timeout: 5000 });
        const successItemIsExisting = await this.browser.$('.CartBadge.text-success').isExisting();

        assert.isFalse(successItemIsExisting);
    });

    it('если добавить товар в корзину, то на странице товара отобразится сообщение об этом', async function() {
        await this.browser.url(getUrl('catalog'));

        const product = await this.browser.$('.ProductItem');
        await product.waitForExist({ timeout: 5000 });
        await product.$('.card-link').click();

        const buttonAddCard = await this.browser.$('.ProductDetails-AddToCart');
        await buttonAddCard.waitForExist({ timeout: 5000 });
        await buttonAddCard.click();

        const successItem = await this.browser.$('.CartBadge.text-success');
        await successItem.waitForExist({ timeout: 5000 });
        const successItemIsExisting = await successItem.isExisting();

        assert.isTrue(successItemIsExisting);
    });

    it('если товар добавить в корзину, в каталоге отобразится сообщение об этом', async function() {
        await this.browser.url(getUrl('catalog'));

        const product = await this.browser.$('.ProductItem');
        await product.waitForExist({ timeout: 5000 });
        await product.$('.card-link').click();

        const buttonAddCard = await this.browser.$('.ProductDetails-AddToCart');
        await buttonAddCard.waitForExist({ timeout: 5000 });
        await buttonAddCard.click();

        await this.browser.url(getUrl('catalog'));

        const successItem = await product.$('.CartBadge.text-success');
        await successItem.waitForExist({ timeout: 5000 });
        const successItemIsExisting = await successItem.isExisting();

        assert.isTrue(successItemIsExisting);
    });

    it('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" увеличит его количество', async function() {
        await this.browser.url(getUrl('catalog'));

        const product = await this.browser.$('.ProductItem');
        await product.waitForExist({ timeout: 5000 });
        const titleProduct = await product.$('.ProductItem-Name').getText();
        await product.$('.card-link').click();

        const buttonAddCard = await this.browser.$('.ProductDetails-AddToCart');
        await buttonAddCard.waitForExist({ timeout: 5000 });
        await buttonAddCard.click();
        await buttonAddCard.click();

        await this.browser.url(getUrl('cart'));

        const table = await this.browser.$('.Cart-Table');
        await table.waitForExist({ timeout: 5000 });
        const titleProductFromCart = await table.$('.Cart-Name').getText();
        const countProductFromCart = await table.$('.Cart-Count').getText();

        assert.equal(titleProduct, titleProductFromCart);
        assert.equal(2, countProductFromCart);
    });

    it('если добавить товар в корзину и перезагрузить страницу, то содержимое корзины не очиститься', async function() {
        await this.browser.url(getUrl('catalog'));

        const product = await this.browser.$('.ProductItem');
        await product.waitForExist({ timeout: 5000 });
        await product.$('.card-link').click();

        const buttonAddCard = await this.browser.$('.ProductDetails-AddToCart');
        await buttonAddCard.waitForExist({ timeout: 5000 });
        await buttonAddCard.click();

        await this.browser.refresh();

        const successItem = await this.browser.$('.CartBadge.text-success');
        await successItem.waitForExist({ timeout: 5000 });
        const successItemIsExisting = await successItem.isExisting();

        assert.isTrue(successItemIsExisting);
    });
});
