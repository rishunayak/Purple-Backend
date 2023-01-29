const jwt = require('jsonwebtoken');
const User = require("../Models/user.model");

const admin=(req,res,next)=>
{
    const token=req.headers.token

    jwt.verify(token,"auth",async(err,decorded)=>
    {
        if(err)
        {
            res.send(`Login Frist ${err}`)
        }
        else
        {
            req.body.id=decorded.id  
            const data=await User.findOne({_id:decorded.id})
            if(data.isAdmin)
            {
              next()
            }
            else
            {
                res.send("You are Not Authorized")
            } 
           
       }

    })
}
module.exports=admin