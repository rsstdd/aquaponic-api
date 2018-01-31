export default {
  env: 'development',
  port: 4000,
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  mongo: {
    url: 'mongodb://localhost:27017/check-in-api'
  }
}
