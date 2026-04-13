export type LogContext = Record<string, unknown>;

function log(level: 'INFO' | 'ERROR', message: string, context?: LogContext) {
  const payload = context ? ` ${JSON.stringify(context)}` : '';
  const output = `[${level}] ${message}${payload}`;

  if (level === 'ERROR') {
    console.error(output);
    return;
  }

  console.log(output);
}

export const logAdapter = {
  info(message: string, context?: LogContext) {
    log('INFO', message, context);
  },
  error(message: string, context?: LogContext) {
    log('ERROR', message, context);
  },
};
