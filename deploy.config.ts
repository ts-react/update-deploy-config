import { resolve } from 'path';

export default {
  filePath: resolve(__dirname, 'test'),
  iterator: (key, obj) => {
    if (key === 'baseURL') {
      return 'test';
    }
    return obj[key];
  }
}
