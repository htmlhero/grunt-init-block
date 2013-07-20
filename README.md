# grunt-init-block

> Generates css file structure according to classes used in HTML. Relies on BEM naming for classes.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-init-block --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-init-block');
```

## The "initBlock" task

### Overview
In your project's Gruntfile, add a section named `initBlock` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	initBlock: {
		options: {
			// Task-specific options go here.
		},
		your_target: {
			// Target-specific file lists and/or options go here.
		}
	}
})
```

### Options

#### options.attr
Type: `String`
Default value: `'init-in'`

Attribute that contains the name of the target file.
Example: `<div class="block" init-in="blocks.css">`

#### options.element
Type: `String`
Default value: `'__'`

Element class name separator in your HTML.
Example: `<div class="block__element">`

#### options.modifier
Type: `String`
Default value: `'_'`

Modifier class name separator in your HTML.
Example: `<div class="block block_modifier">`

#### options.shortModifier
Type: `Boolean`
Default value: `true`

Use a short modifier.
Example: `<div class="block _modifier">`

#### options.preprocessor
Type: `Boolean`
Default value: `false`

Use stylus style for output without braces.

#### options.indentChar
Type: `String`
Default value: `'\t'`

Output line indent style. Use spaces or tabs.

#### options.indentSize
Type: `Number`
Default value: `1`

Output line indent style. How much should be char repeated.

### Usage Example

Describe the task in your Gruntfile.js:

```js
grunt.initConfig({
	initBlock: {
		options: {},
		all: {
			src: ['test/*.html'],
            dest: 'test/'
		}
	}
})
```

write html:

```html
<div class="post _modifier" init-in="blocks.css">
	<h2 class="post__title"></h2>
	<div class="post__content"></div>
	<div class="post__comments"></div>
</div>
```

then run `grunt initBlock` and you will get in blocks.css:

```css
.post {

}
	.post__title {

	}
	.post__content {

	}
	.post__comments {

	}
.post._modifier {

}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).