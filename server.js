const express = require ('express')
const app = express ();

const connectDB = require ('./config/db');
app.use(express.json({extended : false}));

const PORT = process.env.PORT || 8888;

app.listen(PORT , () => {console.log(`Server running on ${PORT}`)});

app.get ('/' , (req,res) => {
    res.send('API Running');
})
connectDB();

app.use('/api/users' , require ('./routes/api/users'));
app.use('/api/auth' , require ('./routes/api/auth'));
app.use('/api/profile' , require ('./routes/api/profile'));
app.use('/api/posts' , require ('./routes/api/posts'));