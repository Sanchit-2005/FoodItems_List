const express = require("express");
const multer = require("multer");
const app = express();
const port = 8080;
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const { v4: uuidv4 } = require("uuid");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

let foods = [
  {
    id: uuidv4(),
    name: "Veg Burger",
    photo: "VegBurger.jpg",
    price: 120,
    category: "Burger",
    available: true,
    rating: 4.3,
    description: "Crispy veg patty with cheese and fresh vegetables.",
  },
  {
    id: uuidv4(),
    name: "Paneer Pizza",
    photo: "PaneerPizza.jpg",
    price: 349,
    category: "Pizza",
    available: true,
    rating: 4.7,
    description: "Loaded with paneer, capsicum, onion, and mozzarella cheese.",
  },
  {
    id: uuidv4(),
    name: "Veg Biryani",
    photo: "VegBiryani.jpg",
    price: 199,
    category: "Rice",
    available: true,
    rating: 4.5,
    description:
      "Aromatic basmati rice served with spicy vegetables and raita.",
  },
  {
    id: uuidv4(),
    name: "Cold Coffee",
    photo: "ColdCoffee.jpg",
    price: 99,
    category: "Beverage",
    available: false,
    rating: 4.2,
    description: "Chilled creamy coffee topped with chocolate syrup.",
  },
  {
    id: uuidv4(),
    name: "Chocolate Brownie",
    photo: "ChocolateBrownie.jpg",
    price: 149,
    category: "Dessert",
    available: true,
    rating: 4.8,
    description: "Warm chocolate brownie served with vanilla ice cream.",
  },
];

app.get("/foodList", (req, res) => {
  res.render("food.ejs", { foods });
});

app.get("/food/new", (req, res) => {
  res.render("form.ejs");
});

app.post("/foods", upload.single("photo"), (req, res) => {
  let { name, price } = req.body;
  let available = req.body.available === "on";
  let photo = req.file ? req.file.filename : "default.jpg";
  
  foods.push({
    id: uuidv4(),
    name,
    photo,
    price,
    available,
  });
  
  res.redirect("/foodList");
});

app.listen(port, () => {
  console.log("listing  you bro ");
});
