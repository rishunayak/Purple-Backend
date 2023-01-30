const express=require("express")
const app=express.Router()
const authentication = require("../Middleware/authentication");
const Order = require("../Models/order.model");
const admin = require("../Middleware/admin");
app.use(authentication)

app.get("/",async(req,res)=>
{
    try
    {
        const getData=await Order.findOne({id:req.body.id}).populate("products.product").populate("id")
        res.send(getData)
    }
    catch(e)
    {
        res.send("error")
    }
   
})


app.post("/done",async(req,res)=>
{
    const {id,item}=req.body

    try
    {
        const exist=await Order.findOne({id:id})
        if(exist)
        {
            exist.products=[...exist.products,...item];
            
            try
            {
                await Order.findOneAndUpdate({_id:exist._id},exist)
                res.send({msg:"Order Placed Successfully"});
            }
            catch(e)
            {
                res.send(e)
            }
            
        }
        else
        {
            try
            {
                await Order.create({id,products:item})
                res.send({msg:"Order Placed Successfully"});
            }
            catch(e)
            {
                res.send(e)
            }
            
        }
    }
    catch(e)
    {
        res.send(e)
    }
    
   
})


app.use(admin)

app.get("/singleUser/:id",async(req,res)=>
{
    try
    {
       const data=await Order.findOne({id:req.params.id}).populate("id")
       res.send(data)
    }
    catch(e)
    {
        res.send(e)
    }
})


app.get("/all",async(req,res)=>
{
    try
    {
        const data=await Order.find()
        res.send(data)
    }
    catch(e)
    {
        res.send(e)
    }
})

module.exports=app