// Костыль. Потому что в browser.url('/') не соединяется с baseUrl из .hermione.conf.js

const BASE = '/hw/store/';

module.exports.getUrl = (url) => BASE + (url ?? '');
