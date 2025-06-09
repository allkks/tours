const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const toursFilePath = path.join(__dirname, '../data/tours.json');

async function readTours() {
  try {
    const data = await fs.readFile(toursFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tours:', error);
    return [];
  }
}

async function writeTours(tours) {
  try {
    await fs.writeFile(toursFilePath, JSON.stringify(tours, null, 2));
  } catch (error) {
    console.error('Error writing tours:', error);
    throw new Error('Failed to save tours');
  }
}

router.get('/', async (req, res) => {
  const tours = await readTours();
  res.json(tours);
});

router.get('/countries', async (req, res) => {
  const tours = await readTours();
  const countries = [...new Set(tours.map(tour => tour.country))];
  res.json(countries);
});

router.post('/', async (req, res) => {
  const tours = await readTours();
  const newTour = {
    id: uuidv4(),
    ...req.body,
    price: parseFloat(req.body.price),
  };
  tours.push(newTour);
  await writeTours(tours);
  res.status(201).json(newTour);
});

router.put('/:id', async (req, res) => {
  const tours = await readTours();
  const index = tours.findIndex(tour => tour.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Tour not found' });
  }
  tours[index] = { ...req.body, id: req.params.id, price: parseFloat(req.body.price) };
  await writeTours(tours);
  res.json(tours[index]);
});

router.delete('/:id', async (req, res) => {
  const tours = await readTours();
  const filteredTours = tours.filter(tour => tour.id !== req.params.id);
  if (tours.length === filteredTours.length) {
    return res.status(404).json({ message: 'Tour not found' });
  }
  await writeTours(filteredTours);
  res.json({ message: 'Tour deleted' });
});

module.exports = router;