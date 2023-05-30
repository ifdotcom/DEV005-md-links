#!/usr/bin/env node
const argv = require("yargs")
  .options("v", {
    alias: "validate",
    type: "boolean",
    default: false,
    describe: "Check if the link works or not.",
  })
  .options("s", {
    alias: "stats",
    type: "boolean",
    default: false,
    describe: "Basic statistics about the links.",
  }).argv;

const { mdLinks } = require("./index");
// console.log(argv)
const input = argv._[0];
const validate = argv.validate;
const stats = argv.stats;
const objOptions = { validate, stats };
// console.log(input);
// console.log(argv);
// console.log(argv.validate);
// console.log(argv.stats);

mdLinks(input, objOptions)
  .then((res) => {
    
    return console.log(res);
  })
  .catch((err) => {
    return console.log(err);
  });
