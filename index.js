const express = require("express");
const multer = require("multer");
const fs = require("fs");
const app = express();
const port = 8080;
const path = require("path");



const dataPath = path.join(__dirname, "foods.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const { v4: uuidv4 } = require("uuid");

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Configure multer for file uploads        -He pn nhi mahit mla 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

function loadFoods() {
  try {
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error loading foods.json:", err);
  }
  return [];
}
// (savefood)function  he mahit nahi he shikaycch  aahe ,not know the implemetation pan to save karto edited info aani new item  ,so that server close kelyavr suddha 
// edited aani new item rahayla pahije 
function saveFoods(items) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving foods.json:", err);
  }
}

let foods = loadFoods();

if (foods.length === 0) {
  foods = [
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
      description:
        "Loaded with paneer, capsicum, onion, and mozzarella cheese.",
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
  saveFoods(foods);
}

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

  saveFoods(foods);

  res.redirect("/foodList");
});

app.get("/food/:id",(req,res)=>{
  let {id}=req.params;
  let item =foods.find((p)=>id===p.id);
  res.render("detail",{item});
})


app.get("/food/edit/:id",(req,res)=>{
  let {id}=req.params;
  let item=foods.find((p)=>id===p.id);

  res.render("edit",{item});
})

app.patch("/foods/:id",upload.single("photo"),(req,res)=>{
     console.log(req.body);
     console.log("received the request ")
     let {id}=req.params;
     let { name, price, category, description,rating} = req.body;
      let available=req.body.available==="on";
     
     let item =foods.find((p)=> id===p.id);
      item.name=name;
      item.price=price;
      item.category=category;
      item.available=available;
      item.description= description;
      item.rating=rating;

     

      if(req.file){
        item.photo=req.file.filename;
      }



         saveFoods(foods); 
     res.redirect("/foodList")
})


app.delete("/foods/:id" ,(req,res)=>{
  let {id}=req.params;
  foods=foods.filter((p)=>id!=p.id);
  console.log("deleted the item ");
  saveFoods(foods); 
  res.redirect("/foodList");
})
app.listen(port, () => {
  console.log("listing  you bro ");
});
