/* eslint-env mocha */
const assert = require('assert');

const terminalui = require('../index');

describe('Function: textLength', function() {
  it('counts plain strings', function() {
    assert.equal(
      terminalui.textLength('Test'),
      4
    );
  });
  it('counts strings with ANSI excape codes', function() {
    assert.equal(
      terminalui.textLength('\u001b[36mTest'),
      4
    );
  });
  it('counts numbers as strings', function() {
    assert.equal(
      terminalui.textLength(12345),
      5
    );
  });
  it('handles empty args', function() {
    assert.equal(
      terminalui.textLength(),
      0
    );
    assert.equal(
      terminalui.textLength(null),
      0
    );
  });
  it('counts arrays of strings', function() {
    assert.equal(
      terminalui.textLength(['Foo', 'Bar']),
      6
    );
  });
  it('counts arrays recursively', function() {
    // Not sure if there is a use case for this, but it's a cool side-effect.
    assert.equal(
      terminalui.textLength(['Foo', ['Bar', 'Baz']]),
      9
    );
  });
});

describe('Function: paddText', function() {
  it('Adds padding to the end of the string to fill the width', function() {
    assert.equal(
      terminalui.paddText('Test', 10),
      'Test      '
    );
  });
  it('pads with the provided char', function() {
    assert.equal(
      terminalui.paddText('Test', 10, 'start', '.'),
      'Test......'
    );
    assert.equal(
      terminalui.paddText([ 'Test', '1' ], 10, 'between', '.'),
      'Test.....1'
    );
    assert.equal(
      terminalui.paddText('Test', 10, 'center', '.'),
      '...Test...'
    );
  });
  it('justifies items of text array at either end of width', function() {
    assert.equal(
      terminalui.paddText([ 'Test', '1' ], 10, 'between'),
      'Test     1'
    );
  });
  it('justify between works with strings too long', function() {
    // Don't want things to break when the string breaks the width
    assert.equal(
      terminalui.paddText([ 'This is a long string', '1' ], 10, 'between'),
      'This is a long string1'
    );
  });
  it('justify center pads either size to fit', function() {
    assert.equal(
      terminalui.paddText('Test', 10, 'center'),
      '   Test   '
    );
    assert.equal(
      terminalui.paddText('Test1', 10, 'center'),
      '   Test1  ',
      'Odd lengths eat from the right side'
    );
  });
});
