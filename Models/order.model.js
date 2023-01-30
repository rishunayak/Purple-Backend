const mongoose=require("mongoose");
const Product = require("./product.model");
const User = require("./user.model");

const orderSchema=mongoose.Schema({
    id:{type:mongoose.Schema.Types.ObjectId,ref:User},
    products:[ {product:{type:Object},quantity:Number,date:{type:String,default:new Date()}} ],
})

const Order=mongoose.model("orders",orderSchema)

module.exports=Order;