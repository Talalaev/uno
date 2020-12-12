//Install express server
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const api = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/uno'));

app.get('/*', function(req,res) {

  res.sendFile(path.join(__dirname+'/dist/uno/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
api.use(express.json())
api.use(cors());
api.options('*', cors());

let games = [];

api.get('/games', function(req,res) {
  res.json(games.map(game => game.game));
});

setInterval(() => {
  games = games.filter(game => {
    return (+(new Date) - game.date) < 1000 * 60 * 10;
  })
}, 1000 * 60 * 11);

api.post('/add-game', function (req, res) {
  const newGame = req.body;
  const isNewGame = !games.find(game => game.game.id === newGame.id);

  if (isNewGame) {
    games.push({date: +(new Date), game: newGame});
  } else {
    games = games.map(game => {
      if (game.game.id === newGame.id) {
        return {date: +(new Date), game: newGame};
      }

      return game;
    });
  }

  res.json({ok: true});
});

api.delete('/finish-game', function (req, res) {
  const newGame = req.body;

  games = games.filter(game => game.game.id !== newGame.id);

  res.json({ok: true});
});

api.delete('/delete-games', function (req, res) {
  games = [];

  res.json({ok: true});
});


api.listen(3000);
