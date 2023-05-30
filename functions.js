// const MarkdownIt = require("markdown-it");
const fetch = require("node-fetch");
// const Table = require("cli-table");
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

const readDir = (route) => {
  const fileStatus = fs.lstatSync(route);
    const isFile = fileStatus ? fileStatus.isFile() : false;
  if (isFile) {
   if (isMarkdownFile(route)) {
     return [route];
   } else {
     return [];
   }
  } else {
    const content = fs.readdirSync(route);
    const subFiles = content
      .map((file) => {
        const filePath = path.join(route, file);
        return readDir(filePath);
      })
      .reduce((result, files) => {
        return result.concat(files);
      }, []);

    return subFiles;
  }
};

const isMarkdownFile = (filePath) => {
  return path.extname(filePath) === ".md";
};

const getLinks = (routeFile) => {
  return new Promise((resolve, reject) => {
    fs.readFile(routeFile, "utf8", (error, data) => {
      if (error) {
        reject("No se encontraron links");
      } else {
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
  return Promise.all(arrLinks);
};

const stats = (obj) => {
  // console.log("stats",obj);
  const totalLinks = obj.length;
  const uniqueLinks = new Set(obj.map((el) => el.href));
  // console.log(uniqueLinks)
  const uniqueLinksArray = Array.from(uniqueLinks);
  const brokenLinks = obj.filter((el) => el.status !== 200);

  return { totalLinks, uniqueLinksArray, brokenLinks };
};

module.exports = {
  isRouteAbs,
  readFilesMD,
  getLinks,
  stats,
  readDir,
};
