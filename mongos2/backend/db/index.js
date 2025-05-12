let express = require("express");
const cors = require("cors");
require("./config");
let user = require("./user");
let product = require("./product")
let Jwt = require("jsonwebtoken")

let app = express();
app.use(express.json());
app.use(cors());

let jwtkey = "Ayesha"


// Middleware
let verifytoken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(" ")[1]; // remove "Bearer"
        console.log(token);
        Jwt.verify(token, jwtkey, (err, value) => {
            if (err) {
                res.status(401).send({ msg: "Provide valid token" });
            } else {
                next();
            }
        });
    } else {
        res.status(403).send({ msg: "Token is missing" });
    }
};



app.post("/register", async (req, res) => {
  let data = new user(req.body);
  let result = await data.save();
  result = result.toObject();
  delete result.password;
  console.log(result);
  res.send(result);
});
app.post("/create", async (req, res) => {
  let data = new product(req.body);
  let result = await data.save();
  // result = result.toObject();
  console.log(result);
  res.send(result);
});
app.get("/product", async (req, res) => {
  let result = await product.find();
  res.send(result)
  // if(result.length>0){
  //   console.log(result)
  // res.send(result)
  // }else{
  //   res.send("there is no data")
  // }
})
app.put("/products/:id", async (req, res) => {
  let result = await product.updateOne({ _id: req.params.id }, { $set: req.body });
  res.send(result)
})

app.get("/search/:key", async (req, res) => {
  let result = await product.find({
    "$or": [
      { name: { $regex: `^${req.params.key}`, $options: 'i' } },
      { price: { $regex: `^${req.params.key}`, $options: 'i' } },
      { company: { $regex: `^${req.params.key}`, $options: 'i' } },
      { category: { $regex: `^${req.params.key}`, $options: 'i' } },
    ]
  }).limit(20);

  res.send(result);
});

app.get("/products/:id", async (req, res) => {
  let result = await product.findOne({ _id: req.params.id });
  res.send(result)
})

app.delete("/products/:id", async (req, res) => {
  let result = await product.deleteOne({ _id: req.params.id });
  res.send(result)
})



// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.send({ success: false, message: "Email and password are required." });

//   const userRecord = await user.findOne({ email });
//   if (!userRecord) return res.send({ success: false, message: "User not found." });

// Jwt.sign ({user},Jwtkey,{expiresIn:"2h"},(err , token)=>{
//   if (err) {
//     return res.send({ msg: "Something went wrong" });
//   }
//   res.send({ user, token });
// })
//   if (userRecord.password !== password) return res.send({ success: false, message: "Incorrect password." });

//   const { password: pwd, ...userWithoutPassword } = userRecord.toObject();
//   res.send({ success: true, user: userWithoutPassword });
// });
// app.post("/login", async (req, resp) => {
//   if (req.body.password && req.body.email) {
//       let user = await user.findOne(req.body).select("-password");
//       if (user) {
//           // 3rd , if user found then make a token
//           Jwt.sign({user}, jwtkey, {expiresIn:"2h"},(err, tok)=>
//           {
//               if(err)
//               {
//                   resp.send({msg:"Something went wrong, plz try after some time"})
//               }
              
//               resp.send({user, tok})
              
//           })
//       }
//       else {
//           resp.send({ message: "Not Found" });
//       }
//   }
//   else {
//       resp.send({ message: "Not Matched" });
//   }

// })
app.post("/login", async (req, resp) => {
  const { email, password } = req.body;

  if (email && password) {
    let user = await user.findOne({ email: email, password: password }).select("-password");

    if (user) {
      // Generate a JWT token
      Jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.send({ msg: "Something went wrong, please try again later." });
        } else {
          resp.send({ user, token });
        }
      });
    } else {
      resp.send({ message: "User not found" });
    }
  } else {
    resp.send({ message: "Email and password are required" });
  }
});




app.listen(5000, () => {
  console.log("Server running on port 5000");
});