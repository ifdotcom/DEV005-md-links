// funcion para validar ruta
const path = require('path');
const argv = require('yargs')
  .options('v', {
    alias: 'validate',
    type: 'boolean',
    default: false,
  })
  .options('s', {
    alias: 'stats',
    type: 'boolean',
    default: false,
  }).argv;

const { mdLinks } = require('.');

const input = argv._[0];

// console.log(input);
// console.log(argv);
// console.log(argv.validate);

mdLinks(input)
  .then((res) => {
    const routeUser = res.route;
    const routeAbsolute = path.isAbsolute(routeUser);
    if (!routeAbsolute) {
      path.resolve(routeUser);
    }
    return routeUser;
  })
  .catch((err) => {
    return console.log(err);
  });
