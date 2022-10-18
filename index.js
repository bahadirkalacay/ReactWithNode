const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize()); //kimlik doğrulama modülünü başlatır
app.use(passport.session()); // stek nesnesini değiştiren ve şu anda oturum kimliği olan 
                              //(istemci tanımlama bilgisinden) 'kullanıcı' değerini gerçek 
                              //seri durumdan çıkarılmış kullanıcı nesnesine değiştiren başka bir ara katman yazılımıdır.

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
