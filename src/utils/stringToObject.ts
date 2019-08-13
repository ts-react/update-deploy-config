import * as babelParser from '@babel/parser';
import {
  isAssignmentExpression,
  isMemberExpression
} from '@babel/types';
import traverse from '@babel/traverse';

export interface IConfig {
  [key: string]: string;
}

function stringToObject (
  code: string
): IConfig {
  const result: {
    [key: string]: string
  } = {};

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

  return result;
}

export default stringToObject;
