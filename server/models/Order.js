import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  items: [{
    productId: String,
    name:      String,
    packLabel: String,
    price:     Number,
    qty:       Number,
    icon:      String,
  }],
  shipping: {
    firstName: String,
    lastName:  String,
    email:     String,
    address:   String,
    city:      String,
    state:     String,
    zip:       String,
    country:   String,
  },
  promoCode:              String,
  stripePaymentIntentId:  { type: String, required: true },
  status:                 { type: String, enum: ['pending', 'paid', 'shipped', 'delivered'], default: 'paid' },
  total:                  { type: Number, required: true },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
