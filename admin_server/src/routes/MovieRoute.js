const express = require('express');
const movieRoute = express();

const MovieController = require('../controllers/MovieController');
const path = require("path");

const bodyParser = require('body-parser');
const Auth = require("../middleware/Auth");
movieRoute.use(bodyParser.json());
movieRoute.use(bodyParser.urlencoded({ extended: true }));

movieRoute.set('view engine', 'pug');
movieRoute.set('views', path.join(__dirname, '../views'))

// movieRoute.get('/movies', (req, res) => {
//     res.render('AddMovie')
// })

movieRoute.get('/movies', MovieController.AllMovies);
movieRoute.get('/movie/:_id', MovieController.FindMovieById);
movieRoute.post('/movie', MovieController.AddMovie);
movieRoute.put('/movie/:_id', MovieController.EditMovie);
movieRoute.delete('/movie/:_id', MovieController.DeleteMovie);
movieRoute.post('/movie/add-link', MovieController.AddMovieByLink);

movieRoute.post('/movie/:_id/rating', MovieController.RatingMovie);

// movieRoute.get('/movie/genres/action', MovieController.FilterActionMovie);
movieRoute.get('/movie/genre/:genre', MovieController.FilterMovie);

module.exports = movieRoute;