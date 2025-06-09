const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const toursRouter = require('./routes/tours');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Маршруты
app.use('/api/tours', toursRouter);

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});