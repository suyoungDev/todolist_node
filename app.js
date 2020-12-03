const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  let today = new Date().getDate();
  let day;

  switch (today) {
    case 0:
      day = 'Monday'      
      break;
    case 1:
      day = 'Tuesday'      
      break;

    case 2:
      day = 'Wednesday'      
      break;
    
    case 3:
      day = 'Thursday'      
      break;

    case 4:
      day = 'Friday'      
      break;

    case 5:
      day = 'Saturday'      
      break;
    
    case 6:
      day = 'Sunday'      
      break;

    default:
      break;
  }

  res.render('index', {kindOfDay: day})
})

app.listen(3000, () => {
  console.log('server started on port 3000');
})