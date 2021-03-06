const TwingTestIntegrationTestCaseBase = require('../test');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"defined" test';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('../index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getConfig() {
        return {
            strict_variables: false
        }
    }
};
