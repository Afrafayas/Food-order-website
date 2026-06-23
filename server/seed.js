/**
 * Seed script — run with:  node seed.js
 * from the /server directory.
 */

const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/food-order-db';

// ── Schemas ──────────────────────────────────────────────────────────────────
const CategorySchema = new mongoose.Schema({ name: String, description: String, image: String, isActive: { type: Boolean, default: true } });
const ProductSchema  = new mongoose.Schema({
  name: String, description: String, image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  price: Number, originalPrice: Number,
  discountPercent: { type: Number, default: 0 },
  isOnSale: { type: Boolean, default: false },
  dealTag: { type: String, default: '' },
  stock: { type: Number, default: 50 },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
  dealExpiry: { type: Date, default: null },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product  = mongoose.models.Product  || mongoose.model('Product',  ProductSchema);

// ── Category definitions ──────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Burgers',     description: 'Juicy handcrafted burgers',        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop' },
  { name: 'Pizza',       description: 'Stone-baked artisan pizzas',        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop' },
  { name: 'Pasta',       description: 'Authentic Italian pasta dishes',    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=400&fit=crop' },
  { name: 'Sushi',       description: 'Fresh Japanese sushi & rolls',      image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=400&fit=crop' },
  { name: 'Chicken',     description: 'Grilled & fried chicken dishes',    image: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&h=400&fit=crop' },
  { name: 'Salads',      description: 'Fresh & healthy salad bowls',       image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop' },
  { name: 'Desserts',    description: 'Sweet treats & indulgent desserts', image: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400&h=400&fit=crop' },
  { name: 'Drinks',      description: 'Refreshing beverages & smoothies',  image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop' },
  { name: 'Sandwiches',  description: 'Loaded sandwiches & subs',          image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=400&fit=crop' },
  { name: 'Wraps',       description: 'Flavour-packed wraps & rolls',      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop' },
];

// ── Products per category ─────────────────────────────────────────────────────
const PRODUCTS = (ids) => [

  // ── Burgers ──
  { name: 'Classic Smash Burger',    category: ids['Burgers'],    price: 35, originalPrice: 42, discountPercent: 17, isOnSale: true,  dealTag: 'Best Seller', stock: 80, rating: 4.8, reviewCount: 124, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop', description: 'Double smash patty, American cheese, pickles, special sauce on a brioche bun.' },
  { name: 'Double Cheese Burger',    category: ids['Burgers'],    price: 45, stock: 60, rating: 4.7, reviewCount: 98,  dealTag: 'New Arrival', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=500&fit=crop', description: 'Two beef patties, double cheddar, caramelised onions and house sauce.' },
  { name: 'BBQ Bacon Burger',        category: ids['Burgers'],    price: 52, stock: 45, rating: 4.9, reviewCount: 210, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=500&h=500&fit=crop', description: 'Beef patty, crispy bacon, BBQ sauce, crunchy onion rings and jalapeños.' },
  { name: 'Mushroom Swiss Burger',   category: ids['Burgers'],    price: 42, stock: 50, rating: 4.5, reviewCount: 67,  image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&h=500&fit=crop', description: 'Juicy patty topped with sautéed mushrooms and melted Swiss cheese.' },
  { name: 'Veggie Burger',           category: ids['Burgers'],    price: 32, stock: 40, rating: 4.3, reviewCount: 45,  dealTag: 'New Arrival', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&h=500&fit=crop', description: 'Plant-based patty with avocado, tomato, rocket and chipotle mayo.' },

  // ── Pizza ──
  { name: 'Margherita Pizza',        category: ids['Pizza'],      price: 45, stock: 70, rating: 4.6, reviewCount: 183, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop', description: 'San Marzano tomato, buffalo mozzarella, fresh basil, extra virgin olive oil.' },
  { name: 'Pepperoni Pizza',         category: ids['Pizza'],      price: 55, originalPrice: 65, discountPercent: 15, isOnSale: true, stock: 65, rating: 4.9, reviewCount: 312, dealTag: 'Mega Deal', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop', description: 'Loaded with premium pepperoni slices on a rich tomato base with mozzarella.' },
  { name: 'BBQ Chicken Pizza',       category: ids['Pizza'],      price: 60, stock: 55, rating: 4.7, reviewCount: 156, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop', description: 'Grilled chicken, BBQ sauce, red onions, coriander and smoked mozzarella.' },
  { name: 'Four Cheese Pizza',       category: ids['Pizza'],      price: 58, stock: 50, rating: 4.8, reviewCount: 201, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&h=500&fit=crop', description: 'Mozzarella, gorgonzola, parmesan and ricotta on a creamy white base.' },
  { name: 'Spicy Arrabbiata Pizza',  category: ids['Pizza'],      price: 50, stock: 45, rating: 4.4, reviewCount: 89,  dealTag: 'Limited Time', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&h=500&fit=crop', description: 'Spicy tomato arrabbiata, chillies, olives, capers and mozzarella.' },

  // ── Pasta ──
  { name: 'Spaghetti Carbonara',     category: ids['Pasta'],      price: 42, stock: 60, rating: 4.7, reviewCount: 134, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop', description: 'Spaghetti with creamy egg sauce, guanciale, pecorino and black pepper.' },
  { name: 'Penne Arrabbiata',        category: ids['Pasta'],      price: 38, stock: 65, rating: 4.5, reviewCount: 78,  image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&h=500&fit=crop', description: 'Penne in a fiery tomato and garlic sauce topped with fresh parsley.' },
  { name: 'Fettuccine Alfredo',      category: ids['Pasta'],      price: 45, stock: 50, rating: 4.6, reviewCount: 102, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&h=500&fit=crop', description: 'Silky butter and parmesan sauce coating wide ribbon pasta.' },
  { name: 'Beef Lasagna',            category: ids['Pasta'],      price: 52, stock: 40, rating: 4.8, reviewCount: 167, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&h=500&fit=crop', description: 'Layers of beef ragù, béchamel and fresh pasta sheets baked to perfection.' },
  { name: 'Truffle Mushroom Pasta',  category: ids['Pasta'],      price: 58, stock: 35, rating: 4.9, reviewCount: 89,  dealTag: 'New Arrival', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&h=500&fit=crop', description: 'Tagliatelle with wild mushrooms, truffle oil and aged parmesan shavings.' },

  // ── Sushi ──
  { name: 'Salmon Nigiri (8 pcs)',   category: ids['Sushi'],      price: 65, stock: 45, rating: 4.9, reviewCount: 198, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=500&h=500&fit=crop', description: 'Hand-pressed sushi rice topped with fresh Atlantic salmon and wasabi.' },
  { name: 'Dragon Roll (8 pcs)',     category: ids['Sushi'],      price: 72, stock: 40, rating: 4.8, reviewCount: 145, image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=500&h=500&fit=crop', description: 'Prawn tempura, avocado, topped with sliced avocado and spicy mayo.' },
  { name: 'California Roll (8 pcs)', category: ids['Sushi'],      price: 58, originalPrice: 68, discountPercent: 15, isOnSale: true, stock: 55, rating: 4.6, reviewCount: 223, dealTag: 'Mega Deal', image: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=500&h=500&fit=crop', description: 'Crab meat, cucumber and avocado rolled in nori with tobiko garnish.' },
  { name: 'Tuna Sashimi (10 pcs)',   category: ids['Sushi'],      price: 80, stock: 30, rating: 4.9, reviewCount: 112, dealTag: 'New Arrival', image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&h=500&fit=crop', description: 'Premium bluefin tuna slices served with pickled ginger, wasabi and soy.' },
  { name: 'Rainbow Roll (8 pcs)',    category: ids['Sushi'],      price: 75, stock: 35, rating: 4.7, reviewCount: 91,  image: 'https://images.unsplash.com/photo-1617196034302-fc4e4e5e2e16?w=500&h=500&fit=crop', description: 'California roll topped with assorted fish: salmon, tuna, yellowtail.' },

  // ── Chicken ──
  { name: 'Grilled Chicken Platter', category: ids['Chicken'],    price: 48, stock: 60, rating: 4.6, reviewCount: 134, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&h=500&fit=crop', description: 'Herb-marinated chicken breast, grilled and served with roasted vegetables.' },
  { name: 'Crispy Fried Chicken',    category: ids['Chicken'],    price: 40, originalPrice: 48, discountPercent: 17, isOnSale: true, stock: 70, rating: 4.8, reviewCount: 256, dealTag: 'Mega Deal', image: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=500&h=500&fit=crop', description: 'Southern-style crispy fried chicken with coleslaw and honey dip.' },
  { name: 'Chicken Shawarma',        category: ids['Chicken'],    price: 28, stock: 80, rating: 4.7, reviewCount: 312, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1604906572021-010e8c9f43e5?w=500&h=500&fit=crop', description: 'Marinated chicken strips, garlic sauce, pickles in warm Arabic bread.' },
  { name: 'Buffalo Wings (10 pcs)',  category: ids['Chicken'],    price: 45, stock: 55, rating: 4.5, reviewCount: 178, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop', description: 'Crispy wings tossed in tangy buffalo sauce served with blue cheese dip.' },

  // ── Salads ──
  { name: 'Caesar Salad',            category: ids['Salads'],     price: 32, stock: 55, rating: 4.5, reviewCount: 98,  dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop', description: 'Crisp romaine, croutons, parmesan, anchovies with house Caesar dressing.' },
  { name: 'Greek Salad',             category: ids['Salads'],     price: 30, stock: 60, rating: 4.4, reviewCount: 76,  image: 'https://images.unsplash.com/photo-1543340904-0d1aca4c1ff0?w=500&h=500&fit=crop', description: 'Tomatoes, cucumbers, olives, red onion and feta with oregano dressing.' },
  { name: 'Quinoa Power Bowl',       category: ids['Salads'],     price: 38, stock: 45, rating: 4.7, reviewCount: 89,  dealTag: 'New Arrival', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop', description: 'Tri-colour quinoa, roasted chickpeas, avocado, edamame and tahini dressing.' },
  { name: 'Avocado & Chicken Salad', category: ids['Salads'],     price: 40, stock: 40, rating: 4.8, reviewCount: 123, image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=500&h=500&fit=crop', description: 'Grilled chicken, creamy avocado, cherry tomatoes and citrus vinaigrette.' },

  // ── Desserts ──
  { name: 'Chocolate Lava Cake',     category: ids['Desserts'],   price: 28, stock: 40, rating: 4.9, reviewCount: 201, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=500&fit=crop', description: 'Warm chocolate cake with a molten centre, served with vanilla ice cream.' },
  { name: 'Tiramisu',                category: ids['Desserts'],   price: 32, stock: 45, rating: 4.7, reviewCount: 145, image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&h=500&fit=crop', description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone.' },
  { name: 'NY Cheesecake',           category: ids['Desserts'],   price: 30, stock: 50, rating: 4.8, reviewCount: 178, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&h=500&fit=crop', description: 'Dense and creamy New York cheesecake on a buttery graham cracker crust.' },
  { name: 'Crème Brûlée',           category: ids['Desserts'],   price: 35, stock: 35, rating: 4.6, reviewCount: 89,  dealTag: 'Limited Time', image: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=500&h=500&fit=crop', description: 'Silky vanilla custard with a perfectly caramelised sugar crust.' },
  { name: 'Nutella Pancakes',        category: ids['Desserts'],   price: 25, stock: 55, rating: 4.5, reviewCount: 112, dealTag: 'New Arrival', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop', description: 'Fluffy pancake stack drizzled with Nutella and topped with fresh berries.' },

  // ── Drinks ──
  { name: 'Fresh Orange Juice',      category: ids['Drinks'],     price: 18, stock: 100, rating: 4.6, reviewCount: 98,  image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=500&fit=crop', description: 'Freshly squeezed Valencia oranges, no added sugar, served chilled.' },
  { name: 'Mango Smoothie',          category: ids['Drinks'],     price: 22, stock: 80,  rating: 4.8, reviewCount: 134, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&h=500&fit=crop', description: 'Blended Alphonso mango, yoghurt and a hint of cardamom.' },
  { name: 'Iced Caramel Latte',      category: ids['Drinks'],     price: 20, stock: 90,  rating: 4.7, reviewCount: 167, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=500&fit=crop', description: 'Cold brew espresso, caramel syrup and oat milk over ice.' },
  { name: 'Berry Blast Shake',       category: ids['Drinks'],     price: 25, stock: 70,  rating: 4.5, reviewCount: 89,  dealTag: 'New Arrival', image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&h=500&fit=crop', description: 'Strawberries, blueberries, raspberries blended with frozen yoghurt.' },

  // ── Sandwiches ──
  { name: 'Club Sandwich',           category: ids['Sandwiches'], price: 32, stock: 60, rating: 4.5, reviewCount: 112, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500&h=500&fit=crop', description: 'Triple-decker with chicken, turkey, bacon, lettuce, tomato and mayo.' },
  { name: 'Grilled Cheese Panini',   category: ids['Sandwiches'], price: 28, stock: 55, rating: 4.4, reviewCount: 78,  image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=500&h=500&fit=crop', description: 'Sourdough bread, three-cheese blend, pressed and toasted until golden.' },
  { name: 'BLT Sandwich',            category: ids['Sandwiches'], price: 25, stock: 65, rating: 4.3, reviewCount: 56,  image: 'https://images.unsplash.com/photo-1540189549336-e6e99eb4b2cd?w=500&h=500&fit=crop', description: 'Crispy bacon, iceberg lettuce, tomato and garlic aioli on toasted white.' },
  { name: 'Tuna Melt',               category: ids['Sandwiches'], price: 30, stock: 50, rating: 4.6, reviewCount: 91,  dealTag: 'Limited Time', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=500&fit=crop', description: 'Albacore tuna salad with cheddar, melted under the grill on thick bread.' },

  // ── Wraps ──
  { name: 'Chicken Caesar Wrap',     category: ids['Wraps'],      price: 30, stock: 65, rating: 4.6, reviewCount: 134, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=500&fit=crop', description: 'Grilled chicken, romaine, parmesan and Caesar dressing in a spinach tortilla.' },
  { name: 'Falafel Wrap',            category: ids['Wraps'],      price: 25, stock: 70, rating: 4.5, reviewCount: 89,  image: 'https://images.unsplash.com/photo-1565565601009-e00e49a3c63d?w=500&h=500&fit=crop', description: 'Crispy falafel, hummus, tabbouleh and pickled vegetables in flatbread.' },
  { name: 'Beef Shawarma Wrap',      category: ids['Wraps'],      price: 32, stock: 80, rating: 4.8, reviewCount: 234, dealTag: 'Best Seller', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=500&fit=crop', description: 'Slow-cooked spiced beef, garlic sauce, sumac onions and fries in Arabic bread.' },
  { name: 'Veggie Hummus Wrap',      category: ids['Wraps'],      price: 22, stock: 60, rating: 4.3, reviewCount: 67,  dealTag: 'New Arrival', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=500&fit=crop', description: 'Roasted peppers, courgette, hummus and rocket in a whole-wheat tortilla.' },
];

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Upsert categories
  const catIds = {};
  for (const cat of CATEGORIES) {
    const doc = await Category.findOneAndUpdate(
      { name: cat.name },
      cat,
      { upsert: true, new: true }
    );
    catIds[cat.name] = doc._id;
    console.log(`📁 Category: ${cat.name}`);
  }

  // Insert products (skip duplicates by name)
  const products = PRODUCTS(catIds);
  let added = 0, skipped = 0;
  for (const p of products) {
    const exists = await Product.findOne({ name: p.name });
    if (exists) { skipped++; continue; }
    await Product.create(p);
    console.log(`🍽️  Added: ${p.name}`);
    added++;
  }

  console.log(`\n✅ Done — ${added} products added, ${skipped} already existed.`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
