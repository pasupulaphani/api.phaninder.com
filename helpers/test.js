
var myEsc = require('./escape.js');

var title = "{ 'Ich ♥ Büc_her':_ --__'foo 𝌆 bar' }"

console.log(myEsc.urlSeoEsc(title));