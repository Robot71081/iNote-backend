
const connectToMongo=require('./db')

const express = require('express')
const corsOption ={
    
  origin:["http://localhost:5173","http://localhost:4173",process.env.CLIENT_URL],
  credentials:true

}
const cors = require('cors')

const app = express()
const port = 5000


connectToMongo();
app.use(cors(corsOption))
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('HelloWorld! ')
})

app.listen(port, () => {
  console.log(`iNote Backend listening on port ${port}`)
})