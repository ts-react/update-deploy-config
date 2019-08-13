import * as babelParser from '@babel/parser';
import {
  isAssignmentExpression,
  isMemberExpression
} from '@babel/types';
import traverse from '@babel/traverse';

// 获取解析后的配置对象
function getOldConfig() {
  const result: {
    [key: string]: string
  } = {};

  const code = `
    (function() {
      // API地址
      window.baseURL = 'https://api.***.com';
      // 路由基本路径
      window.routerBase = '/';
      // 共有路径
      window.publicPath = 'https://cdn.***.com/project/env/';
    })();
  `;

  const visitor = {
    AssignmentExpression(path) {
      const { left, right } = path.node;
      if (
        isAssignmentExpression(path.node)
        && isMemberExpression(left)
        && left.object['name'] === 'window'
      ) {
        const key = left.property.name;
        if (key) {
          result[key] = right['value'];
        }
      }
    }
  };

  // 解析为AST
  const ast = babelParser.parse(code);

  // 循环
  traverse(ast, visitor);

  console.log(result);
}

getOldConfig();
