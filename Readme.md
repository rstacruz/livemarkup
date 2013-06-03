Livemarkup
==========

Directives
----------

Every Livemarkup instruction is called a *directive*. A directive is comprised 
of an action (left side, begins with `@`) and modifiers (right side).

``` html
<div @text="attr('description')">
<div @text="-> Math.random()">
<input @value="attr('title')">
```

Implementation
--------------

Register your template

``` js
LM.register('template', '<span>Hello</span>');
```

Now make a Backbone view

``` js
Backbone.View.extend({
  render: function() {
    this.template = LM.get('template', this)
      .bind(this.model)
      .local({ x: true })
      .render();
  }
});
```
