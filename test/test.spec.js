/* eslint-env mocha */
const assert = require('assert');
const chalk = require('chalk');

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

// describe('Function: render', function() {
//   it('')
// });

describe('Full Works', function() {
  /**
0=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-0
|/          a suit of oiled leather armour of energy          \|
||                         Player Name                        ||
||                                                            ||
|| Slot:        chest ~\                /~ Armor Class:    59 ||
|| Material:     skin ||                || Type:  lightarmour ||
|| Quality:    unique ||                ||                    ||
|| Weight:        3kg ||                || Required Lvl:   35 ||
|\                    `|                |`                    /|
|*                                                            *|
|/   +25% chance to block      ==   +35% chance to dodge      \|
||   +8 mana regeneration      ||   +2 maximum health         ||
||                             ||   +1 health regeneration    ||
|\                             ||                             /|
0=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-0
   */
  it('works', function() {
    const tpl = {
      config: {
        name: { width: 56, justify: 'center' },
        craftedBy: { width: 30, justify: 'center' },
        prop1: { width: 18, justify: 'between' },
        prop2: { width: 18, justify: 'between' },
        prop3: { width: 18, justify: 'between' },
        prop4: { width: 18, justify: 'between' },
        prop5: { width: 18, justify: 'between' },
        prop6: { width: 18, justify: 'between' },
        prop7: { width: 18 },
        prop8: { width: 18, justify: 'between' },
    
        stat1: { width: 23 },
        stat2: { width: 23 },
        stat3: { width: 23 },
        stat4: { width: 23 },
        stat5: { width: 23 },
        stat6: { width: 23 },
      },
      template: chalk`
{magentaBright 0}{magenta ${'=-'.repeat(31)}}{magentaBright 0}
{magenta |/}  ${'{{name}}'}  {magenta \\|}
{magenta ||}${' '.repeat(15)}${'{{craftedBy}}'}${' '.repeat(15)}{magenta ||}
{magenta ||}${' '.repeat(60)}{magenta ||}
{magenta ||} ${'{{prop1}}'} {red ~\\}${' '.repeat(16)}{red /~} ${'{{prop5}}'} {magenta ||}
{magenta ||} ${'{{prop2}}'} {red ||}${' '.repeat(16)}{red ||} ${'{{prop6}}'} {magenta ||}
{magenta ||} ${'{{prop3}}'} {red ||}${' '.repeat(16)}{red ||} ${'{{prop7}}'} {magenta ||}
{magenta ||} ${'{{prop4}}'} {red ||}${' '.repeat(16)}{red ||} ${'{{prop8}}'} {magenta ||}
{magenta |\\}${' '.repeat(20)}{red \`|}${' '.repeat(16)}{red |\`}${' '.repeat(20)}{magenta /|}
{magenta |}{magentaBright *}${' '.repeat(60)}{magentaBright *}{magenta |}
{magenta |/}   ${'{{stat1}}'}   {red ==}   ${'{{stat2}}'}   {magenta \\|}
{magenta ||}   ${'{{stat3}}'}   {red ||}   ${'{{stat4}}'}   {magenta ||}
{magenta ||}   ${'{{stat5}}'}   {red ||}   ${'{{stat6}}'}   {magenta ||}
{magenta |\\}${' '.repeat(29)}{red ||}${' '.repeat(29)}{magenta /|}
{magentaBright 0}{magenta ${'=-'.repeat(31)}}{magentaBright 0}
`
    };

    assert.equal(
      terminalui.render(
        tpl,
        {
          name: `a suit of ${chalk.gray('oiled leather')} armour of ${chalk.cyan('energy')}`,
          craftedBy: 'Player Name',
          prop1: [chalk.cyan('Slot:'), chalk.gray('chest')],
          prop2: [chalk.cyan('Material:'), chalk.gray('skin')],
          prop3: [chalk.cyan('Quality:'), chalk.gray('unique')],
          prop4: [chalk.cyan('Weight:'), chalk.gray('3kg')],
          prop5: [chalk.cyan('Armor Class:'), chalk.gray('59')],
          prop6: [chalk.cyan('Type:'), chalk.gray('lightarmour')],
          prop7: '',
          prop8: [chalk.cyan('Required Lvl:'), chalk.gray('35')],

          stat1: chalk.green('+25% chance to block'),
          stat2: chalk.green('+35% chance to dodge'),
          stat3: chalk.green('+8 mana regeneration'),
          stat4: chalk.green('+2 maximum health'),
          stat5: '',
          stat6: chalk.green('+1 health regeneration')
        }
      ),
      '\n\u001b[95m0\u001b[39m\u001b[35m=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\u001b[39m\u001b[95m0\u001b[39m\n\u001b[35m|/\u001b[39m          a suit of \u001b[90moiled leather\u001b[39m armour of \u001b[36menergy\u001b[39m          \u001b[35m\\|\u001b[39m\n\u001b[35m||\u001b[39m                         Player Name                        \u001b[35m||\u001b[39m\n\u001b[35m||\u001b[39m                                                            \u001b[35m||\u001b[39m\n\u001b[35m||\u001b[39m \u001b[36mSlot:\u001b[39m        \u001b[90mchest\u001b[39m \u001b[31m~\\\u001b[39m                \u001b[31m/~\u001b[39m \u001b[36mArmor Class:\u001b[39m    \u001b[90m59\u001b[39m \u001b[35m||\u001b[39m\n\u001b[35m||\u001b[39m \u001b[36mMaterial:\u001b[39m     \u001b[90mskin\u001b[39m \u001b[31m||\u001b[39m                \u001b[31m||\u001b[39m \u001b[36mType:\u001b[39m  \u001b[90mlightarmour\u001b[39m \u001b[35m||\u001b[39m\n\u001b[35m||\u001b[39m \u001b[36mQuality:\u001b[39m    \u001b[90munique\u001b[39m \u001b[31m||\u001b[39m                \u001b[31m||\u001b[39m                    \u001b[35m||\u001b[39m\n\u001b[35m||\u001b[39m \u001b[36mWeight:\u001b[39m        \u001b[90m3kg\u001b[39m \u001b[31m||\u001b[39m                \u001b[31m||\u001b[39m \u001b[36mRequired Lvl:\u001b[39m   \u001b[90m35\u001b[39m \u001b[35m||\u001b[39m\n\u001b[35m|\\\u001b[39m                    \u001b[31m`|\u001b[39m                \u001b[31m|`\u001b[39m                    \u001b[35m/|\u001b[39m\n\u001b[35m|\u001b[39m\u001b[95m*\u001b[39m                                                            \u001b[95m*\u001b[39m\u001b[35m|\u001b[39m\n\u001b[35m|/\u001b[39m   \u001b[32m+25% chance to block\u001b[39m      \u001b[31m==\u001b[39m   \u001b[32m+35% chance to dodge\u001b[39m      \u001b[35m\\|\u001b[39m\n\u001b[35m||\u001b[39m   \u001b[32m+8 mana regeneration\u001b[39m      \u001b[31m||\u001b[39m   \u001b[32m+2 maximum health\u001b[39m         \u001b[35m||\u001b[39m\n\u001b[35m||\u001b[39m                             \u001b[31m||\u001b[39m   \u001b[32m+1 health regeneration\u001b[39m    \u001b[35m||\u001b[39m\n\u001b[35m|\\\u001b[39m                             \u001b[31m||\u001b[39m                             \u001b[35m/|\u001b[39m\n\u001b[95m0\u001b[39m\u001b[35m=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\u001b[39m\u001b[95m0\u001b[39m\n'
    );
  });
});