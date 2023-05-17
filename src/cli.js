// funcion para validar ruta
const path = require("path");
const argv = require("yargs")
  .options("v", {
    alias: "validate",
    type: "boolean",
    default: false,
  })
  .options("s", {
    alias: "stats",
    type: "boolean",
    default: false,
  }).argv;

const { mdLinks } = require(".");
const {
  getFilesMD
} = require("./functions");

const input = argv._[0];
const validate = argv.validate;
const stats = argv.stats;
const objOptions = { validate, stats };
// console.log(input);
// console.log(argv);
// console.log(argv.validate);
// console.log(argv.stats);

mdLinks(input,objOptions)
  .then((res) => {
    console.log(res)
    const routeUser = res.route;
    getFilesMD(routeUser);
  
  })
  .catch((err) => {
    return console.log(err);
  });
