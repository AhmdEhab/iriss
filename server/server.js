const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
const Post = require('./models/Post');
const Booking = require('./models/Booking');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const parseSafely = (str, fallback) => {
    try {
        if (!str) return fallback;
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (e) {
        console.error('JSON_PARSE_ERROR:', e.message, 'Value:', str);
        return fallback;
    }
};


app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});


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


app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/api/posts', async (req, res) => {
    try {
        const post = await Post.create(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


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

// --- Booking Routes ---

// Create Booking
app.post('/api/bookings', async (req, res) => {
    try {
        const booking = await Booking.create(req.body);
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Bookings for User
app.get('/api/bookings/:email', async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { parentEmail: req.params.email },
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('DATABASE_SYNC_ERROR:', err);
});
