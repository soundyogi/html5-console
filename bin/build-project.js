#!/usr/local/bin/lycheejs-helper env:node



/*
 * BOOTSTRAP
 */

const _fs      = require('fs');
const _ROOT    = '/opt/lycheejs';
const _PROJECT = '/projects/html5-console';

require(_ROOT + '/libraries/lychee/build/node/core.js')(_ROOT + _PROJECT);



/*
 * IMPLEMENTATION
 */

let style = _fs.readFileSync(lychee.ROOT.project + '/source/platform/html/console.css').toString('utf8');
let main  = _fs.readFileSync(lychee.ROOT.project + '/source/platform/html/console.js').toString('utf8');


let style_compressed = style.split('\n').map(function(line) {

	let tmp = line.trim();
	if (line === '}') {

		return line + '\n';

	} else {

		if (tmp.indexOf(': ') !== -1) {
			tmp = tmp.split(': ').join(':');
		}

		return tmp;

	}

}).join('').trim();


let style_inlined = JSON.stringify(style_compressed.split('\n'), null, '').trim() + '.join(\'\\n\')';
let main_inlined  = main.replace('attachments["css"]', '{buffer:' + style_inlined + '}');

let i1 = main_inlined.indexOf('exports(');
let i2 = main_inlined.lastIndexOf('});');

main_inlined = main_inlined.substr(i1 + 8, i2 - i1 - 6);


main_es6  = 'const Console = (' + main_inlined + '({}, window, {});'
main_es6 += '\n\n';
main_es6 += 'console = new Console(\'default\');';

main_es5 = main_es6;
main_es5 = main_es5.split('const ').join('var ');
main_es5 = main_es5.split('let ').join('var ');


_fs.writeFileSync(lychee.ROOT.project + '/build/html/console.es5.js', main_es5);
_fs.writeFileSync(lychee.ROOT.project + '/build/html/console.es6.js', main_es6);

