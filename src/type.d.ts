export interface IOptions {
  rootDir?: string;
  // 配置文件名称 默认 config.js
  fileName?: string;
  fun?: (key, obj) => string;
}
