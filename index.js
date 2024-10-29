import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
// import swaggerSpec from './swagger';
import routes from './src/routes/index.js';
import connectToDatabase from './src/config/database.js';
// import swaggerDocument from './src/docs/swagger.json';

dotenv.config();
(async () => {
  await connectToDatabase();
  const PORT = process.env.PORT ?? 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // console.log("publicKey", publicKey, "privateKey", privateKey);
  });
})();

const app = express();
app.use(helmet()); // It provides several built-in protections against common web vulnerabilities by setting HTTP response headers appropriately.
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
const port = process.env.PORT ?? 5000;
app.use(express.json());
app.use(cors());
app.use(express.static('src/uploads'));

routes(app);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup());

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
