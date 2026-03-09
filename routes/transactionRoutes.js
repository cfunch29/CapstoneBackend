import express from "express";
import Transaction from "../models/transactionSchema.js";
import auth from "../middleware/authMiddleware.js";
import { check, validationResult } from "express-validator";


const router = express.Router();

// POST: /api/transactions - Create transaction
router.route("/")
.post(auth,
    [
        check("amount", "Amount is required").not().isEmpty(),
        check("amount", "Amount must be a number").isNumeric(),
        check("type", "Type must be income or expense").isIn(["income", "expense"]),
        check("category", "Category is required").not().isEmpty(),
        check("date", "Date is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { amount, type, category, description, date } = req.body;

        try {
            const transaction = new Transaction({
                user: req.user.id, // pulled from JWT via auth middleware
                amount, 
                type, 
                category,
                description,
                date,
            });

            await transaction.save();
            res.json(transaction);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: `❌ Error: ${err.message}` }] });
        }
    }
)

// GET: api/transactions - Get all transactions for logged in user - Private 
.get(auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id })
        .sort({ date: -1 }); //sorts most recent first

        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: `❌ Error: ${err.message}` }] });
    }
});

//GET by id - PUT/DELETE: /api/transactions/:id
router.route("/:id")
.get(auth, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if(!transaction)
            return res.status(404).json({ errors: [{ msg: "Transaction not found" }] });

        // make sure transaction belongs to logged in user
        if (transaction.user.toString() !== req.user.id)
            return res.status(401).json({ errors: [{ msg: "Not authorized" }] });

        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: `❌ Error: ${err.message}` }] });
    }
})

.put(
    auth,
    [
        check("amount", "Amount must be a number").optional().isNumeric(),
        check("type", "Type must be income or expense").optional().isIn(["income", "expense"]),
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { amount, type, category, description, date } = req.body;

        try {
            let transaction = await Transaction.findById(req.params.id);

            if (!transaction)
                return res.status(404).json({ errors: [{ msg: "Transaction not found" }] });

            //make sure transaction belongs to logged in user
            if (transaction.user.toString() !== req.user.id)
                return res.status(401).json({ errors: [{ msg: "Not authorized" }] });

            //build updated fields dynamically
            const updatedFields = {};
            if (amount) updatedFields.amount = amount;
            if (type) updatedFields.type = type;
            if (category) updatedFields.category = category;
            if (description) updatedFields.description = description;
            if (date) updatedFields.date = date;

            transaction = await Transaction.findByIdAndUpdate(
                req.params.id,
                { $set: updatedFields },
                { new: true }
            );

            res.json(transaction);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: `❌ Error: ${err.message}` }] });
        }
    }
)

//DELETE: /api/transactions/:id - Delete transaction - Private 
.delete(auth, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction)
            return res.status(404).json({ errors: [{ msg: "Transaction not found" }] });

        //make sure transaction belongs to logged in user 
        if (transaction.user.toString() !== req.user.id)
            return res.status(401).json({ errors: [{ msg: "Not authorized" }] });

        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ msg: "✅ Transaction deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: `❌ Error: ${err.message}` }] });
    }
});

export default router;