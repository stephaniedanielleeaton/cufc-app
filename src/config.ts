import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    mongo: {
      uri: process.env.MONGO_URI
    }
  };