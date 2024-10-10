import mongoose, { Document, Schema } from 'mongoose';

// Interface used by typescript
interface transactionInterface extends Document {
    title: string;
    category: string;
    income: number;
    outcome: number;
    label?: string;
    value?: number;
}

// Create mongo schema
const transactionSchema = new Schema<transactionInterface>({
    title: { type: String, require: true },
    category: { type: String, require: true },
    income: { type: Number, require: true },
    outcome: { type: Number, require: true },
    label: { type: String, require: true },
    value: { type: String, require: true }
}, { timestamps: true, } )

const Transaction = mongoose.model('Transactions', transactionSchema);

export default Transaction;