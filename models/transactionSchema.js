import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
_id: { 
type: String,
required: true,
},
 
amount: {
type: Number,
required: true,
},

type: {
type: String,
},
 
category: {
type: String,
},

description: {
type: String,
},

date: {
type: String,
required: true,
},

});

const Transaction = mongoose.model('transaction', TransactionSchema)

export default Transaction;