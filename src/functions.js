// funcion para validar si es un directorio o un archivo
const fs = require("fs");
const path = require("path");

const arrFiles = [];

// la funcion recibe la ruta
// necesito saber si es un directorio o archivo: ¿por la extension?
// metodos:
// eslint-disable-next-line max-len
// # fs.readdir(path[, options], callback) -> Lee el contenido de un directorio. La devolución de llamada obtiene dos argumentos (err, files) donde fileshay una matriz de los nombres de los archivos en el directorio, excluyendo '.'y '..'.
//# fs.stat(path[, options], callback) ->
const readDir = (route) => {
  // leer directorio -> devuelve arr con todo lo que está dentro del Dir
  const content = fs.readdirSync(route);
  console.log(content);
  //   recorrer el arr del contenido del dir

  content.forEach((element, index) => {
    const fileRoute = path.join(route, content[index]);
    console.log(fileRoute);
    // guardar cada elemento en el arrFiles: para 15/05/23
  });
  //   fs.lstat(route, (err, stats) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     console.log(stats.isFile());
  //   });
};

module.exports = readDir;
