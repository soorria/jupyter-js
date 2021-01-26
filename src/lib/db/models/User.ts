import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
})

const existing = mongoose.models['user']

export const User = existing ? existing : mongoose.model('user', UserSchema)
