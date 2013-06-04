Livemarkup
==========

Quick examples
--------------

Livemarkup lets you define directives as plain HTML attributes in a template.

``` html
<!-- 1: sets text to the "first_name" attribute of a model.
        Auto-updates when "first_name" is changed.
     2: use arbitrary JS to set text (does not auto-update)
-->
<span @text='attr("first_name")'>
<span @text='-> model.getFirstName()'>
<span @text='-> parseInt(Math.random()*6)'>

<!-- custom helpers -->
<span @text='attr("first_name") -> val.toUpperCase()'>
<span @text='attr("balance") -> formatMoney(val)'>

<!-- execute arbitrary JS; refreshes after a "reset" event happens at the model -->
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

<!-- Partials: render another template inside it -->
<div @include(person_info)>

<!-- Loops -->
<ul @each(person)='-> model.people()'>
  <li @subview(PhotoView)='-> person'>
  </li>
</ul>
```

Implementation
--------------

Register your template

``` js
LM.register("template", "<span>Hello</span>");
```

Now make a Backbone view

``` js
Backbone.View.extend({
  render: function() {
    this.template = LM.get("template", this)
      .bind(this.model)
      .local({ x: true })
      .render();
  }
});
```

Directives
----------

Every Livemarkup instruction is called a *directive*. A directive is comprised 
of an action (left side, begins with `@`) and modifiers (right side).

``` html
<div @text='attr("description")'>
<div @text='-> Math.random()'>
<input @value='attr("title")'>
```

The `->` in the modifiers section is shorthand for `.format()`. These two are equivalent:

``` html
<div @text='attr("name") -> val.toUpperCase()'>
<div @text='attr("name").format(val) { return val.toUpperCase(); }'>
```

Actions
-------

  * __text__ - sets the text
  * __html__ - sets inner html
  * __at(name)__ - sets an attribute
  * __value__ - creates a two-way binding
  * __options__ - populates options for `<select>`
  * __showIf__
  * __include__
  * __subview__

Modifiers
--------

 * __on([model,] event)__ - refreshes the directive when the given event is ran
 * __attr[model,] name)__ - retrieves the given attribute, and auto-updates the
 directive when attribute is changed
 * __format(fn)__ - formats the value with the given helper function
