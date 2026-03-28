fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Test User",
    email: `test_${Date.now()}@test.com`,
    password: "password123"
  })
})
  .then(async (res) => {
    const data = await res.json();
    console.log(res.status, data);
  })
  .catch(err => console.error('ERROR:', err));
