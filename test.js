var obj = { a: 2, b: 3 };
var obj2 = { c: 4 };
with (obj) {
  with (obj2) {
  console.log(c);
  }
}
