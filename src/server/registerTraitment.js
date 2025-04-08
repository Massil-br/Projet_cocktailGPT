const express = require('express');
const router = express.Router();
const db = require("../database/db");
const bcrypt = require('bcrypt');

router.post('/registerTraitment', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Check if all fields are filled
    if (!email || !password || !username || !confirmPassword) {
        return res.status(400).json({ message: 'Please fill in all fields', body: req.body });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // Check if user already exists
        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add new user to the database
        const newUser = await db.addUser(username, email, hashedPassword);

        res.status(201).json({ message: 'Registration successful', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
