import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'supersports-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  btcpay: {
    url: process.env.BTCPAY_URL,
    apiKey: process.env.BTCPAY_API_KEY,
    storeId: process.env.BTCPAY_STORE_ID,
  },
  nowpayments: {
    apiKey: process.env.NOWPAYMENTS_API_KEY,
    ipnSecret: process.env.NOWPAYMENTS_IPN_SECRET,
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
