const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('included.twig', require('./included.twig'));
        templates.set('base.twig', require('./base.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};
