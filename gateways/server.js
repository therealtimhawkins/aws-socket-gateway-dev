const express = require("express")
const app = express()
const { send } = require("./socket")

app.use(
  express.json({
    type() {
      return true
    },
  })
)
app.use(
  express.urlencoded({
    extended: false,
    type() {
      return true
    },
  })
)

app.post("/@connections/:id", (req, res) => {
  console.log(req.body)
  const { id } = req.params
  const { data } = req.body
  send(id, data)

  res.status(200).json({ id, data })
})

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.SERVER_PORT}`)
})
