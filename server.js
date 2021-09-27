
const express = require ('express')
const app = express ();

const PORT = process.env.PORT || 8888;

app.listen(PORT , () => {`Server running on ${PORT}`});

app.get ('/' , (req,res) => {
    res.send('API Running');
})