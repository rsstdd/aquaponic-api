export default {
  env: process.env.NODE_ENV,
  redis: {
    url: process.env.REDIS_URL
  },
  mongo: {
    url: process.env.MONGOHQ_URL
  },
  firebase: JSON.parse(process.env.FIREBASE)
}
