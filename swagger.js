import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger Example',
      version: '1.0.0',
      description: 'A simple example of Swagger implementation in a Node.js app',
    },
  },
  apis: ['./index.js'], // Point to the file that contains your routes
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
