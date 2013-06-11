Livemarkup
==========

Livemarkup lets you build DOM templates in JavaScript. It lets you create
templates that react to changes without needing to be re-generated by allowing
you to easily make two-way bindings.

Built with Backbone.js in mind; works without it, too; pretty fast and extremely small.

[Download >]( http://raw.github.com/rstacruz/livemarkup/livemarkup.js ) *work in progress -- use at your own risk*

_Livemarkup is still not feature-complete. Try it out now, but don't expect
all features to be implemented.  See the [development notes] to see what works
and what doesn't._

[![Build Status](https://travis-ci.org/rstacruz/livemarkup.png?branch=master)](https://travis-ci.org/rstacruz/livemarkup)

Quick reference
---------------

Livemarkup is not a templating language per se. It takes a DOM tree, parses
directives out of it, and performs the behavior it describes. In essence, it
lets you write your client-side templates using plain HTML. This example uses
[@text](#text) to change the text of an element.

~~~ html
<!-- use arbitrary JS to set text (does not auto-update) -->
<span @text='-> model.getFirstName()'>
<span @text='-> parseInt(Math.random()*6)'>
~~~

#### Alternate syntaxes

Livemarkup allows you to use four different prefixes if you prefer to be 
HTML-valid. The most convenient `@` syntax is preferred.

~~~ html
<span @text='-> attr("first_name")'>
<span lm:text='-> attr("first_name")'>
<span lm-text='-> attr("first_name")'>
<span data-lm-text='-> attr("first_name")'>
~~~

#### Model-to-DOM binding
Livemarkup is built to be reactive -- it also allows you to bind to Backbone
model attributes using [attr()](#attr). The DOM updates in real time (because
it's *live markup!*) as model attributes are changed. You may also use
[on()](#on) to listen to other model events.

~~~ html
<!-- sets text to the `first_name` attribute of a model. -->
<!-- auto-updates when `first_name` is changed. -->
<span @text='attr("first_name")'>

<!-- custom helpers -->
<span @text='attr("lastname") -> val.toUpperCase()'>
<span @text='attr("balance")  -> formatMoney(val)'>

<!-- html() also works -->
<span @html='attr("description")'>
<span @html='attr("description") -> markdown(val)'>

<!-- execute arbitrary JS; refreshes after a `reset` event happens at the model -->
<!-- (`this` refers to the model) -->
<span @text='on("sync") -> "Last updated on " + this.changedAt()'>
~~~

#### Two-way binding
Two-way bindings are also supported. You can propogate changes from user input
back to the model using [@value](#value).

~~~ html
<!-- two-way bindings -->
<input type='text' @value='attr("title")'>
<textarea @value='attr("description")'></textarea>
~~~

#### More features
Use [@class](#class) to toggle class, [@at(...)](#at) to set attributes, [@if](#if) to show/hide
blocks, [@run](#run) to run custom view code.

~~~ html
<!-- uses class `active` if the model attribute `enabled` is truthy -->
<div @class:active='attr("enabled")'>

<!-- attributes -->
<input @at:type='attr("input_type")'>

<!-- Showing and hiding blocks as needed -->
<div @if='attr("premium")'>
<div @if='attr(user, "premium")'>
<div @if='-> user.isPremium()'>

<!-- Run an arbitrary view method -->
<!-- (runs it again if attribute changes) -->
<div @run="attr('editable') -> view.toggle($el)">

<!-- Subview: instantiate another view -->
<div @run='-> view.summary = new SummaryView({ el: $el })'>
~~~

#### Loops
Loops are supported using `@each`.

~~~ html
<!-- Arrays -->
<ul @each='person in -> people'>
  <li>
    <strong @text='-> person.name'></strong>
    <small  @text='-> person.title'></small>
  </li>
</ul>

<ul @each='word, description in -> words'>
  <li>
    <input type='radio' @at:value='-> word' />
    <label @text='-> description'></label>
  </li>
</ul>
~~~

It even has explicit support for [Backbone collections] which reacts to `add`,
`sort`, `delete` and `reset` events.

~~~ html
<!-- Looping over collections -->
<ul @each='person in -> model.people()'>
  <li @run='-> new PersonView({ el: el, model: person })'>
  </li>
</ul>
~~~

How to implement
----------------

### Dependencies

Livemarkup only has 2 hard dependencies: [jQuery] 1.5+ (or [Zepto] 1.0+) and
[Underscore.js].  It's recommended for use with [Backbone.js] 0.9.9+, but can be
used without it as well.

~~~ html
<script src='jquery.js'></script>
<script src='underscore.js'></script>
<script src='livemarkup.min.js'></script>
~~~

### With Backbone.js

In your Backbone views, simply add your template HTML to your view element
somehow [1]. Then initialize a Livemarkup object via `LM(this)` [2]. In this
mode, it uses the Backbone's [listenTo()] facility so the events bound will be
unbound once the view is removed.

~~~ js
Backbone.View.extend({
  render: function() {
    this.html('...');            /* 1 */
    this.template = LM(this)     /* 2 */
      .bind(this.model)
      .render();
  }
});
~~~

### Other frameworks

If you're not using Backbone, just initialize `LM()` with an element. It works
the same way.

~~~ js
$element = $("...");
template = LM($element).render();
~~~

### Reference

To instanciate, you probably need these:

* [bind()]( #template-bind ) -- Defines a model object to bind events to.
* [locals()]( #template-locals ) -- Defines helpers and locals.
* [render()]( #template-render ) -- Transforms the DOM and runs directives.

~~~ js
this.template = LM(element OR view)
  .bind(model)
  .locals({ var1: var1 })
  .render();
~~~

Directives
----------

Every Livemarkup instruction is called a *directive*. A directive is comprised 
of an *action* (left side, begins with `@`) and its *expression* (right side).

~~~ html
<div @text='attr("description")'>
<div @text='-> Math.random()'>
<input @value='attr("title")'>
~~~

#### Actions

Actions describe what will be done when a directive is ran. It usually
takes the *value* of the expression and performs something with it. Here are 
some common actions:

~~~ html
<div @text='...'>
<div @html='...'>
<input @value='...'>
~~~

* `@text` -- sets the text of the element.
* `@html` -- sets the inner HTML of the element.
* `@value` -- sets the value of an form element; two-way binding.

[More actions >]( #actions )

#### Expressions

An expression describes how a value is derived for a directive.

An expression is a JS expression that's runs *modifiers*. These modifiers will 
either describe how a *value* for that directive can be derived, or applies a 
behavior to the directive.

~~~ html
<!-- The `attr` modifier:
     This expression tells @text that the value will
     be derived from the model attribute `name`. -->
<div @text='attr("name")'>
~~~

Modifiers can be chained. The next modifier will transform the value of the 
previous modifier.

~~~ html
<!-- The `format` modifier:
     Calls the function `helperFunction` to transform the `name` attribute. -->
<div @text='attr("name").format(helperFunction)'>

<!-- It can take any function that returns something. -->
<div @text='attr("name").format(function(val) { return val.toUpperCase(); })'>
~~~

* `attr()` -- retrieves a value from a Backbone model, and listens for the
  model's `change:property` event to re-render the directive as needed.
* `format()` -- passes the value to the given function to mutate it. Often used for helpers.

[Modifiers >]( #modifiers )

#### Formatter

The `->` is simply a shorthand for `.format()`. These two directives are 
equivalent.

~~~ html
<!-- These two are equivalent: -->
<div @text='attr("name") -> val.toUpperCase()'>
<div @text='attr("name").format(val) { return val.toUpperCase(); }'>
~~~

You can use the variable `val` to get the value given by the modifiers.

~~~ html
<div @text='attr("name") -> val.toUpperCase()'>
~~~

You can use `->` without any other modifiers, which allows you to execute arbitrary JavaScript.

~~~ html
<div @text='-> Math.random()'>
~~~

The `this` in the context refers to the model bound to the template. (See [Template#bind()])

~~~ html
<div @text='-> this.getFullName()'>
~~~

[Formatters >]( #formatters )

# Actions and Modifiers

Actions
-------

  * __@text__ - sets the text
  * __@html__ - sets inner html
  * __@value__ - creates a two-way binding
  * __@at:name__ - sets an attribute
  * __@class:name__ - toggles a classname
  * __@if__ - toggles the existence of an element
  * __@each__ - iterates through an array/collection
  * __@options__ - populates options for `<select>`

### @text

Sets the text the given element using [$.fn.text].

~~~ html
<!-- Sets text based on the 'name' model attribute. -->
<div @text='attr("name")'>
~~~

Like all other actions, you can make it run any arbitrary JavaScript by using
[->].

~~~ html
<div @text='-> getDescriptionText()'>
~~~

Like all other actions, you can also transform using helpers with [->].

~~~ html
<div @text='attr("account_balance") -> formatMoney(val)'>
~~~
### @html

Sets the inner HTML of a given element using [$.fn.html]. Works exactly like 
[@text].

~~~ html
<div @html='attr("description")'>
~~~

### @value

Sets the value of the element using [$.fn.val]. Used on form elements 
(`textarea`, `input` and `select`).

~~~ html
<textarea @value='attr("description")'>
<input type='text' @value='attr("description")'>
~~~

When used in conjunction with the [attr] modifier, it creates a two-way binding
that listens to the element's `change` event and sets the model attribute.
Two-way bindings work with any form element.

It also works with multiple selections. In this case, ensure that the value is 
an array of items to be selected.

~~~ html
<select multiple name='fruit' @value='-> ["apple", "orange"]'>
  <option value='apple'>Apple</option>
  <option value='banana'>Banana</option>
  <option value='orange'>Orange</option>
</select>
~~~

When working with checkboxes, you have to put the directive in all the 
checkboxes. The value must also be an array just as above.

~~~ html
<input type='checkbox' name='fruit' value='apple'  @value='-> ["apple", "orange"]'>
<input type='checkbox' name='fruit' value='banana' @value='-> ["apple", "orange"]'>
<input type='checkbox' name='fruit' value='orange' @value='-> ["apple", "orange"]'>
~~~

When working with radio buttons, put the directive in all elements as well.

~~~ html
<input type='radio' name='fruit' value='apple'  @value='-> "orange"'>
<input type='radio' name='fruit' value='banana' @value='-> "orange"'>
<input type='radio' name='fruit' value='orange' @value='-> "orange"'>
~~~

### @at:name

Sets an attribute `name` in the element.

~~~ html
<img @at:title="attr('image_title')">
<img @at:title="attr('image_title') -> 'Caption: ' + val">

<img @at:src="attr('image_url')">
~~~

### @class:name

Sets a class `name` to the element if the value is `true`, and removes it if
`false`. This allows you to create bindings to give a class to an element based
on a value that may change.

~~~ html
<div @class:active='attr("is_active")'>
~~~

### @if

Makes the element present if the value is `true`, and removes it if `false`.

~~~ html
<div @if='attr("admin")'>
  This user is an admin.
</div>
~~~

### @each

Iterates through each of a given item. It takes the child of the element and
repeats it as needed.

~~~ html
<ul @each='user in -> ["Tom", "Dick", "Harry"]'>
  <li>
    Name: <strong @text="-> user"></strong>
  </li>
</ul>
~~~

When used with [Backbone collections], it reacts to `add`, `sort`, `delete` and
`reset` events, making the list respond to the collection as it is being modified.

~~~ html
<ul @each='item in -> this.reminders'>
  <li>
    Reminder: <strong @text="attr(user, 'text')"></strong>
  </li>
</ul>
~~~

Modifiers
---------

 * __attr[model,] name)__ - retrieves the given attribute, and auto-updates the
 directive when attribute is changed
 * __on([model,] event)__ - refreshes the directive when the given event is ran
 * __format(fn)__ - formats the value with the given helper function

### attr()

Retrieves the given attribute, then auto-updates the directive when the
attribute is changed.

~~~ html
<div @text='attr("description")'>
~~~

### on()

Listens to a given event.

~~~ html
<div @text='on("reset") -> this.getReset()'>
~~~

By default, it listens on the `model`. If you would like for it to listen to
another Backbone/jQuery object, just pass the object as a local, then:

~~~ html
<div @text='on(state, "refresh") ->
  "Refreshing... (Last updated " + state.lastUpdate() + ")"'>
~~~

### format (->)

Hooray for today.

~~~ html
<div @text='-> Math.random()'>
~~~

# Reference

API
---

### LM()

Creates a template object.

### Template#bind()

To be written.

Integration
===========

How to integrate
----------------

Livemarkup is designed with standard HTML markup in mind, and other template 
languages should be able to render to Livemarkup.

### With Jade (JS)

You can use it with Jade, here's a CoffeeScript/Backbone example:

~~~ js
class MyView extends Backbone.View
  initialize: (options={}) ->
    @people = options.people
    super

  render: ->
    @$el.html @markup()
    @template = LM(this)
      .locals(people: @people)
      .render()

  markup: jade.compile """
    h3 Users
    ul(@each="person in -> people")
      li
        | Name:
        strong(@text="-> person.name")

        | Email:
        span(@text="-> person.email")
  """
~~~

### With HAML (Ruby)

You'll have to render it server-side somehow. Maybe something like inline 
templates?

~~~ html
%script{type: 'text/template', id: 'person_show'}
  %ul{ '@each' => 'person in -> people' }
    %li
      Name:
      %strong{ '@text' => '-> person.name' }
      ...
~~~

Misc
====

Acknowledgements
----------------

© 2013, Rico Sta. Cruz. Released under the [MIT License].

**Livemarkup** is authored and maintained by [Rico Sta. Cruz] with help
from its [contributors]. It is sponsored by my startup, [Nadarei, Inc.]

[My website] - [Nadarei, Inc.] - [Github/rstacruz][gh] - [Twitter @rstacruz][tw]

[MIT License]: http://www.opensource.org/licenses/mit-license.php
[Rico Sta. Cruz]: http://ricostacruz.com
[contributors]: http://github.com/rstacruz/livemarkup/contributors
[Nadarei, Inc.]: http://nadarei.co

[My website]: http://ricostacruz.com
[gh]: https://github.com/rstacruz
[tw]: https://twitter.com/rstacruz

[listenTo()]: http://backbonejs.org/#Events-listenTo
[Underscore.js]: http://underscorejs.org
[Zepto]: http://zeptojs.com
[jQuery]: http://jquery.com
[Backbone.js]: http://backbonejs.org
[development notes]: https://raw.github.com/rstacruz/livemarkup/master/Notes.md
[$.fn.text]: http://api.jquery.com/text
[$.fn.html]: http://api.jquery.com/html

[->]: #formatter
[@text]: #text
[Template#bind()]: #template-bind
[Backbone collections]: http://backbonejs.org/#collections
