const fs = require("fs");
const path = require("path");

// funcion para validar si la ruta existe

const getFilesMD = (route) => {
  if (fs.existsSync(route)) {
    const validRoute = isRouteAbs(route);
    const arrFiles = readDir(validRoute);
    const filterFilesMD = filterFiles(arrFiles);
    console.log(filterFilesMD);
  } else {
    return console.log("La ruta no existe");
  }
};

// funcion para convertir de relativa a absoluta
const isRouteAbs = (route) => {
  const routeAbsolute = path.isAbsolute(route);
  if (routeAbsolute) {
    return route;
  } else {
    return path.resolve(route);
  }
};

// funcion para validar si es un directorio o un archivo
// la funcion recibe la ruta
// necesito saber si es un directorio o archivo: ¿por la extension?
// metodos:
// eslint-disable-next-line max-len
// # fs.readdir(path[, options], callback) -> Lee el contenido de un directorio. La devolución de llamada obtiene dos argumentos (err, files) donde fileshay una matriz de los nombres de los archivos en el directorio, excluyendo '.'y '..'.
//# fs.stat(path[, options], callback) ->
const arrFiles = [];
const readDir = (route) => {
  // leer directorio -> devuelve arr con todo lo que está dentro del Dir
  const content = fs.readdirSync(route);
  // console.log(content);
  //   recorrer el arr del contenido del dir

  content.forEach((file, index) => {
    // con join se junta el nombre de cada element con la ruta original
    const fileRoute = path.join(route, content[index]);
    const statusFile = fs.lstatSync(fileRoute).isFile();
    // console.log("path: " + fileRoute, "Es archivo?: " + statusFile);
    // guardar cada elemento en el arrFiles: para 15/05/23
    if (statusFile) {
      // guarda un objeto en el arrFiles
      arrFiles.push(fileRoute);
    } else {
      readDir(fileRoute);
    }
  });

  return arrFiles;
};

// // función para filtrar solo los archivos md

const filterFiles = (arr) => {
  if (arr === undefined) {
    return;
  }
  const arrFilesMD = [];
  arr.forEach((element) => {
    if (path.extname(element) === `.md`) {
      arrFilesMD.push(element);
    }
  });
  return arrFilesMD;
};

// // Función para leer archivos MD

// const readFileMD = (arr) =>{
// console.log(arr)
// }

module.exports = { getFilesMD };
