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


// app.post('/login', (req, res) => {
//   const { username, password } = req.body; // 

//   const user = users.find(u => u.username === username && u.password === password);
  
//   if (user) {
//     res.json({ message: "Login successful", user: user.username });
//   } else {
//     res.status(401).json({ message: "Incorrect username or password" });
//   }
// });

// app.post('/login',cors(), (req, res) => {
//   // Extract username and password from request body
//   const { username, password } = req.body;

//   // SQL query to find the user with the given username and password
//   const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

//   db.query(query, [username, password], (err, results) => {
//     if (err) {
//       res.status(500).send('Error checking user credentials');
//       return;
//     }

//     if (results.length >0) {
//       res.status(200).send('Login successful');
//     } 
//     else {
//       res.status(401).send('Incorrect username or password');
//     }
//   });
// });

app.post('/login', (req, res) => {
  const { username, password } = req.body;

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
