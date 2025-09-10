import 'dotenv/config';



export const config = {

  PORT:process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET ?? '123456789',
  API_KEY: process.env.API_KEY,
  BASE_URL: process.env.BASE_URL,


  DB: {
    HOST: process.env.DB_HOST ?? 'localhost',
    PORT: parseInt(process.env.DB_PORT ?? '5432'),
    USER: process.env.DB_USER ?? 'neon_user',
    PASSWORD: process.env.DB_PASSWORD ?? '1234',
    NAME: process.env.DB_NAME ?? 'neondb',
    SSL: true,
  },

  DB_DUMMY: {
    HOST: process.env.DB_HOST_DUMMY ?? 'localhost',
    PORT: parseInt(process.env.DB_PORT_DUMMY ?? '5432'),
    USER: process.env.DB_USER_DUMMY ?? 'dummy_user',
    PASSWORD: process.env.DB_PASSWORD_DUMMY ?? 'dummy_pass',
    NAME: process.env.DB_NAME_DUMMY ?? 'dummy_db',
    SSL: (process.env.DB_SSL_DUMMY ?? 'false') === 'true',
  },

  
  


  
};
