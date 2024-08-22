import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  name: {
    // Counter name
    type: String,
    required: true,
    unique: true,
  },
  sequence_value: {
    // Counter sequence_value
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model("Counter", CounterSchema);

export default Counter;
