const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('useUnifiedTopology', true );
mongoose.set('useNewUrlParser', true );

mongoose.connect('mongodb+srv://admin-suyoung:test123@cluster0.s2ivj.mongodb.net/todolistDB?retryWrites=true&w=majority');


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
  const checkedItemId = req.body.check;
  const listName = req.body.listName;

  if (listName === 'Today'){
    Item.findByIdAndRemove(checkedItemId, 
      err => err ? console.log(err) : console.log('deleted'));
    res.redirect('/');
  } else {
    List.findOneAndUpdate({name: listName}, 
      {$pull: {items: {_id: checkedItemId}}}, 
      (err, foundList) => err ? console.log(err) : res.redirect('/' + listName))
  }
})


app.get('/:customListName', (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, 
    function(err, foundList){
      if (!err){
        if (!foundList){
          // create a new list
          const list = new List({
            name: customListName,
            items: defaultItem
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


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => console.log('server started'))
