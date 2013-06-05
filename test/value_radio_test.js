var Setup = require('./setup');

describe('@value() radio', function() {
  var tpl, $el, model;

  beforeEach(Setup.env);
  beforeEach(setModel);

  beforeEach(function() {
    model.set('number', 'two');
    render(
      "<input class='c1' type='radio' name='number' value='one' @value='attr(\"number\")' />" +
      "<input class='c2' type='radio' name='number' value='two' />" +
      "<input class='c3' type='radio' name='number' value='three' />"
    );
  });

  it("should not change values", function() {
    assert.equal($('.c1').attr('value'), 'one');
    assert.equal($('.c2').attr('value'), 'two');
    assert.equal($('.c3').attr('value'), 'three');
  });

  xit('(Not working) should set the right value', function() {
    assert.equal($(':radio').val(), 'two');
  });

  xit('reverse binding', function() {
  });

  // ---

  function setModel() {
    model = new Backbone.Model({ name: "John" });
  }

  function render(str) {
    $el = $("<p>").appendTo("body").html(str);
    tpl = new LM($el).bind(model).render();
  }
});
