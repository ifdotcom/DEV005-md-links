const mdLinks = (route) => {
  return new Promise((resolve, reject) => {
    if (route) {
      resolve({ route });
    } else {
      reject('something bad happened');
    }
  });
};

module.exports = { mdLinks };
