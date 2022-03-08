var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
const utils = require(__dirname + "/service/utils.js");
var embedToken = require(__dirname + '/service/embedConfigService.js');

var app = express();

/*example*/
app.use('/js', express.static('./node_modules/bootstrap/dist/js/')); // Redirect bootstrap JS
app.use('/js', express.static('./node_modules/jquery/dist/')); // Redirect JS jQuery
app.use('/js', express.static('./node_modules/powerbi-client/dist/')) // Redirect JS PowerBI
app.use('/css', express.static('./node_modules/bootstrap/dist/css/')); // Redirect CSS bootstrap
app.use('/public', express.static('./public/')); // Use custom JS and CSS files


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/getEmbedToken', async function (req, res) {

  // Validate whether all the required configurations are provided in config.json
  configCheckResult = utils.validateConfig();
  if (configCheckResult) {
      return res.status(400).send({
          "error": configCheckResult
      });
  }
  // Get the details like Embed URL, Access token and Expiry
  let result = await embedToken.getEmbedInfo();
  console.log(result.data);

  // result.status specified the statusCode that will be sent along with the result object
  res.status(result.status).send(result);
});

module.exports = app;
