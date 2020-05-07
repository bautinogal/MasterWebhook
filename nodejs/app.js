const express = require("express")

/* Dependencies */
const app = express()
app.use(express.json())
app.use(cors())

app.post("/webhooks", async(req, res) => {
    if (req.body.action == "created") {
        console.log(`Got a like from ${req.body.sender.login}!`)
    } else {
        console.log(`Like deleted from: ${req.body.sender.login}!`)
    }
    /* Remember to tell the API that we hear them. */
    res.status(200).send("Received!")
})

/* Start server */
const port = process.env.PORT || 5000
app.listen(port)

console.log(`Running on ${port}`)