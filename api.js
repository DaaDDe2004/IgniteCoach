const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// ===== AUTH ROUTES =====
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
            [email, hashedPassword, name]
        );
        
        const token = jwt.sign(
            { userId: result.rows[0].id, email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({ user: result.rows[0], token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            user: { id: user.id, email: user.email, name: user.name },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== WORKOUT ROUTES =====
app.post('/api/workouts/generate', authenticateToken, async (req, res) => {
    try {
        const { goal, equipment, duration, experience } = req.body;
        
        // AI Workout Generation Logic
        const workout = await generateAIWorkout(goal, equipment, duration, experience);
        
        // Save to database
        const result = await pool.query(
            `INSERT INTO workouts (user_id, name, exercises, duration, created_at) 
             VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
            [req.user.userId, workout.name, JSON.stringify(workout.exercises), duration]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/workouts', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM workouts WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/workouts/log', authenticateToken, async (req, res) => {
    try {
        const { workout_id, exercises, duration, notes } = req.body;
        
        const result = await pool.query(
            `INSERT INTO workout_logs (user_id, workout_id, exercises, duration, notes, completed_at) 
             VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
            [req.user.userId, workout_id, JSON.stringify(exercises), duration, notes]
        );
        
        // Check for PRs
        await checkPersonalRecords(req.user.userId, exercises);
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== PROGRESS ROUTES =====
app.get('/api/progress/strength', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT exercise_name, weight, reps, created_at 
             FROM workout_logs 
             WHERE user_id = $1 
             AND created_at > NOW() - INTERVAL '90 days'
             ORDER BY created_at`,
            [req.user.userId]
        );
        
        // Process data for charts
        const chartData = processStrengthData(result.rows);
        res.json(chartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== AI COACH ROUTE =====
app.post('/api/coach/chat', authenticateToken, async (req, res) => {
    try {
        const { message, context } = req.body;
        
        // OpenAI API integration
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert fitness coach AI. Be encouraging, specific, and evidence-based. 
                        User context: ${JSON.stringify(context)}`
                    },
                    { role: 'user', content: message }
                ],
                max_tokens: 300
            })
        });
        
        const data = await response.json();
        res.json({ response: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper functions
async function generateAIWorkout(goal, equipment, duration, experience) {
    // AI logic for workout generation
    const exercises = [];
    const sets = duration <= 30 ? 3 : duration <= 60 ? 4 : 5;
    
    // This would integrate with OpenAI or use algorithmic generation
    return {
        name: `${goal.charAt(0).toUpperCase() + goal.slice(1)} ${equipment} Workout`,
        exercises: exercises,
        duration: duration,
        intensity: experience === 'beginner' ? 'moderate' : 'high'
    };
}

async function checkPersonalRecords(userId, exercises) {
    for (const ex of exercises) {
        const pr = await pool.query(
            `SELECT MAX(weight) as max_weight FROM workout_logs 
             WHERE user_id = $1 AND exercise_name = $2`,
            [userId, ex.name]
        );
        
        if (ex.weight > pr.rows[0].max_weight) {
            await pool.query(
                `INSERT INTO personal_records (user_id, exercise_name, weight, reps, achieved_at)
                 VALUES ($1, $2, $3, $4, NOW())`,
                [userId, ex.name, ex.weight, ex.reps]
            );
        }
    }
}

function processStrengthData(rows) {
    // Aggregate data by exercise and date
    const data = {};
    rows.forEach(row => {
        if (!data[row.exercise_name]) {
            data[row.exercise_name] = [];
        }
        data[row.exercise_name].push({
            date: row.created_at,
            weight: row.weight
        });
    });
    return data;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));