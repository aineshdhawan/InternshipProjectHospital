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
    name,
    email,
    phoneNumber,
    dob,
    gender,
    address,
    emergencyContactName,
    emergencyContactRelation,
    emergencyContactPhoneNumber,
  } = req.body;

  const query = `
    INSERT INTO patient2 (name, email, phoneNumber, dob, gender, address, emergencyContactName, emergencyContactRelation, emergencyContactPhoneNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  db.query(
    query,
    [
      name,
      email,
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
    if (!db || db.state === 'disconnected') {
      return res.status(503).json({ message: "Database is currently unavailable. Please try again later." });
    }

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
  // Initially receive the values from the query parameters
  let { searchQuery, page, pageSize } = req.query;

  // Provide default values and ensure they are integers
  page = parseInt(page || 1, 10);  // Default to 1 if page is undefined or null
  pageSize = parseInt(pageSize || 10, 10);  // Default to 10 if pageSize is undefined or null


  if (page < 1) {
    page = 1;
  }

  // Validate to ensure page and pageSize are positive integers
  page = Math.max(page, 1);  // Ensures page is at least 1
  pageSize = Math.max(pageSize, 1);  // Ensures pageSize is at least 1

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  const query = `
    SELECT * FROM patient2 
    WHERE id = ? OR phoneNumber LIKE ?
    ORDER BY id ASC
    LIMIT ?
    OFFSET ?;
  `;

  // Execute the query with the correct parameters for LIMIT and OFFSET
  db.query(query, [searchQuery, `%${searchQuery}%`, pageSize, offset], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error retrieving patient data", error: err });
    }
    res.json(results);
  });
});

app.get("/patients/:patientId", (req, res) => {
  const { patientId } = req.params;
  console.log(`Fetching details for patientId: ${patientId}`);
  const query = "SELECT * FROM patient2 WHERE id = ?";

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

const updatePatientDetails = (id, { name, email, phoneNumber, dob, gender, address, emergencyContactName, emergencyContactPhoneNumber, emergencyContactRelation}) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE patient2 
      SET name = ?, email = ?, phoneNumber = ?, dob = ?, gender, ?, address = ?, emergencyContactName = ?, emergencyContactRelation = ?, emergencyContactPhoneNumber = ?
      WHERE id = ?;
    `;

    db.query(
      query,
      [name, email, phoneNumber, dob, gender, address, emergencyContactName, emergencyContactPhoneNumber, emergencyContactRelation, id],
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
  const { name, email, phoneNumber, dob, gender, address, emergencyContactName, emergencyContactPhoneNumber, emergencyContactRelation} = req.body;

  console.log(req.body);

  updatePatientDetails(id, { name, email, phoneNumber, dob, gender, address, emergencyContactName, emergencyContactPhoneNumber, emergencyContactRelation })
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

//calcTimeSlot Function

const timeSlots = {
  morning: { start: "09:00:00", end: "12:00:00" },
  evening: { start: "13:00:00", end: "16:00:00" },
};

function addMinutes(time, minutes) {
  const parts = time.split(':');
  const date = new Date();
  date.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10) + minutes, parseInt(parts[2], 10));
  return date.toTimeString().split(' ')[0];
}

function calcTimeSlot(date, timeSlotKey, doctorId, db) {
  return new Promise((resolve, reject) => {
    const slot = timeSlots[timeSlotKey];
    if (!slot) {
      return reject(new Error("Invalid time slot key"));
    }

    const query = `
      SELECT time_slot_start FROM appointments
      WHERE doctor_id = ? AND appointment_date = ? AND time_slot_start >= ? AND time_slot_start < ?
      ORDER BY time_slot_start ASC;
    `;

    db.query(query, [doctorId, date, slot.start, slot.end], (error, results) => {
      if (error) {
        return reject(error);
      }

      let nextAvailableStartTime = slot.start;
      for (const result of results) {
        if (nextAvailableStartTime < result.time_slot_start) {
          break;
        }
        nextAvailableStartTime = addMinutes(result.time_slot_start, 10);
      }
 
      if (nextAvailableStartTime >= slot.end) {
        return reject(new Error("No available slots in the selected time slot"));
      }

      // Calculate endTime by adding 10 minutes to startTime
      const endTime = addMinutes(nextAvailableStartTime, 10);
      resolve({ startTime: nextAvailableStartTime, endTime });
    });
  });
}

app.post("/appointments", async (req, res) => {
  const date = new Date(req.body.date).toISOString().slice(0, 10);
  const { patientId, timeSlot, department, doctorId } = req.body;

  try {
    const { startTime, endTime } = await calcTimeSlot(date, timeSlot, doctorId, db);
    const insertQuery = `
    INSERT INTO appointments (patient_id, appointment_date, time_slot_start, time_slot_end, department, doctor_id)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  db.query(insertQuery, [patientId, date, startTime, endTime, department, doctorId], (insertError, insertResults) => {
    if (insertError) {
      console.error('Error inserting appointment:', insertError);
      return res.status(500).json({ message: 'Error creating appointment', error: insertError });
    }

    res.status(201).json({ message: 'Appointment created successfully', appointmentId: insertResults.insertId });
  });
  } catch (error) {
    console.error("Error creating appointment:", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get('/appointments', (req, res) => {
  const {date} = req.query;

  const query = `
  SELECT appointment_id, doctor_id, doctor_id, 
  DATE_FORMAT(appointment_date, '%Y-%m-%d') AS date,
  time_slot_start, time_slot_end
  FROM appointments
  WHERE appointment_date = ?
  ORDER BY time_slot_start ASC;
  `;

  db.query(query, [date], (error, results) => {
    if (error) {
      console.error('Error fetching appointments:', error);
      return res.status(500).json({ message: 'Error fetching appointments' });
    }
    res.json(results);
  });
});

// GET /api/doctors - Fetches a list of doctors
app.get('/api/doctors', (req, res) => {
  let sqlQuery = 'SELECT id, name, specialty FROM doctors';
  const { name } = req.query;

  if (name) {
      sqlQuery += ' WHERE name LIKE ?';
      db.query(sqlQuery, [`%${name}%`], (error, results) => {
          if (error) {
              res.status(500).send('Error fetching doctors from database');
              return;
          }
          res.json(results);
      });
  } else {
      db.query(sqlQuery, (error, results) => {
          if (error) {
              res.status(500).send('Error fetching doctors from database');
              return;
          }
          res.json(results);
      });
  }
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
