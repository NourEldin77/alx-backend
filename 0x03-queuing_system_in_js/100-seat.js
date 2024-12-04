const express = require('express');
const redis = require('redis');
const app = express();
const port = 1245;

const redisClient = redis.createClient();

const TOTAL_SEATS = 50;

let reservationEnabled = true;

redisClient.set('available_seats', TOTAL_SEATS);

app.get('/available_seats', (req, res) => {
  redisClient.get('available_seats', (err, seats) => {
    if (err) {
      return res.status(500).json({ error: 'Could not check seats' });
    }
    res.json({ numberOfAvailableSeats: parseInt(seats, 10) });
  });
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }

  redisClient.get('available_seats', (err, seats) => {
    const availableSeats = parseInt(seats, 10);

    if (availableSeats > 0) {
      redisClient.set('available_seats', availableSeats - 1);

      if (availableSeats - 1 === 0) {
        reservationEnabled = false;
      }

      res.json({ status: 'Seat reserved successfully' });
    } else {
      res.json({ status: 'No seats available' });
    }
  });
});

app.listen(port, () => {
  console.log(`Seat reservation server running on port ${port}`);
});