const { assert } = require('chai');

const BASE = '/hw/store/';

const gatUrl = (url) => BASE + (url ?? '');

describe('содержание страниц', async function() {
    it('открывается страница "главная", со статическим содержанием', async function() {
        await this.browser.url(gatUrl());
        await this.browser.assertView('screenMain', 'body', {
            allowViewportOverflow: true
        });
    });

    it('открывается страница "каталог"', async function() {
        await this.browser.url(gatUrl('catalog'));

        const isDisplayed = await this.browser.$('.Catalog').isDisplayedInViewport();
        assert.isTrue(isDisplayed);
    });

    it('открывается страница "условия доставки", со статическим содержанием', async function() {
        await this.browser.url(gatUrl('delivery'));
        await this.browser.assertView('screenDelivery', 'body');
    });

    it('открывается страница "контакты", со статическим содержанием', async function() {
        await this.browser.url(gatUrl('contacts'));
        await this.browser.assertView('screenContacts', 'body');
    });
});
