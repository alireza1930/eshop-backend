const express = require('express');
const app = express();

require('dotenv/config');

const api = process.env.API_URL;

// http://localhost:3000/api/v1/products
app.get('/', (req, res)=> {
    res.send('hello from api');
})

app.listen(3000, ()=> {
    console.log(api);
    console.log('serve is running port 3000');
});