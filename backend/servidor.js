const express = require('express')
const { writeFile } = require('fs')
const app = express()
const path = require('path')
const fs = require('fs');
app.use(express.json())






app.listen(3000, () => {
    console.log("Servidor iniciado em http://localhost:3000");
})