const express = require('express');
const path = require('path');
const app = express();
const productData = require('./productData.js');
const email = require('emailjs');
const server = email.server.connect({
  user: `${GMAIL_USERNAME}`,
  password: `${GMAIL_PASSWORD}`,
  host: 'smtp.gmail.com',
  ssl: true
});
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'pug');
app.set('views', './public'); //this is reading from public

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/Home.html'));
});

app.get('/Home', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/Home.html'));
});

app.get('/About', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/About.html'));
});

app.get('/Location', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/Location.html'));
});

app.get('/Services', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/Services.html'));
});

app.get('/Products', (req, res) => {
  res.render('ProductPage', { local: productData });
});

app.get('/ProductDetail', (req, res) => {
  res.render('ProductDetailPage', {
    local: {
      item: productData[req.query.item],
      name: req.query.item
    }
  });
});

app.get('/Invoice', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/Invoice.html'));
});

app.post('/Invoice', (req, res) => {
  const emailBody = `From: ${req.body.Name} \n\nReturn Email: ${req.body.FromEmail}\n\nPhone Number: ${req.body
    .Phone} \n\n\n Message: ${req.body.EmailBody}`;

  const email = {
    from: req.body.Name,
    body: emailBody,
    cc: req.body.CCOption ? req.body.FromEmail : '',
    phone: req.body.Phone
  };
  res.sendFile(path.join(__dirname + '/../public/Invoice.html'));
  server.send(
    {
      text: email.body,
      from: `GTRagsupplies <${GMAIL_USERNAME}>`,
      to: `GTRagsupplies <${GMAIL_RECEIVER}>`,
      cc: `${email.cc}`,
      subject: `Invoice request from ${email.FromEmail}`
    },
    (err, message) => {
      if (err) {
        console.log(err);
      }
    }
  );
  res.redirect('/InvoiceSent');
});

app.get('/InvoiceSent', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/InvoiceSent.html'));
});

app.listen(3000, () => {
  console.log('Famars are on the market');
});
