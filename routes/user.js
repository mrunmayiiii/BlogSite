const {Router}=require("express");
const router=Router();
const User=require("../models/user")
const multer=require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/users/"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/signin",(req,res)=>{
    return res.render("signin");
});

router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.post("/signup",upload.single("profilePicture"),async(req,res)=>{
    const {fullname,email,password} =req.body;
    await User.create({
    fullname,
    email,
    password,
    profileImageURL:`/users/${req.file.filename}`,

});

return res.redirect("/");

});
router.post("/signin",async(req,res)=>{
      const {email,password} =req.body;
  try {
    
   // console.log("doneee");
    
         const token=await User.matchPasswordAndGenerateToken(email,password);
    // console.log("token",token);
    return res.cookie('token',token).redirect("/");

    
  } catch (error) {
    return res.render("signin",{
        error:"Incorrect Email or Password",
    })
    
  }
});

router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})

module.exports = router;
