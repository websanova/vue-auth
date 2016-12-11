var utils = require('../src/lib/utils.js'),
    assert = require('assert');

module.exports = (function () {
    
    var i = 0;

    function strictEqual(a, b) {
        console.log('Test ' + (++i) + ': ' + a + ' === ' + b);
        assert.strictEqual.apply(null, arguments);
    }

    try {
        
        // compare
        strictEqual(utils.compare('admin', 'admin'), true);
        strictEqual(utils.compare('admin', ['admin']), true);
        strictEqual(utils.compare(['admin'], ['admin']), true);
        strictEqual(utils.compare('admin', ['admin', 'manager']), true);
        strictEqual(utils.compare(['admin'], ['admin', 'manager']), true);
        strictEqual(utils.compare('0', '1'), false);
        strictEqual(utils.compare('0', ['0', '1']), true);
        strictEqual(utils.compare(['0'], ['0', '1']), true);
        strictEqual(utils.compare(['0', '1'], ['0', '1']), true);
        strictEqual(utils.compare(0, ['0', '1']), false);
        strictEqual(utils.compare(0, [0, '1']), true);
        strictEqual(utils.compare(1, [0, 1]), true);
        strictEqual(utils.compare([1], [0, 1]), true);
        strictEqual(utils.compare([0, 1], [0, 1]), true);
        strictEqual(utils.compare({some: 'field'}, [0, 1]), false);
        strictEqual(utils.compare({some: 'field'}, {some: 'object'}), false);
        strictEqual(utils.compare({some: 'field'}, {some: 'field'}), true);
        strictEqual(utils.compare({some: 'field'}, {some: 'field', another: 'one'}), true);
        strictEqual(utils.compare({some: 'field'}, {some: 'object', another: 'one'}), false);
    }
    catch (err) {
        // console.log('Error on line ' + i);
    }

})();