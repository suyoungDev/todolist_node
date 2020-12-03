const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  let today = new Date().getDate();

  if (today === 6 || today === 0){
    // 토요일6 이거나 일요일 0 일 경우
    res.send('<h1>its weekend!</h1>');
  } else {
    res.sendFile(__dirname + '/index.html');
  }
})

app.listen(3000, () => {
  console.log('server started on port 3000');
})