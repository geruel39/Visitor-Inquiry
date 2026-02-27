const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "geruelalcaraz@gmail.com",
    pass: "vgko hizm lwnr zlmj",
  },
});

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "visit_inquiry",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.get("/api", (req, res) => {
  db.query("SELECT * FROM inquiries", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/api", (req, res) => {
  const { full_name, email, visit_date, purpose } = req.body;
  const sql =
    "INSERT INTO inquiries (full_name, email, visit_date, purpose) VALUES (?, ?, ?, ?)";

  db.query(sql, [full_name, email, visit_date, purpose], async (err, result) => {
    if (err) return res.status(500).json(err);

    try {
      await transporter.sendMail({
        from: "geruelalcaraz@gmail.com",
        to: email,
        subject: "Visit Inquiry Received",
        html: `
          <h3>Hello ${full_name},</h3>
          <p>Your visit request has been received.</p>
          <p><strong>Purpose:</strong> ${purpose}</p>
          <p>Status: Pending</p>
        `,
      });

      res.json({ message: "Saved and Email Sent!" });
    } catch (emailError) {
      console.log(emailError);
      res.json({ message: "Saved but Email Failed" });
    }


    res.json({ message: "Created successfully" });
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM admins WHERE username = ?";

  db.query(sql, [username], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    if (result[0].password !== password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    res.json({ message: "Login successful" });
  });
});

app.put("/api/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql =
    "UPDATE inquiries SET status=? WHERE id=?";

  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json(err);

    db.query(
      "SELECT email, full_name, visit_date, purpose FROM inquiries WHERE id=?",
      [id],
      async (err, user) => {
        if (!err && user.length > 0) {

          const { email, full_name, visit_date, purpose } = user[0];

          await transporter.sendMail({
            from: "geruelalcaraz@gmail.com",
            to: email,
            subject: "Visit Request Status Update",
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h3>Hello ${full_name},</h3>

                <p>Your visit request has been updated. Here are the details:</p>

                <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
                  <tr>
                    <td style="padding: 6px; font-weight: bold;">Visit Date:</td>
                    <td style="padding: 6px;">${visit_date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px; font-weight: bold;">Purpose:</td>
                    <td style="padding: 6px;">${purpose}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px; font-weight: bold;">Current Status:</td>
                    <td style="padding: 6px;">
                      <strong style="
                        color: ${
                          status === "Approved"
                            ? "green"
                            : status === "Rejected"
                            ? "red"
                            : "orange"
                        };
                      ">
                        ${status}
                      </strong>
                    </td>
                  </tr>
                </table>

                <br/>
                <p>Thank you.</p>
              </div>
            `,
          });
        }
      }
    );
    
    res.json({ message: "Updated successfully" });
  });
});

app.delete("/api/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM inquiries WHERE id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted successfully" });
    }
  );
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});