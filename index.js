const express = require('express')
const env = require('dotenv')
env.config({ path : "./config/server.env"})
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const connectDB = require('./config/db')


const app = express();
connectDB()


app.use(cookieParser())
app.use(express.json())

//ROUTES
app.use('/api/auth',authRoute)
app.use('/api',userRoute)

app.listen(process.env.PORT,()=>{
    console.log(`listening on port ${process.env.PORT}`)
})
