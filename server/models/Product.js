import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  id:           { type: Number, required: true, unique: true },
  name:         { type: String, required: true },
  flavor:       String,
  subtitle:     String,
  color:        String,
  color2:       String,
  bg:           String,
  tag:          String,
  icon:         String,
  emoji:        String,
  cals:         Number,
  sugar:        String,
  caffeine:     String,
  desc:         String,
  longDesc:     String,
  tags:         [String],
  price:        Number,
  pricePack4:   Number,
  pricePack12:  Number,
  ingredients:  [String],
  nutrition:    {
    servingSize: String,
    calories:    Number,
    totalFat:    String,
    sodium:      String,
    totalCarbs:  String,
    sugar:       String,
    protein:     String,
  },
  inStock:      { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Product', productSchema)
