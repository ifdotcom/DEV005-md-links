const mdLinks = (route, options) => {
  return new Promise((resolve, reject) => {
    if (route) {
      resolve({ route, options });
    } else {
      reject("something bad happened");
    }
  });
};

module.exports = { mdLinks };
