import express from 'express'

const port = process.env.PORT ?? 3000

const app = express()

app.get('/', (req, res)=>{
  res.send('<h1>Hellow World</h1>')
})

app.listen(port, ()=>{
  console.log(`Server running on port ${port}`)
})