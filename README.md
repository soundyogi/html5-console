
# HTML5 console Polyfill

This is a minimalistic console that allows using the
[Console API](https://developer.mozilla.org/en-US/docs/Web/API/console)
inside Browsers or Runtimes that don't ship with a 
proper console, especially for mobile devices.

brought to you as libre software with joy and pride by [@cookiengineer](http://cookie.engineer).

Support our libre Bot Cloud via BTC [1CamMuvrFU1QAMebPoDsL3JrioVDoxezY2](bitcoin:1CamMuvrFU1QAMebPoDsL3JrioVDoxezY2?amount=0.5&label=lychee.js%20Support).



## Overview

Don't want to deal with Safari or WebKit Mobile and
its debugging pipeline of > 4GB+?

Don't want to deal with `debugger.html` and the whole
NPM build toolchain?

Worry no more, the HTML5 console is a simple JS file
that you can plug-in whereever and whenever you want.
Just insert it at the top of `<head>` so it can
override the `console` API for other scripts:

```html
<!DOCTYPE html>
<html>
<head>
	<!-- OLD BROWSER? Use console.es5.js instead -->
	<script src="./path/to/build/html/console.es6.js"></script>

	<!-- CUSTOMIZATION -->
	<style>aside#console.active { width: 100% !important; }</style>
</head>
<body>
	<script>
	console.log('Hello world');
	console.warn(function(a,b,c) {
		return 'this is fun!';
	});
	</script>
</body>
```

This library is a project made with [lychee.js](https://lychee.js.org).

It is automatically built and deployed to GitHub using the following
`lycheejs-fertilizer` integration scripts:

- `bin/build.sh` builds the `console.min.js` and inlines the necessary CSS
- `bin/publish.sh` pushes the `master` branch to GitHub


## Multi-Context Debugging

Having issues finding the right log in a flood of logs again? Why not
create a new console instance that you can use for each context?

```javascript
let instance = new Console('awesome');

instance.log('All your logs are belong to us.');
```


## User Interface

The UI integration is super-performant and as easily
implemented as possible.

You can open the Console in two ways:

- Click or Touch on the fixed Icon on the Top Right (e.g. on mobile).
- Use the keyboard and press `[Shift] + [C]` to toggle the Console.

![screenshot.png](screenshot.png)


## Bookmarklet Awesomeness

Instructions TBD


## Official API

- `console.assert(condition, ...arguments)`
- `console.clear()`
- `console.debug(...arguments)` is a symlink to `console.log(...arguments)`
- `console.group(label)`
- `console.groupEnd()`
- `console.info(...arguments)`
- `console.log(...arguments)`
- `console.table(data [,labels])`
- `console.warn(...arguments)`
- `console.error(...arguments)`
- `console.time(label)`
- `console.timeEnd(label)`

## Unsupported API / Impossible To Implement

These Console API methods were declared to be too
high in complexity to be implemented.

Reason is most likely that the feature needs a
full-blown parser or a low-level VM API that will
bloat the implementation too much to stay performant.

- `console.count()`
- `console.dir()`
- `console.dirxml()`
- `console.groupCollapsed()`
- `console.markTimelime()`
- `console.profile()`
- `console.profileEnd()`
- `console.timelime()`
- `console.timelimeEnd()`
- `console.timeStamp()`
- `console.trace()`


## License

This project is released under [GNU GPL 3](./LICENSE_GPL3.txt) license.

