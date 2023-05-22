const { getFilesMD, readFilesMD } = require("./functions");

const mdLinks = (route, options) => {
  return new Promise((resolve, reject) => {
    console.log("opciones", options);
    const filesMD = getFilesMD(route);
    // const fileContent = readFileMD(filesMD);
   
    if (filesMD === "La ruta no existe") {
      reject("La ruta no existe");
    }
   readFilesMD(filesMD)
     .then((res) => {
       resolve(res.flat());
     })
     .catch((err) => {
       reject(err);
     });
  });
};

module.exports = { mdLinks };
