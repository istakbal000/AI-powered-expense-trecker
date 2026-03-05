const expence = require('../database/expence.js');

const expenseadd = async (req, res) => {
    try {
        console.log('Adding expense - User:', req.user);
        console.log('Request body:', req.body);
        
        const { description, amount, category, currency } = req.body;
        
        if (!description || !amount || !category) {
            return res.status(400).json({ 
                success: false,
                error: "All fields are required" 
            });
        }
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                success: false,
                error: "User not authenticated" 
            });
        }
        
        const newExpense = new expence({
            description,
            amount: parseFloat(amount),
            category,
            currency: currency || 'USD',
            userid: req.user.id
        });
        
        await newExpense.save();
        
        res.status(201).json({ 
            success: true,
            message: "Expense added successfully", 
            expense: newExpense 
        });
    }
    catch (err) {
        console.error('Error adding expense:', err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
}

const getallexpence = async (req, res) => {
    try {
        const userid = req.user.id;
        let category = req.query.category || "";
        const done = req.query.done || "";
        const query = { userid };
        if (category.toLowerCase() === "all" || category === "") {
            // No category filter
        } else {
            query.category = { $regex: category, $options: "i" };
        }
        if (done.toLowerCase() === "true") {
            query.done = true;
        } else if (done.toLowerCase() === "false") {
            query.done = false;
        }
        const expenses = await expence.find(query).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const markasdoneorundone = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const { done } = req.body;
        const expense = await expence.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        expense.done = done;
        await expense.save();
        res.status(200).json({ message: "Expense updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteexpence = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const expense = await expence.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        await expense.remove();
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateexpence = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const { description, amount, category, currency } = req.body;
        const expense = await expence.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        // Check if user owns this expense
        if (expense.userid.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }
        expense.description = description || expense.description;
        expense.amount = amount || expense.amount;
        expense.category = category || expense.category;
        expense.currency = currency || expense.currency;
        await expense.save();
        res.status(200).json({ message: "Expense updated successfully", expense });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { expenseadd, getallexpence, markasdoneorundone, deleteexpence, updateexpence };
