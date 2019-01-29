const express = require('express');
const mongoose = require('mongoose');

//routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//DB config
const db = require('./config/keys').mongoURI;
//connect to mongoDB
mongoose
    .connect(
        db,
        {useNewUrlParser: true},
    )
    .then(() => console.log('mongoDB is connect'))
    .catch(err => console.log(err));

//use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('Hello'));

app.listen(port, () => console.log(`Server is running on port${port}`));
