const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('useUnifiedTopology', true );
mongoose.set('useNewUrlParser', true );

mongoose.connect('mongodb://localhost:27017/todolistDB');


const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
  name: 'welcome to my todo List'
});

const item2 = new Item({
  name: 'hit + button to add a new item'
});

const item3 = new Item({
  name: '👈hit this button to erase an item'
});

const defaultItem = [item1, item2, item3];

Item.insertMany(defaultItem, (err) => err ? console.log(err) : console.log('default items is pretty saved'))

app.get('/', (req, res) => {
  res.render('list', {listTitle: 'Today', newListItems: items})
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