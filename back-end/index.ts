import cors from "cors";
import mongoose, { ConnectOptions } from 'mongoose';
import express, { Request, Response } from "express";
import Transaction from'./schemas/TRANSACTION';

require('dotenv').config();

//Create Express Server
const app = express();
const port = process.env.PORT;

//Middleware
app.use(cors());
app.use(express.json());

//Connect MongoDatabase
const uri = process.env.MONG_URI as string;
mongoose.connect(uri, { useNewUrlParser: true} as ConnectOptions);
//Check DB connection
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection established successfully!");
});

//Routes
app.get('/', async(req: Request, res: Response) => {
    Transaction.find()
    .then(transactions=> res.json(transactions))
    .catch(err => res.status(400).json("Error: " + err));
    // Another type of ways with async await
    // try {
    //     const transactions = await Transaction.find();
    //     res.json(transactions);
    // } catch (err) {
    //     res.status(400).json({ error: 'Error: ' + err});
    // }
})

app.post('/add', (req: Request, res: Response) => {
    const { title, category, income, outcome, label, value } = req.body;

    const newTransaction = new Transaction ({
        title,
        category,
        income,
        outcome,
        label,
        value
    });

    newTransaction.save()
    .then(()=> res.json("Transaction added!"))
    .catch(err => res.status(400).json("Error: " + err));
} )

app.delete('/:id', (req: Request, res: Response) => {
    Transaction.findByIdAndDelete(req.params.id)
    .then(()=> res.json("Transaction Deleted."))
    .catch(err => res.status(400).json("Error: " + err));
})

//Listening ports
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
}).on("error", (error: Error) => {
    throw new Error(error.message);
})