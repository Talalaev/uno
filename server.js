//Install express server
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const api = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/uno'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json())
app.use(cors());
app.options('*', cors());

let games = [];

app.get('/', function(req,res) {

  res.sendFile(path.join(__dirname+'/dist/uno/index.html'));
});

app.get('/app', function(req,res) {

  res.sendFile(path.join(__dirname+'/dist/uno/index.html'));
});

app.get('/api/games', function(req,res) {
  res.json(games.map(game => game.game));
});

setInterval(() => {
  games = games.filter(game => {
    return (+(new Date) - game.date) < 1000 * 60 * 10;
  })
}, 1000 * 60 * 11);

app.post('/api/add-game', function (req, res) {
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

app.delete('/api/finish-game', function (req, res) {
  const newGame = req.body;

  games = games.filter(game => game.game.id !== newGame.id);

  res.json({ok: true});
});

app.delete('/api/delete-games', function (req, res) {
  games = [];

  res.json({ok: true});
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
