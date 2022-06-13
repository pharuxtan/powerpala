const { extname } = require('path');

import CSSCompiler from "./CSS.js";
import SCSSCompiler from "./SCSS.js";

export const css = CSSCompiler;
export const scss = SCSSCompiler;
export function resolveCompiler(file) {
  const extension = extname(file).substr(1);
  switch (extension) {
    case 'scss': return new SCSSCompiler(file);
    case 'css': return new CSSCompiler(file);
  }
}
