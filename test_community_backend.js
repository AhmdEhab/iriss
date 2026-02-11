
const BASE_URL = 'http://localhost:5000/api';

async function testBackend() {
    console.log('Starting Backend Verification...');

    try {
        // 1. Create Post
        console.log('\nTesting Create Post...');
        const newPost = {
            authorName: 'TestUser',
            authorEmail: 'test@example.com',
            content: 'This is a test post for verification.',
            type: 'story'
        };
        const createPostRes = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        });
        const createdPost = await createPostRes.json();
        console.log('Create Post Result:', createPostRes.status, createdPost.id ? 'Success' : 'Failed');

        // 2. Get Posts
        console.log('\nTesting Get Posts...');
        const getPostsRes = await fetch(`${BASE_URL}/posts`);
        const posts = await getPostsRes.json();
        console.log('Get Posts Result:', getPostsRes.status, 'Count:', posts.length);
        const foundPost = posts.find(p => p.id === createdPost.id);
        if (foundPost) console.log('✅ Created post found in list.');
        else console.error('❌ Created post NOT found in list.');

        // 3. Create Booking
        console.log('\nTesting Create Booking...');
        const newBooking = {
            specialistId: 1,
            specialistName: 'Dr. Sarah Ahmed',
            childName: 'TestChild',
            parentEmail: 'test@example.com',
            date: '2023-10-27',
            time: '10:00 AM',
            notes: 'Testing booking endpoint',
            status: 'pending'
        };
        const createBookingRes = await fetch(`${BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBooking)
        });
        const createdBooking = await createBookingRes.json();
        console.log('Create Booking Result:', createBookingRes.status, createdBooking.id ? 'Success' : 'Failed');

        // 4. Get Bookings
        console.log('\nTesting Get Bookings...');
        const getBookingsRes = await fetch(`${BASE_URL}/bookings/test@example.com`);
        const bookings = await getBookingsRes.json();
        console.log('Get Bookings Result:', getBookingsRes.status, 'Count:', bookings.length);
        const foundBooking = bookings.find(b => b.id === createdBooking.id);
        if (foundBooking) console.log('✅ Created booking found in list.');
        else console.error('❌ Created booking NOT found in list.');

        console.log('\nVerification Complete.');

    } catch (error) {
        console.error('Verification Failed:', error.message);
        console.log('Make sure the server is running on localhost:5000');
    }
}

testBackend();
