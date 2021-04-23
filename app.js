//jshint esversion:6
// // ============== initialisation ============== //
const express = require("express");
const mongoose = require('mongoose')
// const bodyParser = require("body-parser");
// used in previous versions of express- where
// the urlencoded function was not native
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({extended:true}))
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

// ============== mongoose db initialisation ============== //
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology: true});

// ======= schema ======== //
const todolist_schema = new mongoose.Schema({
  name: String
})
const custom_schema = new mongoose.Schema({
  name: String,
  items:[todolist_schema]
})

// ====== model ===== //
const Item = mongoose.model("Item",todolist_schema)
const List = mongoose.model("list",custom_schema)
// =========== init items ========= //

const item1 = new Item({
  name: 'this is your todo List!'
})
const item2 = new Item({
  name: 'click the plus to add new itm'
})
const item3 = new Item({
  name: "meditate"
})
 const defaultitems = [item1,item2,item3];
// item1.save((err,item)=>{
//   if(err){
//     console.log(err)
//   }else{
//     console.log(item.name + 'successfully added to db')
//   }
// })

// ============== get req ============== //

app.get("/", function(req, res) {
  // day of the week - title //
  const day = date.getDate();
  // if statement to check if there's any items in the list
  Item.find(function(err,items){
      if(err){
        console.log(err)
      }else{
        if(items.length==0){
          Item.insertMany(defaultitems,(err)=>{

            if(err){
              console.log(err)
            }else{
              res.redirect('/')
            }
          })
        }else{
          res.render("list", {listTitle: day, newListItems: items});
        }
      }
})


});

// ============== post req ============== //
app.post("/", function(req, res){

  const item_ = req.body.newItem;
  if(item_ === null){
    item_ = " "
  }
  const item = new Item({
    name : item_
  })
  item.save((err,item)=>{
    if(err){
      console.log(err)
    }else{
      console.log(item.name + ' successfully added to db')
    }
  })

  res.redirect('/')

});

// =============== delete post req ============ //
app.post("/delete",(req,res)=>{
  console.log(req.body)
  const delitem = req.body.check;
  Item.deleteOne({name:delitem},(err)=>{
    if(err){
      console.log(err)
    }else{
      console.log('successfully deleted ' + delitem)
    }
  })
  res.redirect("/");


});
// ============== work get req ============== //
app.get('/:custom',(req,res)=>{
  route = req.params.custom;

  // List.find((err,listitems)=>{
  //   if(listitems.length === 0){
  //     List.insertMany([item1,item2,item3],(err)=>{
  //       if(err){
  //         console.log(err)
  //       }else{
  //         res.render('custom',{listTitle:list ,newListItems:listitems})
  //       }
  //     })
  //   }else{
  //     res.render('custom',{listTitle:list ,newListItems:listitems})
  //   }
  // })

  const list = new List({
    name: route,
    items: defaultitems
  })
  list.save()
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
