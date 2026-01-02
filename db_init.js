const path = require("path");
const fs = require("fs");

const db = require("./db.js");

const createScript = fs.readFileSync(path.join(__dirname, "sql", "create.sql"), "utf8");
const sampleData = fs.readFileSync(path.join(__dirname, "sql", "insert.sql"), "utf8");

db.serialize(() => {
    db.exec(createScript, (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log("Successfully created SQLite database.");
        }
    })

    db.exec(sampleData, (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log("Successfully inserted sample data.");
        }
    })
});

db.close((err) => {
    if (err) {
        console.error("Error closing database:", err.message);
    } else {
        console.log("Database connection closed.");
    }
});