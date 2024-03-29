const express = require('express');
const app = express();
const PORT = 3001;
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

app.use(express.json());

const cors = require('cors');
const JWT_SECRET = 'secret123';


// CORS configuration for specific origin and credentials
const corsOptions = {
  origin: 'http://localhost:3000', // Specify the origin of your frontend app
  credentials: true, // To allow cookies and authentication data with requests
};

app.use(cors(corsOptions));
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wLB5SAIsTmZ1',
  database: 'hospitaldb'
});

console.log('hi')

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
  }
  console.log('Connected to the database');
});



app.get('/', (req, res) => {
  res.send('Hello from the backend server!');
});

app.post('/register', (req, res) => {
  // Destructure the relevant information from the request body
  const {
    username,
    email,
    password, // Password will be saved as plain text (insecure!)
    phoneNumber,
    dob, // Ensure this is in the format that your DB accepts, e.g., YYYY-MM-DD
    gender,
    address,
    emergencyContactName,
    emergencyContactRelation,
    emergencyContactPhoneNumber,
  } = req.body;

  // Construct the SQL query to insert the new user
  const query = `
    INSERT INTO patient (username, email, password, phoneNumber, dob, gender, address, emergencyContactName, emergencyContactRelation, emergencyContactPhoneNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  // Execute the SQL query
  db.query(query, [
    username,
    email,
    password, 
    phoneNumber,
    dob,
    gender,
    address,
    emergencyContactName,
    emergencyContactRelation,
    emergencyContactPhoneNumber,
  ], (error, results) => {
    if (error) {
      console.error('Error registering new user:', error);
      res.status(500).json({ message: 'Error registering new user', error });
    } else {
      res.status(201).json({ message: 'New user registered', userId: results.insertId });
    }
  });
});


app.post('/login', (req, res) => {
  const { username, password, role } = req.body;

  // SQL query to find the user with the given username and password
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error checking user credentials' });
      return;
    }

    // if (results.length > 0) {
    //   // Consider adding more specific user data or a session token as needed
    //   res.json({ message: 'Login successful', user: { username } });
    // } else {
    //   res.status(401).json({ message: 'Incorrect username or password' });
    // }
    if (results.length > 0) {
      const user = results[0]; // Assuming the first result is the user
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ accessToken: token });
    } else {
      res.status(401).json({ message: 'Incorrect username or password' });
    }
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token invalid

    req.user = user; // Add the decoded user payload to the request object
    next(); // Proceed to the next middleware or route handler
  });
}

app.get('/protected', authenticateToken, (req, res) => {
  // This route is now protected
  res.json({ message: "This is a protected route", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
      res.status(500).json({ message: 'Error querying the database', error });
    } else {
      res.json({ message: 'Database connection is successful', solution: results[0].solution });
    }
  });
});
app.get('/test-cors', (req, res) => {
  res.json({ message: "CORS is configured correctly." });
});
