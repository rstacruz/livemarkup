Livemarkup
==========

Livemarkup lets you define directives as plain HTML attributes in a template. It
supports model binding and some fancy doodads.

~~~ html
<!-- sets text to the `first_name` attribute of a model. -->
<!-- auto-updates when `first_name` is changed. -->
<span @text='attr("first_name")'>

<!-- use arbitrary JS to set text (does not auto-update) -->
<span @text='-> model.getFirstName()'>
<span @text='-> parseInt(Math.random()*6)'>

<!-- custom helpers -->
<span @text='attr("first_name") -> val.toUpperCase()'>
<span @text='attr("balance") -> formatMoney(val)'>

<!-- execute arbitrary JS; refreshes after a `reset` event happens at the model -->
<span @text='on("reset") -> model.getResetMessage()'>

<!-- html also works -->
<span @html='attr("description")'>
<span @html='attr("description") -> markdown(val) '>

<!-- uses class "active" if the model attribute "enabled" is truthy -->
<div @class(active)='attr("enabled")'>

<!-- attributes -->
<input @at(type)='attr("input_type")'>

<!-- two-way binding -->
<input @value='attr("title")'>

<!-- Showing and hiding blocks as needed -->
<div @if='attr("premium")'>
<div @if='attr(user, "premium")'>
<div @if='-> user.isPremium()'>
~~~

~~~ html
<!-- Subview: instantiate another view -->
<div @subview(summary)='-> new SummaryView({ el: el })'>

<!-- Run an arbitrary view method -->
<!-- (runs it again if attribute changes) -->
<div @run(toggle)="attr('editable')">

<!-- Loops -->
<ul @each(person)='-> model.people()'>
  <li @subviews(peopleViews)='-> new PersonView({ el: el, model: person })'>
  </li>
</ul>

~~~

Implementation
--------------

### Dependencies

Livemarkup only has 2 hard dependencies: [jQuery]/[Zepto] and [Underscore.js].
It's recommended for use with [Backbone.js], but can be used without it as well.

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

Directives
----------

Every Livemarkup instruction is called a *directive*. A directive is comprised 
of an *action* (left side, begins with `@`) and *modifiers* (right side).

~~~ html
<div @text='attr("description")'>
<div @text='-> Math.random()'>
<input @value='attr("title")'>
~~~

#### Actions

Actions describe what will be done when a directive is rendered. It usually
takes the *value* of the directive (as described by the *modifiers*) and
performs something with it. Here are some common actions:

~~~ html
<div @text='...'>
<div @html='...'>
<input @value='...'>
~~~

* `@text` -- sets the text of the element.
* `@html` -- sets the inner HTML of the element.
* `@value` -- sets the value of an form element; two-way binding.

[More actions >]( #actions )

#### Modifiers

A modifier will either describe how a *value* for that directive can be derived,
or applies a behavior to the directive. Modifiers can be chained.

~~~ html
<div @text='attr("name")'>
<div @text='attr("name").format(function(val) { return val.toUpperCase(); })'>
<div @text='attr("name").format(helperFunction)'>
<div @text='attr("name").format(helper1).format(helper2)'>
~~~

* `attr()` -- retrieves a value from a Backbone model, and listens for the
  model's `change:property` event to re-render the directive as needed.
* `format()` -- passes the value to the given function to mutate it. Often used for helpers.

[Modifiers >]( #modifiers )

#### Formatter

The `->` in the modifiers section is shorthand for `.format()`. These two directives are equivalent.

~~~ html
<div @text='attr("name") -> val.toUpperCase()'>
<div @text='attr("name").format(val) { return val.toUpperCase(); }'>
~~~

You can use `->` without any other modifiers, which allows you to execute arbitrary JavaScript.

~~~ html
<div @text='-> Math.random()'>
~~~

[Formatters >]( #formatters )

# Actions and Modifiers

Actions
-------

  * __@text__ - sets the text
  * __@html__ - sets inner html
  * __@value__ - creates a two-way binding
  * __@at(name)__ - sets an attribute
  * __@class(name)__ - toggles a classname
  * __@options__ - populates options for `<select>`
  * __@if__
  * __@include__
  * __@subview__

### @text

Sets text.

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

[listenTo()]: http://backbonejs.org/#Events-listenTo
[Underscore.js]: http://underscorejs.org
[Zepto]: http://zeptojs.com
[jQuery]: http://jquery.com
[Backbone.js]: http://backbonejs.org
