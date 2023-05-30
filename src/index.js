const {
  isRouteAbs,

  readFilesMD,
  stats,
  readDir,
} = require("./functions.js");
const Table = require("cli-table");

const mdLinks = (route, options) => {
  return new Promise((resolve, reject) => {
    // console.log("opciones", options);
    const routeUser = isRouteAbs(route);
    if (routeUser === "error") {
      reject("Error: La ruta no existe");
    }
    const filesMD = readDir(routeUser);
    // const fileContent = readFileMD(filesMD);

    readFilesMD(filesMD)
      .then((res) => {
        // console.log(res)
        // resolve(data.toString());

        const data = res.flat();
        // console.log(obj);
        // console.log(options.validate);
        // console.log(options.stats);
        const table = new Table({
          head: ["URL", "Text", "Route"], // Encabezados de la tabla
          colWidths: [50, 20, 50], // Ancho de las columnas
        });
        const tableValidate = new Table({
          head: ["URL", "Status", "Status Text", "Text", "Route"], // Encabezados de la tabla
          colWidths: [50, 10, 10, 20, 50], // Ancho de las columnas
        });
        const tableStats = new Table({
          head: ["Total", "Unique"], // Encabezados de la tabla
          colWidths: [20, 20], // Ancho de las columnas
        });
        const tableStatsVS = new Table({
          head: ["Total", "Unique", "Broken"], // Encabezados de la tabla
          colWidths: [20, 20, 20], // Ancho de las columnas
        });
        if (options.validate === false && options.stats === false) {
          data.forEach((e) => {
            table.push([e.href, e.text, e.file]);
            // console.log("-----------------")
            // console.log(e.href);
            // console.log(e.text);
            // console.log(e.file);
            // console.log("-----------------");
          });
          resolve(table.toString());
        }
        if (options.validate === true && options.stats === false) {
          data.forEach((e) => {
            tableValidate.push([
              e.href,
              e.status,
              e.statusText,
              e.text,
              e.file,
            ]);
          });
          resolve(tableValidate.toString());
        }
        if (options.stats === true && options.validate === false) {
          const { totalLinks, uniqueLinksArray, _ } = stats(data);
          // console.log("Total enlaces:", totalLinks);
          // console.log("Enlaces únicos:", uniqueLinksArray.length);
          tableStats.push([totalLinks, uniqueLinksArray.length]);

          resolve(tableStats.toString());
        }
        if (options.stats === true && options.validate === true) {
          const { totalLinks, uniqueLinksArray, brokenLinks } = stats(data);
          // console.log("Total enlaces:", totalLinks);
          // console.log("Enlaces únicos:", uniqueLinksArray.length);
          tableStatsVS.push([
            totalLinks,
            uniqueLinksArray.length,
            brokenLinks.length,
          ]);

          resolve(tableStatsVS.toString());
        }
        // resolve(res.flat());
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = { mdLinks };
