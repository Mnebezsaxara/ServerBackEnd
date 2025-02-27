import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["field_reservation", "gym_membership"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    // For field reservations
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: function () {
        return this.type === "field_reservation";
      },
    },
    // For gym memberships
    membershipDetails: {
      type: {
        type: String,
        enum: [
          "1month12visits_day",
          "1month12visits",
          "1month_unlimited",
          "6months_unlimited_vip",
          "1year_unlimited",
          "1year_unlimited_women",
          "single_visit",
          "single_visit_trainer",
        ],
      },
      startDate: Date,
      endDate: Date,
      visitsLeft: Number,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
