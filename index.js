const express = require("express");
const app = express();
const api = require("./api.js");
const cors = require('cors');

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.use(express.json({ extended: false }));
app.use("/api", api);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
