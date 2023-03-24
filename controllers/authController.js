const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")


const login = asyncHandler(async(req,res) => {
    const {username,password} = req.body

    if (!username || !password) {
        return res.status(400).json({message:"All fields are req"})
    }

    const foundUser = await User.findOne({username}).exec()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({message:"Unauthorized"})
    }

    const match = await bcrypt.compare(password,foundUser.password)

    if(!match) return res.status(401).json({message:"Unauthorized"})

    const accessToken = jwt.sign(
        {
            "UserInfo":{
                "username":foundUser.username,
                 "roles":foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
    )
    
    const refreshToken = jwt.sign({
    "username":foundUser.username
},
process.env.REFRESH_TOKEN_SECRET,
{expiresIn:"7d"}
)

res.cookie('jwt',refreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:"None",
    maxAge:7*24*60*60*1000
})

res.json({accessToken})
})

const refresh = () =>{
    
}


module.exports = {
    login,
    refresh
}