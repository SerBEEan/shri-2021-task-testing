module.exports = {
    gridUrl: 'http://127.0.0.1:4444',
    baseUrl: 'http://localhost:3000/hw/store',

    testsPerSession: 1,

    sets: {
        desktop: {
            files: 'test/hermione/*.hermione.js'
        }
    },

    browsers: {
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome'
            }
        }
    },

    plugins: {
        'html-reporter/hermione': {
            path: 'hermione-html-reporter'
        },
    }
};
