const TwingOutputBuffering = require('../../../../lib/twing/output-buffering').TwingOutputBuffering;

const tap = require('tap');

let reset = () => {
    while (TwingOutputBuffering.obGetLevel()) {
        TwingOutputBuffering.obEndClean();
    }

    TwingOutputBuffering.obStart();
    TwingOutputBuffering.echo('foo');
    TwingOutputBuffering.obStart();
    TwingOutputBuffering.echo('bar');
    TwingOutputBuffering.obStart();
    TwingOutputBuffering.echo('oof');
};

tap.test('TwingOutputBuffering', function (test) {
    test.test('echo', function (test) {
        let data = '';

        let stdoutWrite = process.stdout.write;
        let i = 0;

        process.stdout.write = function (chunk) {
            data += chunk;

            if (i === 1) {
                process.stdout.write = stdoutWrite;
            }

            i++;

            return true;
        };

        TwingOutputBuffering.echo('foo');
        TwingOutputBuffering.echo('bar');

        test.same(data, 'foobar', 'process.stdout should contain "foobar"');
        test.end();
    });

    test.test('obStart', function (test) {
        TwingOutputBuffering.obStart();

        test.equal(TwingOutputBuffering.obGetLevel(), 1, 'obGetLevel() should return 1');

        TwingOutputBuffering.obStart();

        test.equal(TwingOutputBuffering.obGetLevel(), 2, 'obGetLevel() should return 2');
        test.end();
    });

    test.test('obEndFlush', function (test) {
        reset();
        TwingOutputBuffering.obEndFlush();

        test.equal(TwingOutputBuffering.obGetLevel(), 2, 'obGetLevel() should return 2');
        test.same(TwingOutputBuffering.obGetContents(), 'baroof', `obGetContents() should return 'baroof'`);

        test.end();
    });

    test.test('obFlush', function (test) {
        reset();
        TwingOutputBuffering.obFlush();

        test.same(TwingOutputBuffering.obGetContents(), '', `obGetContents() should return ''`);
        test.end();
    });

    test.test('obGetFlush', function (test) {
        reset();

        test.same(TwingOutputBuffering.obGetFlush(), 'oof', `obGetFlush() should return 'oof'`);
        test.same(TwingOutputBuffering.obGetContents(), 'baroof', `obGetContents() should return 'baroof'`);

        test.end();
    });

    test.test('obClean', function (test) {
        reset();
        TwingOutputBuffering.obClean();

        test.equal(TwingOutputBuffering.obGetLevel(), 3, 'obGetLevel() should return 3');
        test.same(TwingOutputBuffering.obGetContents(), '', `obGetContents() should return ''`);
        test.end();
    });

    test.test('obGetClean', function (test) {
        reset();

        test.same(TwingOutputBuffering.obGetClean(), 'oof', `obGetClean() should return 'oof'`);

        test.end();
    });

    test.test('obEndClean', function (test) {
        reset();

        test.true(TwingOutputBuffering.obEndClean(), `obEndClean() should return trusty`);
        test.equal(TwingOutputBuffering.obGetLevel(), 2, 'obGetLevel() should return 2');
        test.same(TwingOutputBuffering.obGetContents(), 'bar', `obGetContents() should return 'bar'`);

        test.end();
    });

    test.test('flush', function (test) {
        reset();
        TwingOutputBuffering.flush();

        test.same(TwingOutputBuffering.obGetContents(), '', `obGetContents() should return ''`);
        test.end();
    });

    test.end();
});
