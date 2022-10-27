const meriyah = require('meriyah');
const estraverse = require('estraverse');

function traverse(body, enter){
  let parents = [];
  estraverse.replace(body, {
    enter: (node, parent) => {
      parents.push(node);
      return enter(node, parents);
    },
    leave: () => { parents.pop() },
    fallback: 'iteration'
  });
}

function searchPattern(ast, pattern, ...args){
  let identifier = undefined;
  traverse(ast, (node, parents) => {
    if(identifier !== undefined) return;
    let i;
    for(i = 0; i < parents.length; i++){
      if(pattern[i] === undefined) break;
      const parent = parents[i];
      if(typeof pattern[i] === "string"){
        if(parent.type !== pattern[i]) break;
        else continue
      };
      let pType = pattern[i][0];
      if(parent.type !== pType) break;
      let cb = pattern[i][1];
      identifier = cb(parent, parents, ...args);
      if(typeof identifier === "boolean"){
        let bool = identifier;
        identifier = undefined;
        if(bool) continue;
        else break;
      }
    }
  });
  return identifier;
}

let defineComponent_pattern = [
  "Program",
  "FunctionDeclaration",
  "BlockStatement",
  "ReturnStatement",
  ["ConditionalExpression", (node, parents) => {
    if(node.test.type !== "CallExpression") return;
    if(node.consequent.type !== "ObjectExpression") return;
    if(node.consequent.properties.length !== 2) return;
    let keys = node.consequent.properties.map(p => p.key.name);
    if(!keys.includes("setup")) return;
    if(!keys.includes("name")) return;
    return parents.slice(-4)[0].id.name;
  }]
];

let resolveDynamicComponent_pattern = [
  "Program",
  "FunctionDeclaration",
  "BlockStatement",
  "ReturnStatement",
  ["ConditionalExpression", (node, parents) => {
    if(node.test.type !== "CallExpression") return;
    if(node.consequent.type !== "LogicalExpression") return;
    if(node.alternate.type !== "LogicalExpression") return;
    if(node.consequent.left.type !== "CallExpression") return;
    return parents.slice(-4)[0].id.name;
  }]
];

let createAppAPI_pattern = [
  "Program",
  "FunctionDeclaration",
  "BlockStatement",
  "ReturnStatement",
  ["FunctionExpression", (node, parents) => {
    if(node.id !== null) return;
    if(node.async) return;
    if(node.generator) return;
    if(node.params.length !== 2) return;
    if(node.params[1].type !== "AssignmentPattern") return;
    if(node.params[1].right.value !== null) return;
    return parents.slice(-4)[0].id.name;
  }]
];

let createApp_pattern = [
  "Program",
  ["VariableDeclaration", (node) => node.kind === "const"],
  "VariableDeclarator",
  "ArrowFunctionExpression",
  "BlockStatement",
  "VariableDeclaration",
  "VariableDeclarator",
  ["CallExpression", (node) => node?.arguments[0]?.type === "SpreadElement"],
  ["MemberExpression", (node, parents) => {
    if(node.computed) return;
    if(node.object.type !== "CallExpression") return;
    if(node.object.arguments.length !== 0) return;
    if(node.property.name !== "createApp") return;
    return parents.slice(-7)[0].id.name;
  }]
]

let app_pattern = [
  "Program",
  ["VariableDeclaration", (node) => node.kind === "const"],
  ["VariableDeclarator", (node, _, createApp) => {
    if(node.init.type !== "CallExpression") return;
    if(node.init.callee.name !== createApp) return;
    return node.id.name;
  }]
];

module.exports = function moduleTraverser(source){
  const ast = meriyah.parse(source, {module: true, webcompat: true, impliedStrict: true});

  let defineComponent = searchPattern(ast, defineComponent_pattern);
  let resolveDynamicComponent = searchPattern(ast, resolveDynamicComponent_pattern);
  let createAppAPI = searchPattern(ast, createAppAPI_pattern);
  let app = searchPattern(ast, app_pattern, searchPattern(ast, createApp_pattern));

  return {
    defineComponent,
    resolveDynamicComponent,
    createAppAPI,
    app
  }
}
