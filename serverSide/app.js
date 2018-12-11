const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const PORT = 3003
var cors = require('cors')
app.use(cors())
// parse application/json
app.use(bodyParser.json())
// ===================== mongoDB ============
const mongoose = require('mongoose')
const CoffeeOrder = require('./schemas/coffeeorder')
mongoose.connect('mongodb://localhost/coffeedb')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("We are connected to the database..")
});

//-----------------to enable CORS-------
app.use(function(req, res, next) {
  //
  // res.header("Access-Control-Allow-Headers: Authorization")
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, Authorization,X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(PORT, function(){
  console.log('Server is running...')
})
//===========================================================
app.post('/add-order',function(req,res){
  let email = req.body.email
  let coffeetype = req.body.coffetype
  let flavor = req.body.flavor
  let size = req.body.size
  let strength = req.body.strength

  let coffee = new CoffeeOrder({email:email,coffeetype:coffeetype,flavor:flavor,size:size,strength:strength})
  coffee.save((error, newCoffee)=>{
    if(error){
      console.log(error)
      res.status(500).json({error: "Unable to post"})
      return
    }
    console.log(newCoffee)
    res.json(newCoffee)

})
})

app.get('/get-orders',function(req,res){
  // find all the documents in the post collection
  CoffeeOrder.find({},(error,orders) => {
    res.json(orders)
  })
})

app.delete('/delete/:id',function(req,res){
 let orderId = req.params.id
CoffeeOrder.findByIdAndDelete(orderId,(error,order)=>{
 if(error) {
    res.status(500).json({error: 'Unable to delete..'})
    return
     }
     res.json({success: true})
  })
})
