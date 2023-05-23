const { isRouteAbs, getFilesMD, readFilesMD, showData } = require("./functions.js");

const mdLinks = (route, options) => {
  return new Promise((resolve, reject) => {
    // console.log("opciones", options);
    const routeUser = isRouteAbs(route);
    if (routeUser === "error") {
      reject("Error: La ruta no existe");
    }
    const filesMD = getFilesMD(routeUser);
    // const fileContent = readFileMD(filesMD);

    readFilesMD(filesMD)
      .then((res) => {
        // console.log(res)
        const data = showData(res.flat(), options);
        resolve(data.toString());
        // resolve(res.flat());
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = { mdLinks };
