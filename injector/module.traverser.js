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

let openBlock_pattern = [
  "Program",
  ["FunctionDeclaration", node => node.params.length === 1 && node.params[0].type === "AssignmentPattern" && node.params[0].right.type === "UnaryExpression"],
  "BlockStatement",
  "ExpressionStatement",
  ["CallExpression", (node, parents) => {
    if(node.callee.type !== "MemberExpression") return;
    if(node.callee.computed) return;
    if(node.callee.property.name !== "push") return;
    if(node.arguments.length !== 1) return;
    if(node.arguments[0].type !== "AssignmentExpression") return;
    if(node.arguments[0].right.type !== "ConditionalExpression") return;
    if(node.arguments[0].right.consequent.value !== null) return;
    if(node.arguments[0].right.alternate.type !== "ArrayExpression") return;
    return parents.slice(-4)[0].id.name;
  }]
];

let createElementBlock_pattern = [
  "Program",
  ["FunctionDeclaration", node => node.params.length === 6],
  ["BlockStatement", node => node.body.length === 1],
  "ReturnStatement",
  "CallExpression",
  ["CallExpression", (node, parents) => {
    if(node.arguments.length !== 7) return;
    if(node.arguments.slice(-1)[0].type !== "UnaryExpression") return;
    return parents.slice(-5)[0].id.name;
  }],
];

let createBaseVNode_pattern = [
  "Program",
  ["FunctionDeclaration", node => {
    if(node.async || node.generator) return;
    if(node.params.length < 6) return;
    function hasLiteral(i, lit){
      if(node.params[i].type !== "AssignmentPattern") return;
      if(node.params[i].right.type !== "Literal") return;
      if(node.params[i].right.value !== lit) return;
      return true;
    }
    if(!hasLiteral(1, null)) return;
    if(!hasLiteral(2, null)) return;
    if(!hasLiteral(3, 0)) return;
    if(!hasLiteral(4, null)) return;
    if(node.params[5].type !== "AssignmentPattern") return;
    if(node.params[5].right.type !== "ConditionalExpression") return;
    return node.id.name;
  }]
];

let _export_sfc_pattern = [
  "Program",
  "VariableDeclaration",
  "VariableDeclarator",
  ["ArrowFunctionExpression", node => node.params.length === 2],
  "BlockStatement",
  "VariableDeclaration",
  "VariableDeclarator",
  ["LogicalExpression", (node, parents) => {
    if(node.operator !== "||") return;
    if(node.left.type !== "MemberExpression") return;
    if(node.left.computed) return;
    if(node.left.property.name !== "__vccOpts") return;
    return parents.slice(-6)[0].id.name;
  }]
];

let component_pattern = [
  "Program",
  "VariableDeclaration",
  "VariableDeclarator",
  "CallExpression",
  "ObjectExpression",
  ["Property", (node, parents, component) => {
    if(node.computed || node.method || node.shorthand) return;
    if(node.key.name !== "name") return;
    if(node.value.value !== component) return;
    return parents[2].id.name;
  }]
];

let games_pattern = [
  "Program",
  ["VariableDeclaration", node => node.declarations.length > 1],
  ["VariableDeclarator", (node, parents) => parents[1].declarations.indexOf(node) === parents[1].declarations.length - 1],
  ["ArrayExpression", (node, parents) => {
    function hasBaseKeys(properties){
      for(let key of ["visibility", "id", "name", "icon", "backgroundImage", "logo", "headline", "colors", "description"]){
        if(!properties.find(p => p.key && p.key.name === key)) return;
      }
      return true;
    }
    if(node.elements.length === 0) return;
    for(let i = 0; i < node.elements.length; i++){
      let upperVar = parents[1].declarations[i];
      if(upperVar.init.type !== "ObjectExpression") return;
      if(!hasBaseKeys(upperVar.init.properties)) return;
      if(!node.elements.map(e => e.name).includes(upperVar.id.name)) return;
    }
    return parents[2].id.name;
  }]
];

let createApp_pattern = [
  "Program",
  ["VariableDeclaration", node => node.kind === "const"],
  "VariableDeclarator",
  "ArrowFunctionExpression",
  "BlockStatement",
  "VariableDeclaration",
  "VariableDeclarator",
  ["CallExpression", node => node?.arguments[0]?.type === "SpreadElement"],
  ["MemberExpression", (node, parents) => {
    if(node.computed) return;
    if(node.object.type !== "CallExpression") return;
    if(node.object.arguments.length !== 0) return;
    if(node.property.name !== "createApp") return;
    return parents.slice(-7)[0].id.name;
  }]
];

let app_pattern = [
  "Program",
  ["VariableDeclaration", node => node.kind === "const"],
  ["VariableDeclarator", (node, _, createApp) => {
    if(node.init.type !== "CallExpression") return;
    if(node.init.callee.name !== createApp) return;
    return node.id.name;
  }]
];

module.exports = function moduleTraverser(source){
  const ast = meriyah.parse(source, {module: true, webcompat: true, impliedStrict: true});

  let defineComponent = searchPattern(ast, defineComponent_pattern);
  let createAppAPI = searchPattern(ast, createAppAPI_pattern);
  let openBlock = searchPattern(ast, openBlock_pattern);
  let createElementBlock = searchPattern(ast, createElementBlock_pattern);
  let createBaseVNode = searchPattern(ast, createBaseVNode_pattern);
  let _export_sfc = searchPattern(ast, _export_sfc_pattern);
  let NavigationItem = searchPattern(ast, component_pattern, "NavigationItem");
  let NavigationComponent = searchPattern(ast, component_pattern, "NavigationComponent");
  let games = searchPattern(ast, games_pattern);
  let app = searchPattern(ast, app_pattern, searchPattern(ast, createApp_pattern));

  return {
    defineComponent,
    createAppAPI,
    openBlock,
    createElementBlock,
    createBaseVNode,
    _export_sfc,
    NavigationItem,
    NavigationComponent,
    games,
    app
  };
}
