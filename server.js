// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat');
var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.get('/api', (req, res, next) => {
  req.time = { utc: dayjs().toString(), unix: +dayjs() };
  next();
}, (req, res) => res.json(req.time));

app.get('/api/:date', (req, res, next) => {
  const { date } = req.params;
  if (!dayjs(date).isValid() || !dayjs(parseInt(date)).isValid()) { req.time = { error: "Invalid Date" }; next(); return; }
  isUnix = parseInt(date).toString().length > 5
  req.time = isUnix ? {
    unix: parseInt(date),
    utc: dayjs(parseInt(date)).toString()
  } : {
      unix: dayjs(date).valueOf(),
      utc: dayjs(date).toString()
    };
  next();
}, (req, res) => res.json(req.time));


// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
