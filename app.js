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

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model('List', listSchema);


app.get('/', (req, res) => {

  Item.find({}, (err, result) => {
    if (result.length === 0){
      Item.insertMany(defaultItem, (err) => err ? console.log(err) : console.log('default items is pretty saved'))
      res.redirect('/');
    } else {
      res.render('index', {listTitle: 'Today', newListItems: result})
    }
  });

});

app.post('/', (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const itemAdded = new Item({
    name: itemName
  });

  if (listName === 'Today'){
    itemAdded.save();
    res.redirect('/');
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(itemAdded);
      foundList.save();
      res.redirect('/' + listName);
    })
  }  
});


app.post('/delete', (req, res) => {
  const itemId = req.body.check;

  Item.findByIdAndRemove(itemId, 
    err => err ? console.log(err) : console.log('deleted'))
  
  res.redirect('/');
})


app.get('/:customListName', (req, res) => {
  const customListName = req.params.customListName;

  List.findOne({name: customListName}, 
    function(err, foundList){
      if (!err){
        if (!foundList){
          // create a new list
          const list = new List({
            name: customListName,
            items: defaultItems
          });
          
          list.save();
          res.redirect('/'+customListName);
          console.log(foundList);

        } else {
          res.render('index', 
            {listTitle: foundList.name, newListItems: foundList.items})
        }
      }
    })
});



app.get('/about', (req, res) => {
  res.render('about')
});


app.listen(3000, () => {
  console.log('server started on port 3000');
});