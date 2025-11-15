const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./data.db");

db.run(`
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    date TEXT
)
`);

app.post("/send", (req, res) => {
    db.run(
        "INSERT INTO messages (text, date) VALUES (?, ?)",
        [req.body.text, new Date().toISOString()],
        () => res.json({ ok: true })
    );
});

app.get("/admin", (req, res) => {
    db.all("SELECT * FROM messages ORDER BY id DESC", (err, rows) => {
        res.json(rows);
    });
});

app.listen(PORT, () => console.log("Server running on " + PORT));
