import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'user-hobbies',
  streams: [{ level: 'info', stream: process.stdout }],
  serializers: {
    err: bunyan.stdSerializers.err,
    req: ({ method, url }: { method: string; url: string }) => ({
      method,
      url,
    }),
  },
});

export default logger;
