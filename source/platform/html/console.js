
lychee.define('lib.console').tags({
	platform: 'html'
}).supports(function(lychee, global) {

	// TODO: Feature Detection

	return true;

}).exports(function(lychee, global, attachments) {

	const _console  = global.console;
	const _doc      = global.document;
	const _CSS      = attachments["css"];
	const _CACHE    = {};
	const _WRAPPER  = _doc.createElement('aside');
	const _ELEMENTS = {};
	const _TAB_STR  = ' ' + new Array(128).join(' ');


	if (typeof String.prototype.trimRight !== 'function') {

		String.prototype.trimRight = function() {

			const _right_whitespace = /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]*$/;

			return String.prototype.replace.call(this, _right_whitespace, '');

		};

	}



	/*
	 * HELPERS
	 */

	const _initialize = function() {

		let check = _doc.querySelector('aside#console');
		if (check !== null) {
			return;
		}

		let wrapper = _WRAPPER;
		let style   = _doc.createElement('style');


		wrapper.id = 'console';
		wrapper.addEventListener('click', function(e) {

			if (e.target === wrapper) {
				wrapper.className = wrapper.className === '' ? 'active' : '';
			}

		}, true);


		style.innerHTML = (_CSS.buffer).toString().trim();


		let body = _doc.querySelector('body');
		let head = _doc.querySelector('head');

		body.appendChild(wrapper);
		head.appendChild(style);


		setInterval(_update, 250);

	};

	const _update = function() {

		for (let id in _CACHE) {

			let cache   = _CACHE[id];
			let element = _ELEMENTS[id] || null;

			if (element === null) {
				element = _ELEMENTS[id] = _doc.createElement('ul');
				_WRAPPER.appendChild(element);
			}


			let lines = [].slice.call(element.querySelectorAll('li'));
			if (lines.length !== cache.length) {

				if (cache.length > lines.length) {

					let start = lines.length;
					let end   = cache.length;

					for (let i = start; i < end; i++) {

						let line = _doc.createElement('li');
						let data = cache[i];

						line.innerHTML = _render(data.args);
						line.className = data.type;

						element.appendChild(line);

					}

				} else if (cache.length < lines.length) {
					// TODO: clear was called. Cleanup
				}

			}

		}

	};

	const _render = function(args) {

		let html = [];

		for (let a = 0, al = args.length; a < al; a++) {

			let data = args[a];
			if (typeof data === 'boolean') {
				html.push('<i class="boolean">true</i>');
			} else if (typeof data === 'number') {
				html.push('<i class="number">' + data + '</i>');
			} else if (typeof data === 'string') {
				html.push('<i class="string">"' + _render_string(data) + '"</i>');
			} else if (typeof data === 'null' || data === null) {
				html.push('<i class="null">null</i>');
			} else if (typeof data === 'undefined' || data === undefined) {
				html.push('<i class="undefined">undefined</i>');
			} else if (data instanceof Error) {
				html.push('<pre class="error">' + _render_error(data) + '</pre>');
			} else if (typeof data === 'object') {

				if (data instanceof Array) {
					html.push('<pre class="array">' + _render_array(data) + '</pre>');
				} else if (data instanceof Object) {
					html.push('<pre class="object">' + _render_object(data) + '</pre>');
				}

			} else if (typeof data === 'function') {

				html.push('<pre class="function">' + _render_function(data) + '</pre>');

			}

		}


		return html.join('<br>');

	};

	const _render_array = function(array) {

		let tab  = typeof t === 'number' ? t : 0;
		let html = [];

		html.push(_TAB_STR.substr(0, tab) + '[');

		tab += 4;

		for (let a = 0, al = array.length; a < al; a++) {

			let data = array[a];
			let str  = '';

			if (typeof data === 'boolean') {
				str += '<i class="boolean">true</i>';
			} else if (typeof data === 'number') {
				str += '<i class="number">' + data + '</i>';
			} else if (typeof data === 'string') {
				str += '<i class="string">"' + data + '"</i>';
			} else if (typeof data === 'null' || data === null) {
				str += '<i class="null">null</i>';
			} else if (typeof data === 'undefined' || data === undefined) {
				str += '<i class="undefined">undefined</i>';
			} else if (typeof data === 'object') {

				if (data instanceof Array) {
					str += _render_array(data,  tab).trim();
				} else if (data instanceof Object) {
					str += _render_object(data, tab).trim();
				}

			} else if (typeof data === 'function') {

				let tmp = (data).toString();
				let i1  = tmp.indexOf('(');
				let i2  = tmp.indexOf(')');
				if (i1 !== -1 && i2 !== -1) {
					str += '<i class="function">function</i>(<i class="arguments">' + tmp.substr(i1 + 1, i2 - i1 - 1) + '</i>)';
				} else {
					str += '<i class="function">function</i>()';
				}

			}

			html.push(_TAB_STR.substr(0, tab) + str + ',');

		}

		let last = html[html.length - 1];
		if (last.length > 0) {
			html[html.length - 1] = last.substr(0, last.length - 1);
		}

		tab -= 4;

		html.push(_TAB_STR.substr(0, tab) + ']');

		return html.join('\n');

	};

	const _render_error = function(err) {

		let html = [];

		if (typeof err.stack === 'string') {

			let data = err.stack.split('\n');
			let type = data[0].split(':')[0];
			let msg  = data[0].split(':').slice(1).join(':');

			html.push('<i class="error">' + type + '</i>: <i class="string">' + msg + '</i>');


			let stack = data.slice(1);
			if (stack.length > 0) {

				for (let s = 0, sl = stack.length; s < sl; s++) {

					let tmp = stack[s].trim().split(' ');
					if (tmp[0] === 'at') {

						let href = tmp[1].split(':');
						let name = tmp[1].split('/').pop().split(':');
						let line = null;

						if (/[0-9]+/g.test(href[href.length - 1])) href.pop();
						if (/[0-9]+/g.test(href[href.length - 1])) href.pop();
						if (/[0-9]+/g.test(name[name.length - 1])) line = name.pop();
						if (/[0-9]+/g.test(name[name.length - 1])) line = name.pop();


						if (line !== null) {
							name = name.join(':') + '#L' + line;
						} else {
							name = name.join(':');
						}

						if (tmp[1].indexOf('://') !== -1) {
							html.push('        at <a target="_blank" href="' + href.join(':') + '">' + name + '</a>');
						} else {
							html.push('        at ' + tmp[1]);
						}

					} else {
						html.push('        ' + tmp.join(' '));
					}

				}

			}

		} else {

			// TODO: Simple print Error

		}


		return html.join('\n');

	};

	const _render_function = function(data) {

		let tmp  = (data).toString();
		let i1   = tmp.indexOf('(');
		let i2   = tmp.indexOf(')');
		let diff = 0;
		let body = tmp.substr(tmp.indexOf('\n') + 1).split('\n');

		for (let b = body.length - 1; b >= 0; b--) {

			let check = body[b];
			if (check.trim().substr(0, 6) === 'return') {
				diff = check.substr(0, check.indexOf('return')).length;
			}

		}

		body = _TAB_STR.substr(0, diff) + body.map(function(line) {

			if (line.trim() === '') {
				return '';
			} else {
				return _TAB_STR.substr(0, diff) + line.substr(diff);
			}

		}).join('\n').trim();

		if (i1 !== -1 && i2 !== -1) {
			return '<i class="function">function</i>(<i class="arguments">' + tmp.substr(i1 + 1, i2 - i1 - 1) + '</i>) {<br>' + body + '<br>}';
		} else {
			return '<i class="function">function</i>() {}';
		}

	};

	const _render_object = function(object, t) {

		let tab  = typeof t === 'number' ? t : 0;
		let html = [];

		html.push(_TAB_STR.substr(0, tab) + '{');

		tab += 4;

		for (let prop in object) {

			let data = object[prop];
			let str  = '';

			if (typeof data === 'boolean') {
				str += '<i class="boolean">true</i>';
			} else if (typeof data === 'number') {
				str += '<i class="number">' + data + '</i>';
			} else if (typeof data === 'string') {
				str += '<i class="string">"' + data + '"</i>';
			} else if (typeof data === 'null' || data === null) {
				str += '<i class="null">null</i>';
			} else if (typeof data === 'undefined' || data === undefined) {
				str += '<i class="undefined">undefined</i>';
			} else if (typeof data === 'object') {

				if (data instanceof Array) {
					str += _render_array(data,  tab).trim();
				} else if (data instanceof Object) {
					str += _render_object(data, tab).trim();
				}

			} else if (typeof data === 'function') {

				let tmp = (data).toString();
				let i1  = tmp.indexOf('(');
				let i2  = tmp.indexOf(')');
				if (i1 !== -1 && i2 !== -1) {
					str += '<i class="function">function</i>(<i class="arguments">' + tmp.substr(i1 + 1, i2 - i1 - 1) + '</i>)';
				} else {
					str += '<i class="function">function</i>()';
				}

			}

			html.push(_TAB_STR.substr(0, tab) + '<i class="property">' + prop + '</i>: ' + str + ',');

		}

		let last = html[html.length - 1];
		if (last.length > 0) {
			html[html.length - 1] = last.substr(0, last.length - 1);
		}

		tab -= 4;

		html.push(_TAB_STR.substr(0, tab) + '}');

		return html.join('\n');

	};

	const _render_string = function(str) {

		str = str.split('\t').join('\\t');
		str = str.split('\n').join('<br>');

		return str;

	};

	const _trace_stack = function(err) {

		let prepare = Error.prepareStackTrace;

		if (typeof prepare === 'function') {
			Error.prepareStackTrace = function(err, stack) { return stack; };
			Error.captureStackTrace(new Error());
			Error.prepareStackTrace = prepare;
		}

	};



	/*
	 * POLYFILL
	 */

	(function(global) {

		let body = _doc.querySelector('body');
		if (body !== null) {

			_initialize();

		} else {

			global.addEventListener('load', _initialize, true);

		}


		global.addEventListener('keypress', function(event) {

			if (event.keyCode === 67 && event.shiftKey === true) {
				_WRAPPER.className = _WRAPPER.className === '' ? 'active' : '';
			}

		}, true);

	})(global);



	/*
	 * IMPLEMENTATION
	 */

	let Console = function(id) {

        let cache = _CACHE[id] || null;
		if (cache === null) {
			cache = _CACHE[id] = [];
		}


		this.__id    = id;
		this.__cache = cache;

	};


	Console.prototype = {

		clear: function() {

			this.__cache = _CACHE[this.__id] = [];

		},

		info: function() {

			let al   = arguments.length;
			let args = [];

			for (let a = 0; a < al; a++) {
				args.push(arguments[a]);
			}

			this.__cache.push({
				type: 'info',
				time: Date.now(),
				args: args
			});

		},

		error: function(err) {

			let stack = null;
			if (err instanceof Error) {
				stack = _trace_stack(err);
			}

			let al   = arguments.length;
			let args = [];

			for (let a = 0; a < al; a++) {
				args.push(arguments[a]);
			}

			this.__cache.push({
				type:  'error',
				time:  Date.now(),
				args:  args,
				stack: stack
			});

		},

		log: function() {

			let al   = arguments.length;
			let args = [];

			for (let a = 0; a < al; a++) {
				args.push(arguments[a]);
			}

			this.__cache.push({
				type: 'log',
				time: Date.now(),
				args: args
			});

		},

		warn: function() {

			let al   = arguments.length;
			let args = [];

			for (let a = 0; a < al; a++) {
				args.push(arguments[a]);
			}

			this.__cache.push({
				type: 'warn',
				time: Date.now(),
				args: args
			});

		}

	};



	// global.console = new Console(Math.random());


	return Console;

});
