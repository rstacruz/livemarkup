var Setup = require('./setup');

testSuite('@value() radio', function() {
  var model;

  beforeEach(function() {
    model = new Backbone.Model({ number: 'two' });
    sinon.spy(model, 'get');
    sinon.spy(model, 'set');

    template(
      "<form>" +
      "<input class='c1' type='radio' name='number' value='one' @value='attr(\"number\")' />" +
      "<input class='c2' type='radio' name='number' value='two' @value='attr(\"number\")' />" +
      "<input class='c3' type='radio' name='number' value='three' @value='attr(\"number\")' />" +
      "</form>"
    ).bind(model).render();
  });

  it("should not change values", function() {
    assert.equal('one', $('.c1').attr('value'));
    assert.equal('two', $('.c2').attr('value'));
    assert.equal('three', $('.c3').attr('value'));
  });

  it("get callcount", function() {
    assert.equal(model.get.callCount, 3);
  });

  it("set callcount", function() {
    assert.equal(model.set.callCount, 0);
  });

  it("unchecked", function() {
    assert.isFalse($('.c1').is(':checked'));
    assert.isFalse($('.c3').is(':checked'));
  });

  it("checked", function() {
    assert.isTrue($('.c2').is(':checked'));
  });

  it('should set the right value', function() {
    assert.equal(
      j($('form').serializeArray()),
      j([ { name: 'number', value: 'two' } ]));
  });

  // ----

  describe("change", function() {
    beforeEach(function() {
      if ($.fn.frop)
        $('.c3').prop('checked', true);
      else
        $('.c3').attr('checked', true);

      $('.c3').trigger('change');
    });

    it('set callcount', function() {
      assert.equal(model.set.callCount, 1);
    });

    it('reverse binding', function() {
      assert.equal(model.get('number'), 'three');
    });
  });

  // ---

  function j(obj) { return JSON.stringify(obj); }
});
