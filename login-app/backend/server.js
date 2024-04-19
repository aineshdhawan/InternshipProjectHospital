const express = require("express");
const app = express();
const PORT = 3001;
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

app.use(express.json());

const cors = require("cors");
const JWT_SECRET = "secret123";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "wLB5SAIsTmZ1",
  database: "hospitaldb",
});

console.log("hi");

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
  }
  console.log("Connected to the database");
});

app.get("/", (req, res) => {
  res.send("Hello from the backend server!");
});

app.post("/register", (req, res) => {
  const {
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
  } = req.body;

  const query = `
    INSERT INTO patient (username, email, password, phoneNumber, dob, gender, address, emergencyContactName, emergencyContactRelation, emergencyContactPhoneNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  db.query(
    query,
    [
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
    ],
    (error, results) => {
      if (error) {
        console.error("Error registering new user:", error);
        res.status(500).json({ message: "Error registering new user", error });
      } else {
        res
          .status(201)
          .json({ message: "New user registered", userId: results.insertId });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = `
    SELECT users.*, roles.role_name AS roleName 
    FROM users 
    JOIN roles ON users.role_id = roles.role_id
    -- WHERE username='user1' AND password='123';
    WHERE username = ? AND password = ?;
    `;

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error checking user credentials" });
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.roleName,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ accessToken: token });
    } else {
      res.status(401).json({ message: "Incorrect username or password" });
    }
  });
});

// app.post('/login', (req, res) => {
//   const { username, password, role } = req.body;

//   // SQL query to find the user with the given username and password
//   const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
//   db.query(query, [username, password], (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Error checking user credentials' });
//       return;
//     }
//     if (results.length > 0) {
//       const user = results[0]; // Assuming the first result is the user
//       const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

//       res.json({ accessToken: token });
//     } else {
//       res.status(401).json({ message: 'Incorrect username or password' });
//     }
//   });
// });

app.get("/patients/search", (req, res) => {
  const { searchQuery } = req.query;

  const query = `
    SELECT * FROM patients 
    WHERE id = ? OR contact_info LIKE ?;
  `;

  // % partial match
  db.query(query, [searchQuery, `%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error retrieving patient data", error: err });
    }
    res.json(results);
  });
});

app.get("/patients/:patientId", (req, res) => {
  const { patientId } = req.params;
  console.log(`Fetching details for patientId: ${patientId}`);
  const query = "SELECT * FROM patients WHERE id = ?";

  db.query(query, [patientId], (err, results) => {
    console.log(results);
    if (err) {
      console.error("Error fetching patient:", err);
      res.status(500).json({ message: "Error fetching patient details" });
      return;
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  });
});

const updatePatientDetails = (id, { name, contact_info, medical_history }) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE patients 
      SET name = ?, contact_info = ?, medical_history = ?
      WHERE id = ?;
    `;

    db.query(
      query,
      [name, contact_info, medical_history, id],
      (error, results) => {
        if (error) {
          return reject(error);
        } else if (results.affectedRows === 0) {
          return reject(new Error("Patient not found"));
        } else {
          return resolve(results);
        }
      }
    );
  });
};

app.put("/patients/:id", (req, res) => {
  const { id } = req.params;
  const { name, contact_info, medical_history } = req.body;

  console.log(req.body);

  updatePatientDetails(id, { name, contact_info, medical_history })
    .then(() => res.json({ message: "Patient details updated successfully" }))
    .catch((error) =>
      res.status(500).json({ message: "Error updating patient details", error })
    );
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS solution", (error, results, fields) => {
    if (error) {
      res.status(500).json({ message: "Error querying the database", error });
    } else {
      res.json({
        message: "Database connection is successful",
        solution: results[0].solution,
      });
    }
  });
});
app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS is configured correctly." });
});
