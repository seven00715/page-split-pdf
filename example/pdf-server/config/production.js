module.exports = {
  showUI: true,
  concurrency: 3,
  useLocalOrigin: false,
  workerNums: 4,
  redisClusterOpts: {
    enable: false,
    useBullIORedis: true,
    redisCluster: [
      {
        port: 6379,
        host: 'http:127.0.0.1',
      },
    ],
    options: {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    },
  },

  redisOpt: {
    port: 6379,
    host: 'redis-xxxx',
    password: 'xxxx',
    db: 0,
  },
}
