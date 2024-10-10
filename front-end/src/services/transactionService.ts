import axios from 'axios';

// Define interface for typescript
interface Transaction {
    title: string;
    category: string;
    income: number;
    outcome: number;
    label: string;
    value: number;
}

async function getAllTransaction(): Promise<Transaction[]> {
    //Fetch all data from backend
    const response = await axios.get('http://localhost:5000');
    return response.data;
}

async function addTransaction(transaction: Transaction): Promise<void> {
    try {
        await axios.post('http://localhost:5000/add', transaction);
    } catch (err) {
        // throw new Error(err.message);
        console.error('Error in main function: ', err);
    }
}

const transactionService = {
    getAllTransaction,
    addTransaction
}

export default transactionService;