// Simple test script to verify API functionality
// Run with: node test.js (make sure server is running on port 3000)

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsedBody = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsedBody,
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test cases
async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  let createdUserId = null;

  try {
    // Test 1: Create a user
    console.log('Test 1: Creating a user...');
    const createResponse = await makeRequest('POST', '/users', {
      name: 'Test User',
      email: 'test@example.com'
    });
    
    console.log(`Status: ${createResponse.statusCode}`);
    console.log(`Response:`, createResponse.body);
    
    if (createResponse.statusCode === 201 && createResponse.body.id) {
      createdUserId = createResponse.body.id;
      console.log('✅ User creation test passed\n');
    } else {
      console.log('❌ User creation test failed\n');
    }

    // Test 2: Get the created user
    if (createdUserId) {
      console.log('Test 2: Getting user by ID...');
      const getUserResponse = await makeRequest('GET', `/users/${createdUserId}`);
      
      console.log(`Status: ${getUserResponse.statusCode}`);
      console.log(`Response:`, getUserResponse.body);
      
      if (getUserResponse.statusCode === 200 && getUserResponse.body.id === createdUserId) {
        console.log('✅ Get user test passed\n');
      } else {
        console.log('❌ Get user test failed\n');
      }
    }

    // Test 3: Test user not found
    console.log('Test 3: Testing user not found...');
    const notFoundResponse = await makeRequest('GET', '/users/nonexistent-id');
    
    console.log(`Status: ${notFoundResponse.statusCode}`);
    console.log(`Response:`, notFoundResponse.body);
    
    if (notFoundResponse.statusCode === 404) {
      console.log('✅ User not found test passed\n');
    } else {
      console.log('❌ User not found test failed\n');
    }

    // Test 4: Test missing fields validation
    console.log('Test 4: Testing missing fields validation...');
    const missingFieldsResponse = await makeRequest('POST', '/users', {
      name: 'Test User'
      // Missing email
    });
