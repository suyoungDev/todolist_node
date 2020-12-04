const express = require('express');
const bodyParser = require('body-parser');

const app = express();

let items =[];
let workItems = [];

app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  let today = new Date();
  const options = { 
    month: 'long', 
    day:'numeric',
    weekday: 'short', 
  };

  let todayDetail = today.toLocaleDateString('ko-KR', options)

  res.render('index', {listTitle: todayDetail, newListItems: items})
  // index.ejs 에서 변수 kindOfDay 변경하여 렌더
  // res.sendFile과 비슷하지만 좀 다름!
  // index.ejs의 html과 비슷한 파일양식이지만 암튼 그안의 데이터를 변경가능함
});

app.post('/', (req, res) => {
  let item = req.body.newItem;

  if (req.body.list === 'Work'){
    workItems.push(item);
    res.redirect('/work');   
  } else {
    items.push(item);
    res.redirect('/');
  }
});



app.get('/work', (req, res)=>{
  res.render('index', {listTitle: 'Work List', newListItems: workItems})
});

app.post('/work', (req, res)=>{
  let item = req.body.newItem;

  if (req.body.list === 'Work'){
    workItems.push(item);
    res.redirect('/work');    
  } else {
    items.push(item);
    res.redirect('/');
  }
});


app.get('/about', (req, res) => {
  res.render('about')
});


app.listen(3000, () => {
  console.log('server started on port 3000');
});