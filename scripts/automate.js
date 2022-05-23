const { downloadCSVfiles } = require('./getCSVfiles')


// get csv files
const runDownload = downloadCSVfiles()

// // const { downloadCSVfiles } = require('./getCSVfiles')
// const run = downloadCSVfiles()

// const path = require('path')
// const spawn = require("child_process").spawn;
// const pythonProcess = spawn('python',[path.join(__dirname, "main.py"), 2000]);