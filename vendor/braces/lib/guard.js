'use strict';

// Keep every recursive upstream walker within a bounded stack. This check is
// iterative and cannot be relaxed by caller options, including maxLength.
const MAX_DEPTH = 64;
const MAX_NODES = 65536;
const assertSafeAst = ast => {
  const pending = [{ node: ast, depth: 0 }];
  const seen = new WeakSet();
  let count = 0;
  while (pending.length) {
    const { node, depth } = pending.pop();
    if (!node || typeof node !== 'object') throw new TypeError('Invalid brace AST');
    if (depth >= MAX_DEPTH || ++count > MAX_NODES || seen.has(node)) {
      throw new SyntaxError('Brace AST exceeds safe nesting or node limits');
    }
    seen.add(node);
    if (node.nodes) {
      if (!Array.isArray(node.nodes) || node.nodes.length > MAX_NODES) throw new SyntaxError('Invalid brace nodes');
      for (const child of node.nodes) pending.push({ node: child, depth: depth + 1 });
    }
  }
};

module.exports = { MAX_DEPTH, assertSafeAst };
