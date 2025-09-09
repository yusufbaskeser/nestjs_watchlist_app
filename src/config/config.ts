export const config = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || '123456789',
  API_KEY: process.env.API_KEY,
  BASE_URL: process.env.BASE_URL,

  DB: {
    HOST: process.env.DB_HOST,
    PORT: (process.env.PORT || 3000).toString(),
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME,
  },
};
