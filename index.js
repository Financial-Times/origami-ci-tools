#!/usr/bin/env node
// This lets us use import/export in the rest of the program
require = require("esm")(module)
module.exports = require("./main.js")
