var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var generateInvoiceRouter = require('./routes/generateInvoice');
var chooseClientRouter = require('./routes/chooseClient');
var invoiceRouter = require('./routes/invoice');
var previewDownloadRouter = require('./routes/previewDownload');
var download = require('./routes/download');

var app = express();
//setup session
app.use(session({
    'secret': 'lehann',
    resave: true,
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/generateInvoice', generateInvoiceRouter);
app.use('/chooseClient', chooseClientRouter);
app.use('/invoice', invoiceRouter);
app.use('/previewDownload', previewDownloadRouter);
app.use('/download', download);

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

module.exports = app;
