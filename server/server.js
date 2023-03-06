const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config();
const app = express();
const dbConfig = require("./config/dbConfig");
const port = process.env.PORT || 5000;

const userRoute = require("./routes/usersRoute");
const chatsRoute = require("./routes/chatsRoute");
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/chats", chatsRoute);

app.listen(port, () => console.log(`Server ok running on port ${port}`))    