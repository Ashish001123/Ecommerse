// import mongoose from "mongoose";

// const coupnSchema = new mongoose.Schema(
//   {
//     code: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     discount: {
//       type: Number,
//       required: true,
//     },
//     expirationDate: {
//       type: Date,
//       required: true,
//       min: 0,
//       max: 100,
//         },
//     expirationDate: {
//       type: Date,
//       required: true,
//         },
//     inActive: {
//       type: Boolean,
//       default: false,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//         required: true,
//       unique: true,
//     },
//   },
//   { timestamps: true }
// );

// const Coupn = mongoose.model("Coupn", coupnSchema);

// export default Coupn;



import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
