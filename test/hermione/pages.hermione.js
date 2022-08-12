const { assert } = require('chai');
const { getUrl } = require('../utils/getUrl');

const MAIN_PAGE = getUrl();
const CATALOG_PAGE = getUrl('catalog');
const DELIVERY_PAGE = getUrl('delivery');
const CONTACTS_PAGE = getUrl('contacts');


describe('содержание страниц', async function() {
    it('открывается страница "главная", со статическим содержанием', async function() {
        await this.browser.url(MAIN_PAGE);
        await this.browser.assertView('screenMain', 'body', {
            allowViewportOverflow: true
        });
    });

    it('открывается страница "каталог"', async function() {
        await this.browser.url(CATALOG_PAGE);

        const isDisplayed = await this.browser.$('.Catalog').isDisplayedInViewport();
        assert.isTrue(isDisplayed);
    });

    it('открывается страница "условия доставки", со статическим содержанием', async function() {
        await this.browser.url(DELIVERY_PAGE);
        await this.browser.assertView('screenDelivery', 'body');
    });

    it('открывается страница "контакты", со статическим содержанием', async function() {
        await this.browser.url(CONTACTS_PAGE);
        await this.browser.assertView('screenContacts', 'body');
    });
});
