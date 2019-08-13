#!/usr/bin/env node

import Transform from './index';

const transform = new Transform({
  rootDir: process.cwd()
});

transform.run();
