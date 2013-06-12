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
});
