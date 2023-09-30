#!/bin/bash

#navigate
cd express-server

# Start the first Express.js instance
node server_1.js &

# Start the second Express.js instance
node server_2.js &

# Start the third Express.js instance
node server_3.js &

echo "All Express.js instances are running."
