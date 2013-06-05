# API reference

LM()
====

Returns a template object.

```js
var $div = $("...");
LM($div);
```

Full example:

```js
var $div = $("#my_template");
var template = LM($div)
 .bind(model)
 .locals({ count: 200 })
 .render();
```

You may also pass a Backbone view to `LM()`.

```js
Backbone.View.extend({
  render: function() {
    this.html(require('templates/book/show'));
    this.template = LM(this)
      .bind(this.model)
      .render();
  };
}
```

`LM(element)` is an alias for `new LM.template(element)`, and hence it
returns a [Template] object. See [Template] documentation for more
details.

### LM.helpers

You may set helpers that will be available on every Livemarkup template by
extending the `LM.helpers` object.

```js
LM.helpers.shortDate = function(date) {
  return moment(date).format('MMMM Do YYYY');
};
```

You can then use them in your views like so:

```js
<div @text='attr("updated_at") -> shortDate(val)'>
```


## Template()

A template object representing a live DOM instance. The `LM(...)` function
returns a template instance. See [LM()] for more info.

### Template#model

The model bound using [Template#bind()].

### Template#view

The associated Backbone view when instanciated via `LM(view)`.

```js
var view = new Backbone.View();
var tpl = LM(view);
// tpl.view === view
```



### Template#bind()

Sets the target model of the template to the given object.

```js
var model = new Backbone.Model();
tpl.bind(model);
```



### Template#on()

Listens to an event. Usually used as `.on('destroy')` to attach teardown
behavior in actions/modifiers.

```js
tpl.on('destroy', function() { ... });
```

### Template#render()

Renders a template.
Updates all directives within a template.

In the first time a template is rendered, models will be bound, and
directives will be removed from the DOM.

```js
tpl.render();
```

### Template#locals()

Registers some variables as locals.

```js
tpl.locals({ view: myView });
```

You can also use it with a key/value pair:

```js
tpl.locals('view', myView);
```



### Template#destroy()

Cleans up and unbinds all events, rendering the template inert.

This undoes everything that the [Action]s and [Modifier]s do.

```js
// ...
tpl.destroy();
tpl.$el.remove();
```



## Directive()

A directive.

Has the following attributes:

 - template     : instance of [Template]
 - $el          : element to be worked on
 - model        : model to be bound to (alias of [Template#model])

Actions are ran in the context of an instance of this. Modifiers have
access to the directive using `this.directive`.

### Directive#template

Reference to parent [Template].

### Directive#model

Reference to model in the template. Equivalent to `template.model`.

### Directive#formatters

List of formatter functions.

### Directive#onrender

Function to be called on rendering. Usually overridden in an action.

### Directive#ondestroy

Function to be called when destroying ([Template#destroy()]). Usually
overridden in an action.

### Directive#stop()

Stops processing down.

This prevents the parser from recursing down to the children. Useful for
actions where the rest of the block doesn't matter, like `@html` or
`@text` (but not `@class` or `@at`).

### Directive#getValue()

Returns the value of a given directive.

Runs all the `formatters` functions (as set by the modifiers) and returns
the final value.

### Directive#render()

Refreshes a directive by running its associated action.

Actions
-------

Actions.

All actions apply to a Directive object.

### Actions.text()

Text changing action.

```js
<div @text='attr("title")'>
```



### Actions.at()

Attribute changing action.

```js
<div @at(type)='attr("type")'>
```



### Actions.class()

Class toggling action.

```js
<div @class(enabled)='attr("enabled")'>
```



### Actions.html()

HTML setting action.

Works exactly like [LM.actions.text], but sets HTML instead.

```js
<div @html='attr("title")'>
<div @html='-> getInstructionHTML()'>
```



### Actions.value()

Makes a two-way value binding. Works for `input`, `textarea`, and `select`.

```js
<input @value='attr("name")'>
```



### Actions.if()

Makes the element present if the value is `true`, and hides it if `false`.

```js
<div @if='attr("enabled")'>...</div>
```



Modifiers
---------

Modifiers.

You can access the modifiers as:

```js
LM.modifiers
```

This hosts a bunch of *modifier* functions. Each modifier function is:

 - ran on the context of an object that has one attribute: `directive`,
 which hosts the directive.

 - always does `return this` at the end so they can be chained.

 - usually uses `.format()` to make a getter.

You can implement your own modifiers like this example here:

```js
LM.modifiers['greet'] = function(name) {
  var dir = this.directive;     // a `Directive` object
  var model = dir.model;
  this.format(function() {      // Make it do the same as `-> "hello world"`
    return "Hello world";
  });
  return this;
}
```



### Modifiers.attr()

Attribute modifier.

This is actually a macro that expands to a `.on()` (to listen for change
events) and a `.format()` (to do `model.get()`).

### Modifiers.on()

Event binding modifier.


[LM()]: #lm
[LM.helpers]: #lm-helpers
[Template()]: #template
[Template#model]: #template-model
[Template#view]: #template-view
[Template#bind()]: #template-bind
[Template#on()]: #template-on
[Template#render()]: #template-render
[Template#locals()]: #template-locals
[Template#destroy()]: #template-destroy
[Directive()]: #directive
[Directive#template]: #directive-template
[Directive#model]: #directive-model
[Directive#formatters]: #directive-formatters
[Directive#onrender]: #directive-onrender
[Directive#ondestroy]: #directive-ondestroy
[Directive#stop()]: #directive-stop
[Directive#getValue()]: #directive-getvalue
[Directive#render()]: #directive-render
[Actions]: #actions
[Actions.text()]: #actions-text
[Actions.at()]: #actions-at
[Actions.class()]: #actions-class
[Actions.html()]: #actions-html
[Actions.value()]: #actions-value
[Actions.if()]: #actions-if
[Modifiers]: #modifiers
[Modifiers.attr()]: #modifiers-attr
[Modifiers.on()]: #modifiers-on
