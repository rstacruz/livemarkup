require('./setup');

testSuite('syntaxes', function() {
  ['@', 'lm-', 'lm:', 'lm_', 'data-lm-'].forEach(function(prefix) {
    describe(prefix, function() {
      it("prefix", function() {
        template("<div "+prefix+"text='-> \"hello\"'></div>").render();

        assert.equal($('#body').text(), "hello");
      });

      it("prefix with name", function() {
        template("<img "+prefix+"at:title='-> \"hello\"'></div>").render();

        assert.equal($('#body').html(), '<img title="hello" />');
      });
    });
  });
});
