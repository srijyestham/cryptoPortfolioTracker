const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // You can change the port as needed

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello from Express Backend!');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
