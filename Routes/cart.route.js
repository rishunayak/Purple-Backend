const express=require("express")
const bcrypt = require('bcrypt');
const app=express.Router()
const jwt = require('jsonwebtoken');
const authentication = require("../Middleware/authentication");
const Cart = require("../Models/cart.model");
const User = require("../Models/user.model");
const admin = require("../Middleware/admin");

app.use(authentication)

app.get("/",async(req,res)=>
{
    try
    {
        const getData=await Cart.findOne({id:req.body.id}).populate("products.product")
        res.send(getData)
    }
    catch(e)
    {
        res.send(e)
    }
   
})

app.post("/addToCart",async(req,res)=>
{
    const {id,product}=req.body

    try
    {
        const exist=await Cart.findOne({id:id})
        if(exist)
        {

            const check=exist.products.find((ele)=>
            {
                if(ele.product==product.product)
                {
                    ele.quntity=ele.quntity+1;
                    return true
                }
            })
          
            if(check!=undefined)
            {
                try
                {
                    await Cart.findOneAndUpdate({_id:exist._id},exist)
                    res.send({msg:"Updated"})
                }
                catch(e)
                {
                    res.send(e)
                }
                
            }
            else
            {
                exist.products=[...exist.products,product];
                try
                {
                   await Cart.findByIdAndUpdate({_id:exist._id},exist)
                   res.send({msg:"Added To Cart"});
                }
                catch(e)
                {
                    res.send(e)
                }

            }
            
          
            
        }
        else
        {
            try
            {
                await Cart.create({id,products:[product]})
                res.send({msg:"Added To Cart"});
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


app.patch("/delete",async(req,res)=>
{
   //console.log(req.body)
    const id=req.body.id

    try
    {
        await Cart.updateOne({id:id},{$pull:{products:{_id:req.body.productId}}}) 
        res.send({msg:"Delete Successully"})
        
        
    }
    catch(error)
    {
        res.send(error)
    }
    

})


app.patch("/update",async(req,res)=>
{
     
    const {id,quantity,productId}=req.body
    try
    {
        await Cart.updateOne({id:id,"products._id":productId},{$set:{"products.$.quantity":quantity}}) 
        res.send({msg:"Updated Successully"})
       
    }
    catch(error)
    {
       
        res.send(error)
    }
    

})

app.patch("/removeCart",async(req,res)=>
{
    console.log(req.body)
    try
    {
        
        await Cart.findOneAndDelete({_id:req.body.cartId})
        res.send({msg:"Deleted Successfull"})
    }
    catch(e)
    {
        res.send(e)
    }
    
})

app.use(admin)

app.get("/user/:id",async(req,res)=> 
{

    try
    {
       const data=await Cart.findOne({id:req.params.id}).populate("products.product")
       res.send(data)
    }
    catch(e)
    {
        res.send(e)
    }
})



module.exports=app