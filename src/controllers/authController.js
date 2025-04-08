
import db from '../database/db.js';
import bcrypt from 'bcrypt';

export async function loginTraitment(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await db.getUserByEmail(email);
        if (!user) {
            const err = "Invalid email or password";
            return res.redirect(`/login?message=${encodeURIComponent(err)}&status=401`);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = "Invalid email or password";
            return res.redirect(`/login?message=${encodeURIComponent(err)}&status=401`);
        }

        // Successful login
        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.redirect("/login?message=Server%20error&status=500");
    }
}

export async function registerTratment(req,res){
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
}
