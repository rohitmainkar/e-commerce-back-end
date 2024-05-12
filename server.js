const express = require('express');
const session = require('express-session');
const routes = require('./routes');
const sequelize = require('./config/connection');
const { UserActivityLog } = require('./models/M_Session');

const app = express();
const PORT = process.env.PORT || 5000;

// Session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  const { sessionID } = req;
  const { method, path, ip } = req;
  const clientId = req.headers['x-client-id']; // Assuming client ID is passed in request headers
  const requestBody = JSON.stringify(req.body); // Convert request body to JSON string

  UserActivityLog.create({
    session_id: sessionID,
    action: `${method} ${path}`,
    client_id: clientId,
    ip_address: ip,
    request_body: requestBody
  }).catch(err => {
    console.error('Error logging user activity:', err);
  });

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// Sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on ${PORT}!`));
});
