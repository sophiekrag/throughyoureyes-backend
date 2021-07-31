require("dotenv").config()

const express = require("express")

const app = express()

//setup db 
require('./config/db.config')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', require('./routes/auth.routes'))

// app.get("/", (req, res) => {
//     res.send("Hello There")
// })

app.listen(
    process.env.PORT, 
    console.log(`Server running on port ${process.env.PORT}`)
)