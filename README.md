qlip
====

Copy to clipboard jQuery Plugin
-------------------------------

qlip is a jQuery plugin designed to easily enable "click to copy" functionality in a webpage. qlip takes inspiration from the ZeroClipboard approach but is written in jQuery and is intended to be much simpler and easier to use. The minified script is less than half the size of ZeroClipboard.

### Usage

#### Basic Example
#####The HTML
```html
<a data-qlip-string="welcome to qlip" id="myCopyButton">Copy This</a>
```
#####The JS
```javascript
$("#myCopyButton").qlip();
```

#### Or Pass in the String using JS
#####The HTML
```html
<a id="myCopyButton">Copy This</a>
```
#####The JS
```javascript
$("#myCopyButton").qlip("You have been qlipped!");
```

#### With Options
#####The HTML
```html
<div data-qlip-string="welcome to qlip" id="myCopyButton"><div id="myWrapperDiv">Copy This</div></div>
```
#####The JS
```javascript
$("#myCopyButton").qlip({
	swf: "someotherpath/qlip.swf", 	// default is "qlip.swf"
	container: $("#myWrapperDiv"), 	// defaults to self
	width: 200px, 					// defaults to container width
	height: 200px, 					// defaults to container height
	top: 50px,						// defaults to top of container (0px)
	left: 25px						// defaults to left of container (0px)
});
```
