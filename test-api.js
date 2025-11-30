const BASE_URL = 'http://localhost:3000';

async function testApi() {
    try {
        console.log('--- Testing API with Auth & History ---');

        let token = null;

        // 1. Login
        console.log('\n1. Testing POST /login');
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com', // Use existing admin user
                password: 'admin123' // You'll need to know the password
            })
        });
        const loginData = await loginRes.json();
        console.log('Status:', loginRes.status);
        console.log('Data:', JSON.stringify(loginData, null, 2));

        if (loginData.success && loginData.data && loginData.data.token) {
            token = loginData.data.token;
            console.log('✓ Login successful, token received');
        } else {
            console.log('✗ Login failed, skipping protected route tests');
            return;
        }

        // 2. GET /user (Protected - should work with token)
        console.log('\n2. Testing GET /user (with auth)');
        const res1 = await fetch(`${BASE_URL}/user`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data1 = await res1.json();
        console.log('Status:', res1.status);
        console.log('Data:', JSON.stringify(data1, null, 2));

        // 3. POST /history (Create measurement)
        console.log('\n3. Testing POST /history');
        const measurementData = {
            decibels: 75.5,
            latitude: 19.4326,
            longitude: -99.1332,
            locationName: 'Ciudad de México'
        };
        const res2 = await fetch(`${BASE_URL}/history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(measurementData)
        });
        const data2 = await res2.json();
        console.log('Status:', res2.status);
        console.log('Data:', JSON.stringify(data2, null, 2));

        // 4. GET /history (Get user's measurements)
        console.log('\n4. Testing GET /history');
        const res3 = await fetch(`${BASE_URL}/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data3 = await res3.json();
        console.log('Status:', res3.status);
        console.log('Data:', JSON.stringify(data3, null, 2));

        // 5. Test protected route without token (should fail)
        console.log('\n5. Testing GET /user (without auth - should fail)');
        const res4 = await fetch(`${BASE_URL}/user`);
        const data4 = await res4.json();
        console.log('Status:', res4.status);
        console.log('Data:', JSON.stringify(data4, null, 2));

        // 6. Test Error Handling (404)
        console.log('\n6. Testing 404');
        const res5 = await fetch(`${BASE_URL}/non-existent`);
        const data5 = await res5.json();
        console.log('Status:', res5.status);
        console.log('Data:', JSON.stringify(data5, null, 2));

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testApi();
