import mongoose from "mongoose";
export function createSessionObject(userId) {
  return {
    name: "",
    roundes: 0,
    participants: [mongoose.Types.ObjectId(userId)],
    score: 0
  };
}
