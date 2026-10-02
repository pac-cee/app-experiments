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
