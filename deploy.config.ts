import { resolve } from 'path';

export default {
  filePath: resolve(__dirname),
  iterator: (key, obj) => {
    if (key === 'baseURL') {
      return 'test';
    }
    return obj[key];
  }
}
