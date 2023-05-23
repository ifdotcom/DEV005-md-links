// const MarkdownIt = require("markdown-it");
const fetch = require("node-fetch");
const Table = require("cli-table");
const fs = require("fs");
const path = require("path");

// funcion para convertir de relativa a absoluta
const isRouteAbs = (route) => {
 if (!fs.existsSync(route)) {
   return "error";
 }

 const routeAbsolute = path.isAbsolute(route);
 if (routeAbsolute) {
   return route;
 } else {
   const absolutePath = path.resolve(route);
   return absolutePath;
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

  content.forEach((index) => {
    // con join se junta el nombre de cada element con la ruta original
    const fileRoute = path.join(route, index);
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

// función para filtrar solo los archivos md

const arrFilesMD = [];
const filterFiles = (arr) => {
  if (arr === undefined) {
    return;
  }
  arr.forEach((element) => {
    if (path.extname(element) === `.md`) {
      arrFilesMD.push(element);
    }
  });
  return arrFilesMD;
};

// funcion para validar si la ruta existe

const getFilesMD = (route) => {
  // console.log("getFiles route:", route);
  // const validRoute = isRouteAbs(route);
  // console.log("route, functions.js",route)
  const arrFiles = readDir(route);
  const filterFilesMD = filterFiles(arrFiles);
  // console.log(validRoute);
  console.log(filterFilesMD);
  return filterFilesMD;
};

// Función para leer archivos MD

const getLinks = (routeFile) => {
  return new Promise((resolve, reject) => {
    fs.readFile(routeFile, "utf8", (error, data) => {
      if (error) {
        reject("No se encontraron links");
      }
      const pattern = /\[([^\]]+)\]\((https?:\/\/[\w\-.]+\/?.*)\)/g;
      const contentMD = data.toString();
      const exprMatch = contentMD.match(pattern);

      if (!exprMatch) {
        resolve([]);
      } else {
        const objLinks = exprMatch.map((e) => {
          const [_, text, href] = e.match(
            /\[([^\]]+)\]\((https?:\/\/[\w\-.]+\/?.*)\)/
          );
          // return { href, text, file: routeFile };
          return fetch(href)
            .then((response) => {
              // console.log(response);
              return {
                href,
                text,
                file: routeFile,
                status: response.status,
                statusText:
                  response.ok ||
                  (response.status >= 200 && response.status < 300)
                    ? "OK"
                    : "FAIL",
              };
            })
            .catch((error) => {
              return {
                href,
                text,
                file: routeFile,
                error: error.message,
              };
            });
        });
        Promise.all(objLinks)
          .then((results) => {
            resolve(results);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  });
};
const readFilesMD = (routesfilesMD) => {
  const arrLinks = routesfilesMD.map((file) => {
    return getLinks(file);
  });
  // console.log("arrlinks funct.js", arrLinks);
  // puse el then para ver que daba de resultado, quitar despues de pruebas
  return Promise.all(arrLinks).then((results) => {
    console.log("promise",results); 
    return results;
  });
};

const showData = (obj, options) => {
  // console.log(obj);
  // console.log(options.validate);
  // console.log(options.stats);
  const table = new Table({
    head: ["URL", "Texto", "Ruta del archivo"], // Encabezados de la tabla
    colWidths: [50, 20, 50], // Ancho de las columnas
  });
  if (options.validate === false) {
    obj.forEach((e) => {
      table.push([e.href, e.text, e.file]);
      // console.log("-----------------")
      // console.log(e.href);
      // console.log(e.text);
      // console.log(e.file);
      // console.log("-----------------");
    });
  }
  return table.toString();
};

module.exports = { isRouteAbs, getFilesMD, readFilesMD, showData };
