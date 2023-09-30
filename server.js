const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Parse JSON
app.use(express.json());

// Routing
app.get('/', (req, res) => {
	res.send('Hello, Express!');
});

// Server Start
app.listen(port, () => {
	console.log('Server is running on port ${port}');
});

