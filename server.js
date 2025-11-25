// Load environment variables from .env file
require('dotenv').config();

const strapi = require('@strapi/strapi');
strapi.createStrapi({ distDir: './dist' }).start();