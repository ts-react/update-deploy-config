import colors from 'chalk';

class Logger {
  warn(...args: any[]) {
    this.log(colors.yellow('warning'), ...args)
  }

  error(...args: any[]) {
    this.log(colors.red('error'), ...args)
  }

  success(...args: any[]) {
    this.log(colors.green('success'), ...args)
  }

  log(...args: any[]) {
    console.log(...args)
  }
}

export default new Logger();
