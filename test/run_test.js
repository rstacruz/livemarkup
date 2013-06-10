var Setup = require('./setup');

testSuite('@run()', function() {
  var model, view, tpl, $box, MyView;

  beforeEach(function() {
    MyView = Backbone.View.extend({
      toggle: sinon.spy(function($el, val) {
        $el.toggleClass('active', val);
      })
    });
  });

  beforeEach(function() {
    $box  = html('<div id=`box` @run=`attr("enabled") -> view.toggle($el, val)`>');
    model = new Backbone.Model({ enabled: true });
    view  = new MyView({ el: $box });
    tpl   = LM(view).bind(model).render();
  });

  it('correct html', function() {
    assert.equal('<div id="box" class="active"></div>', $("body").html());
  });

  it('called once first', function() {
    assert.isTrue(view.toggle.calledOnce);
    assert.equal(true, view.toggle.lastCall.args[1]);
  });

  it('called again first', function() {
    model.set('enabled', false);
    assert.isTrue(view.toggle.calledTwice);
    assert.equal(false, view.toggle.lastCall.args[1]);
  });
});
