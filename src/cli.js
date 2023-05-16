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
  validateRoute,
  readDir,
  filterFiles,
  readFileMD,
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
    if (validateRoute(routeUser)) {
      return routeUser;
    } else {
      return console.log("La ruta no existe");
    }
  })
  .then((res) => {
    const routeUser = res;
    if (routeUser === undefined) {
      return;
    }
    const routeAbsolute = path.isAbsolute(routeUser);
    if (!routeAbsolute) {
      return readDir(path.resolve(routeUser));
    }
    return readDir(routeUser);
  })
  .then((res) => {
    // arr con todos los archivos
    return filterFiles(res);
  })
  .then((res) => {
    // arr con los archivos filtrados (MD)
    readFileMD(res);
  })
  .catch((err) => {
    return console.log(err);
  });
