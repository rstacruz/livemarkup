Livemarkup
==========

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
