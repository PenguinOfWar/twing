const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeText = require('../../../../../lib/twing/node/text').TwingNodeText;
const TwingNodeSandbox = require('../../../../../lib/twing/node/sandbox').TwingNodeSandbox;
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

tap.test('node/sandboxed', function (test) {
    test.test('constructor', function (test) {
        let body = new TwingNodeText('foo', 1);
        let node = new TwingNodeSandbox(body, 1);

        test.same(node.getNode('body'), body);
        test.same(node.getType(), TwingNodeType.SANDBOX);

        test.end();
    });

    test.test('compile', function (test) {
        let body = new TwingNodeText('foo', 1);
        let node = new TwingNodeSandbox(body, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1
(async () => {
    let sandbox = this.env.getExtension('TwingExtensionSandbox');
    let alreadySandboxed = sandbox.isSandboxed();
    if (!alreadySandboxed) {
        sandbox.enableSandbox();
    }
    Twing.echo("foo");
    if (!alreadySandboxed) {
        sandbox.disableSandbox();
    }
})();
`);

        test.end();
    });

    test.end();
});
