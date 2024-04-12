import mysql from "mysql2"

export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"dtgegp314159@Q",
    database:"vtysproje"
})