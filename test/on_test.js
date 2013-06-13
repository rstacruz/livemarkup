require('./setup');

testSuite('on() modifier', function() {
  var klik;

  it('should work', function() {
    var klik = sinon.stub();

    template('<div id="box" @on:click="klik()">')
      .locals({ klik: klik })
      .render();

    $('#box').trigger('click');
    $('#box').trigger('click');

    assert(klik.calledTwice);
  });

  it('should work with views', function() {
    var View = Backbone.View.extend({
      render: function() {
        this.$el.html('<div id="box" @on:click="boo">');
        LM(this).render();
        return this;
      },
      boo: sinon.stub()
    });

    var view = new View().render();
    view.$el.appendTo('#body');

    $('#box').trigger('click');
    $('#box').trigger('click');
    assert.equal(view.boo.callCount, 2);
  });
});
