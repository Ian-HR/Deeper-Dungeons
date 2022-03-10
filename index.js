const express = require("express");
app = express();
app.use(express.static("public"));
app.use(express.json({limit: "1mb"}));
app.listen(1337, () => console.log("Listening at port 1337"));
