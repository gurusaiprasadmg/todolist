//jshint esversion:6
// // ============== initialisation ============== //
const express = require("express");
const mongoose = require('mongoose')
const _ = require('lodash')
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

// ====== model ===== //
const Item = mongoose.model("Item",todolist_schema)

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
const inititems = [item1,item2,item3]
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
          Item.insertMany(inititems,(err)=>{

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
  list = req.params.custom;
  // dbname = _.lowerCase(list)+"s";
  // const collections = Object.keys(mongoose.connection.collections);
  // console.log(dbname)
  // if(collections.includes(dbname)){
  //
  // }else:{
  const List = mongoose.model(list,todolist_schema);
  // }
  //
  List.find((err,listitems)=>{
    if(listitems.length === 0){
      List.insertMany(inititems,(err)=>{
        if(!err){
          // res.render('custom',{listTitle:list, newListItems:listitems})
          res.redirect('/'+list)
        }
      })
    }else{
      res.render('custom',{listTitle:list, newListItems:listitems})
    }
  })

})
// ============ custom add post req ================ //

app.post('/:custom',(req,res)=>{
  list = req.params.custom
  const List = mongoose.model(list,todolist_schema);
  const item_ = req.body.newItem;
  if(item_ === null){
    item_ = " ";
  }
  const item = new List({
    name : item_
  });
  item.save((err,item)=>{
    if(err){
      console.log(err)
    }else{
      console.log(item.name + ' successfully added to db')
    }
  })
    res.redirect("/"+list);
})
// ============ custom del post req =============== //
app.post('/:custom/delete',(req,res)=>{
  list = req.params.custom;
  console.log(req.params.check)
  const List = mongoose.model(list,todolist_schema);
  const delitem = req.body.check;
  List.deleteOne({name:delitem},(err)=>{
    if(err){
      console.log(err)
    }else{
      console.log('successfully deleted ' + delitem)
    }
  })
  res.redirect("/"+list);


})







app.listen(4000, function() {
  console.log("Server started on port 4000");
});
