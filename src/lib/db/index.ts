import mongoose from 'mongoose'

const connection = { isConnected: 0 }

export const dbConnect = async () => {
  if (connection.isConnected) return

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    })
    connection.isConnected = db.connections[0].readyState
  } catch (err) {
    throw err
  }
}
