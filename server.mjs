import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { stringToHash, varifyHash } from "bcrypt-inzi";

const SECRET = process.env.SECRET || "topsecret";

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
  })
);

const mongodbURI =
  process.env.mongodbURI ||
  "mongodb+srv://huzefa1413:murtaza1413@ecommerceapp.fxfigx3.mongodb.net/EcommerceApp";

let products = []; // TODO: connect with mongodb instead

let productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  description: String,
  createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model("products", productSchema);
const userSchema = new mongoose.Schema({
  firstName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});
const userModel = mongoose.model("Users", userSchema);

app.post("/signup", (req, res) => {
  let body = req.body;

  if (!body.firstName || !body.email || !body.password) {
    res.status(400).send({
      message: "Data Missing, Enter Complete Data",
    });
    return;
  }

  req.body.email = req.body.email.toLowerCase();

  // check if user already exist // query email user
  userModel.findOne({ email: body.email }, (err, user) => {
    if (!err) {
      console.log("user: ", user);
      if (user) {
        // user already exist
        console.log("User Already Exist: ", user);
        res.status(400).send({
          message: "User Already Exist, please try a different email",
        });
        return;
      } else {
        // user not already exist
        // bcrypt hash
        stringToHash(body.password).then((hashString) => {
          userModel.create(
            {
              firstName: body.firstName,
              email: body.email,
              password: hashString,
            },
            (err, result) => {
              if (!err) {
                console.log("data saved: ", result);
                res.status(201).send({
                  message: "User is Created",
                });
              } else {
                console.log("db error: ", err);
                res.status(500).send({
                  message: "Server Error in Creating User",
                });
              }
            }
          );
        });
      }
    } else {
      console.log("Database Error: ", err);
      res.status(500).send({ message: "Database Error" });
      return;
    }
  });
});

app.post("/login", (req, res) => {
  let body = req.body;
  body.email = body.email.toLowerCase();

  if (!body.email || !body.password) {
    res.status(400).send({
      message: "Data Missing, Enter Complete Data",
    });
    return;
  }

  // check if user exist
  userModel.findOne(
    { email: body.email },
    "firstName email password",
    (err, user) => {
      if (!err) {
        console.log("user: ", user);

        if (user) {
          // user found
          varifyHash(body.password, user.password).then((isMatched) => {
            console.log("isMatched: ", isMatched);

            if (isMatched) {
              const token = jwt.sign(
                {
                  _id: user._id,
                  email: user.email,
                  iat: Math.floor(Date.now() / 1000) - 30,
                  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                },
                SECRET
              );

              console.log("token: ", token);

              res.cookie("Token", token, {
                maxAge: 86_400_000,
                httpOnly: true,
                // sameSite: true,
                // secure: true
              });

              res.send({
                message: "Login Successfull",
                profile: {
                  email: user.email,
                  firstName: user.firstName,
                  _id: user._id,
                },
              });
              return;
            } else {
              console.log("password did not match");
              res.status(401).send({ message: "Incorrect Password" });
              return;
            }
          });
        } else {
          // user not already exist
          console.log("user not found");
          res.status(401).send({ message: "User Not Found" });
          return;
        }
      } else {
        console.log("db error: ", err);
        res.status(500).send({ message: "Database Error" });
        return;
      }
    }
  );
});

app.post("/logout", (req, res) => {
  res.cookie("Token", "", {
    maxAge: 1,
    httpOnly: true,
  });

  res.send({ message: "Logout successful" });
});

app.use((req, res, next) => {
  console.log("req.cookies: ", req.cookies);

  if (!req?.cookies?.Token) {
    res.status(401).send({
      message: "include http-only credentials with every request",
    });
    return;
  }

  jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
    if (!err) {
      console.log("decodedData: ", decodedData);

      const nowDate = new Date().getTime() / 1000;

      if (decodedData.exp < nowDate) {
        res.status(401);
        res.cookie("Token", "", {
          maxAge: 1,
          httpOnly: true,
        });
        res.send({ message: "token expired" });
      } else {
        console.log("token approved");

        req.body.token = decodedData;
        next();
      }
    } else {
      res.status(401).send("invalid token");
    }
  });
});

app.post("/product", (req, res) => {
  const body = req.body;

  if (!body.name || !body.price || !body.description) {
    res.status(400).send({
      message: "Data Missing, Enter Complete Data",
      added: false,
    });
    return;
  }

  productModel.create(
    {
      name: body.name,
      price: body.price,
      description: body.description,
    },
    (err, saved) => {
      if (!err) {
        res.send({
          message: "Product Added Successfully",
          added: true,
        });
      } else {
        res.status(500).send({
          message: "Server Error in Adding Products",
          added: false,
        });
      }
    }
  );
});

app.get("/products", (req, res) => {
  productModel.find({}, (err, data) => {
    if (!err) {
      res.send({
        message: "All Products Fetched Successfully",
        data: data,
      });
    } else {
      res.status(500).send({
        message: "Server Error in Fetching Products",
      });
    }
  });
});

app.put("/product/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  if (!body.name || !body.price || !body.description) {
    res.status(400).send({
      message: "Data Missing, Enter Complete Data",
      added: false,
    });
    return;
  }

  try {
    let data = await productModel
      .findByIdAndUpdate(
        id,
        {
          name: body.name,
          price: body.price,
          description: body.description,
        },
        { new: true }
      )
      .exec();
    res.send({
      message: "Product Edited Successfully",
      added: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Server Error in Editing Products",
      added: false,
    });
  }
});

app.delete("/product/:id", (req, res) => {
  const id = req.params.id;

  productModel.deleteOne({ _id: id }, (err, deletedData) => {
    console.log("deleted: ", deletedData);
    if (!err) {
      if (deletedData.deletedCount !== 0) {
        res.send({
          message: "Product Deleted Successfully",
        });
      } else {
        res.status(404);
        res.send({
          message: "No Product found with this id: " + id,
        });
      }
    } else {
      res.status(500).send({
        message: "Server Error in Deleting Products",
      });
    }
  });
});

const __dirname = path.resolve();
app.use("/", express.static(path.join(__dirname, "./web/build")));
app.use("*", express.static(path.join(__dirname, "./web/build")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(mongodbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function () {
  //connected
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
