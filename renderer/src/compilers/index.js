const { extname } = require('path');

const CSSCompiler = require("./CSS.js");
const SCSSCompiler = require("./SCSS.js");

exports.css = CSSCompiler;
exports.scss = SCSSCompiler;
exports.resolveCompiler = function resolveCompiler(file) {
  const extension = extname(file).substr(1);
  switch (extension) {
    case 'scss': return new SCSSCompiler(file);
    case 'css': return new CSSCompiler(file);
  }
}
