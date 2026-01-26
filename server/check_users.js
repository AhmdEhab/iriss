const User = require('./models/User');
const sequelize = require('./config/database');

async function checkUsers() {
    try {
        await sequelize.authenticate();
        // Console log here might interfere if not careful, but okay to keep simple

        const users = await User.findAll({
            attributes: ['email', 'password', 'name'],
            raw: true
        });

        console.log('JSON_START');
        console.log(JSON.stringify(users, null, 2));
        console.log('JSON_END');

    } catch (error) {
        console.error('DATABASE_ERROR:', error);
    } finally {
        await sequelize.close();
    }
}

checkUsers();
