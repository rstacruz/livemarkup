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

<!-- uses class "active" if the model attribute "enabled" is truthy -->
<div @class(active)='attr("enabled")'>

<!-- attributes -->
<input @at(type)='attr("input_type")'>

<!-- two-way binding -->
<input @value='attr("title")'>

<div @showIf='attr("premium")'>
<div @showIf='attr(user, "premium")'>
<div @showIf='-> user.isPremium()'>

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

#### With Backbone.js

In your Backbone views, simply add your template HTML to your view element
somehow [1]. Then initialize a Livemarkup object via `LM(this)` [2].

~~~ js
Backbone.View.extend({
  render: function() {
    this.html('...');            /* 1 */
    this.template = LM(this)     /* 2 */
      .bind(this.model)
      .local({ x: true })
      .render();
  }
});
~~~

#### Without Backbone.js

If you're not using Backbone, just initialize `LM()` with an element. It works
the same way.

~~~ js
$element = $("...");
template = LM($element).render();
~~~

Directives
----------

Every Livemarkup instruction is called a *directive*. A directive is comprised 
of an action (left side, begins with `@`) and modifiers (right side).

~~~ html
<div @text='attr("description")'>
<div @text='-> Math.random()'>
<input @value='attr("title")'>
~~~

The `->` in the modifiers section is shorthand for `.format()`. These are equivalents:

~~~ html
<div @text='attr("name") -> val.toUpperCase()'>
<div @text='attr("name").format(val) { return val.toUpperCase(); }'>

<div @text='-> Math.random()'>
<div @text='format(function(){ return Math.random(); })'>
~~~


# Actions and Modifiers

Actions
-------

  * __@text__ - sets the text
  * __@html__ - sets inner html
  * __@at(name)__ - sets an attribute
  * __@value__ - creates a two-way binding
  * __@options__ - populates options for `<select>`
  * __@showIf__
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
