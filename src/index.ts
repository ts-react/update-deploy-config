import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { isFunction } from 'lodash';
import { template } from 'lodash';
import stringToObject, { IConfig } from './utils/stringToObject';
import configLoader from './config-loader'
import { IOptions } from './type';
import logger from './logger';

interface IRunConfig {
  filePath: string;
  fileName: string;
  iterator?: (key, obj) => string;
}

export class Transform {
  private readonly config: IRunConfig;
  private readonly rootDir: string;
  private readonly filePath: string;

  constructor(options: IOptions) {
    this.rootDir = resolve(options.rootDir || '.');
    const userConfig = configLoader.loadSync({
      files: [
        'deploy.config.js',
        'deploy.config.ts'
      ],
      cwd: this.rootDir
    });

    this.config = Object.assign({
      filePath: '.',
      fileName: './config.js',
      iterator: (key, obj) => {
        return obj[key];
      }
    }, userConfig.data);

    this.filePath = resolve(this.config.filePath, this.config.fileName);
  }

  run() {
    const { iterator } = this.config;
    let code;

    logger.log('---------开始处理---------');

    // 1. 读取配置文件
    try {
      code = readFileSync(this.filePath, 'utf-8');
    } catch (e) {
      logger.error('配置文件读取错误！');
      process.exit(1)
    }

    if (!code) {
      logger.error('配置文件为空！');
      return;
    }

    // 2. 转换原有配置为对象
    const config = stringToObject(code);

    // 3. 重新生成转换后的配置
    const newConfig: IConfig = {...config};

    if (isFunction(iterator)) {
      Object.keys(config).forEach(item => {
        const result = iterator(item, config);
        if (result) {
          newConfig[item] = iterator(item, config);
        }
      });
    }

    // 4. 生成新的配置文件
    const configTemplate = readFileSync(join(__dirname, './templates/config.js.tpl'), 'utf-8');

    const compiled = template(configTemplate.toString());
    const result = compiled({
      code: `${Object.keys(newConfig).map(item => `window.${item} = '${newConfig[item]}'`).join(';\n  ')}`
    });

    writeFileSync(this.filePath, result);

    Object.keys(newConfig).forEach(item => {
      logger.success(`${item}: ${newConfig[item]}`)
    });

    logger.log('---------处理成功---------');

  }
}

export default Transform;
