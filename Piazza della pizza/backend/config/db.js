import { connect } from "mongoose";

async function connectDB(db) {
    await connect(`mongodb://localhost:27017/${db}`)
    console.log("Connected to "+ db); 
}

export {
    connectDB
}
