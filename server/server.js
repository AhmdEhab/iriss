const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
const Post = require('./models/Post');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper for safe JSON parsing
const parseSafely = (str, fallback) => {
    try {
        if (!str) return fallback;
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (e) {
        console.error('JSON_PARSE_ERROR:', e.message, 'Value:', str);
        return fallback;
    }
};

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        let { email, password } = req.body;

        console.log('Login attempt:', { email, passwordIncluded: !!password });

        email = (email || '').trim();
        password = (password || '').trim();

        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.password !== password) {
            console.log('Password mismatch for:', email);
            return res.status(401).json({ error: 'Invalid password' });
        }

        const userData = user.toJSON();
        userData.moduleProgress = JSON.parse(userData.moduleProgress || '{}');
        userData.earnedBadges = JSON.parse(userData.earnedBadges || '[]');
        userData.assessmentResult = JSON.parse(userData.assessmentResult || 'null');
        userData.activities = JSON.parse(userData.activities || '[]');
        userData.dailyTimeSpent = JSON.parse(userData.dailyTimeSpent || '{}');

        res.json(userData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create User (Example)
app.post('/api/users', async (req, res) => {
    try {
        const data = req.body;
        if (data.moduleProgress) data.moduleProgress = JSON.stringify(data.moduleProgress);
        if (data.earnedBadges) data.earnedBadges = JSON.stringify(data.earnedBadges);
        if (data.assessmentResult) data.assessmentResult = JSON.stringify(data.assessmentResult);
        if (data.activities) data.activities = JSON.stringify(data.activities);
        if (data.dailyTimeSpent) data.dailyTimeSpent = JSON.stringify(data.dailyTimeSpent);

        const user = await User.create(data);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Single User
app.get('/api/users/:email', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.params.email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const userData = user.toJSON();
        userData.moduleProgress = JSON.parse(userData.moduleProgress || '{}');
        userData.earnedBadges = JSON.parse(userData.earnedBadges || '[]');
        userData.assessmentResult = JSON.parse(userData.assessmentResult || 'null');
        userData.activities = JSON.parse(userData.activities || '[]');
        userData.dailyTimeSpent = JSON.parse(userData.dailyTimeSpent || '{}');

        res.json(userData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update User Data
app.put('/api/users/:email', async (req, res) => {
    try {
        const data = req.body;
        if (data.moduleProgress) data.moduleProgress = JSON.stringify(data.moduleProgress);
        if (data.earnedBadges) data.earnedBadges = JSON.stringify(data.earnedBadges);
        if (data.assessmentResult) data.assessmentResult = JSON.stringify(data.assessmentResult);
        if (data.activities) data.activities = JSON.stringify(data.activities);
        if (data.dailyTimeSpent) data.dailyTimeSpent = JSON.stringify(data.dailyTimeSpent);

        const [updated] = await User.update(data, {
            where: { email: req.params.email }
        });

        if (updated) {
            const updatedUser = await User.findOne({ where: { email: req.params.email } });
            const result = updatedUser.toJSON();
            result.moduleProgress = parseSafely(result.moduleProgress, {});
            result.earnedBadges = parseSafely(result.earnedBadges, []);
            result.assessmentResult = parseSafely(result.assessmentResult, null);
            result.activities = parseSafely(result.activities, []);
            result.dailyTimeSpent = parseSafely(result.dailyTimeSpent, {});
            return res.json(result);
        }
        res.status(404).json({ error: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Post Routes ---

// Get All Posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Post
app.post('/api/posts', async (req, res) => {
    try {
        const post = await Post.create(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Like Post
app.put('/api/posts/:id/like', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        post.likes += 1;
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Users (Example)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sync Database and Start Server
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('DATABASE_SYNC_ERROR:', err);
});
