const Handlebars = require('handlebars');
const stripAnsi = require('strip-ansi');

/**
 * Returns the length of text to fill placeholder. This strips out any ANSI
 * escape codes.
 * @param {String|Array} textArg 
 * @returns {number} total length of text passed
 */
function textLength(textArg) {
  if(!textArg) {
    return 0;
  }

  if(typeof textArg === 'object') {
    let length = 0;
    textArg.forEach(arg => {
      // Call self for each item.
      length += textLength(arg);
    });
    return length;
  }

  // Using a template literal guarantees this will be a string.
  return `${stripAnsi(textArg)}`.length;
}

function paddText(text, width, justify = 'start', padFill = ' ') {
  if(justify === 'between') {
    let padding = width - textLength(text);
    if(padding < 0) {
      padding = 0;
    }
    return text[0] + padFill.repeat(padding) + text[1];
  }

  if(justify === 'center') {
    let padding = Math.ceil((width - textLength(text)) / 2);
    
    let rightPadding = padding;
    if(textLength(text) % 2) {
      rightPadding = rightPadding - 1;
    }
    return `${padFill.repeat(padding)}${text}${padFill.repeat(rightPadding)}`;
  }

  let padding = width - textLength(text);
  return text + padFill.repeat(padding);
  
}

function render(tpl, data) {
  const compile = Handlebars.compile(tpl.template);

  const processedData = {};
  Object.keys(tpl.config).forEach(key => {
    const config = tpl.config[key];
    const providedData = data[key] || '';

    processedData[key] = paddText(providedData, config.width, config.justify);
  });

  return compile(processedData);
}

module.exports = { render, paddText, textLength };