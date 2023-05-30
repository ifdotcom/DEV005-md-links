const Table = require("cli-table");
const { mdLinks } = require("./index.js");

describe("mdLinks", () => {
  it("return error if route is invalid", () => {
    const route = "./test/test-director";
    const options = { validate: true, stats: false };
    return mdLinks(route, options).catch((err) => {
      expect(err).toBe("Error: La ruta no existe");
    });
  });

  it("return totalm uique and broquen if validate and stats are true", () => {
    const route =
      "C:\\Users\\hp\\Documents\\BOOTCAMP LABO\\DEV005-md-links\\test\\test-directory";
    const options = { validate: true, stats: true };
    return mdLinks(route, options).then((res) => {
      expect(typeof res).toBe("string");
      expect(res.includes("Total")).toBe(true);
      expect(res.includes("Unique")).toBe(true);
      expect(res.includes("Broken")).toBe(true);
    });
  });

  it("return total, unique if recive only stats option", (done) => {
    jest.setTimeout(15000);

    const route =
      "C:\\Users\\hp\\Documents\\BOOTCAMP LABO\\DEV005-md-links\\test\\test-directory";
    const options = { stats: true };
    const expectedOutput = `Total    Unique  
2        2       \n`;
    new Promise((resolve) => {
      mdLinks(route, options).then((result) => {
        expect(result).toEqual(expectedOutput);
        // resolve();
      });
      done();
    });
  });

  // Tests that the function works correctly when an empty options object is provided.
  it("return url, text, rout if options are false", (done) => {
    jest.setTimeout(15000);

    const route =
      "C:\\Users\\hp\\Documents\\BOOTCAMP LABO\\DEV005-md-links\\test\\test-directory";
    const options = {};
    const expectedOutput = `URL                                     Text                Route                     
http://google.com                       google              ${route}\\README.md              
https://github.com/markdown-it/markdown-it                       markdown-it             ${route}\\dir1\\README.md       `;
    new Promise((resolve) => {
      mdLinks(route, options).then((result) => {
        expect(result).toEqual(expectedOutput);
        // resolve();
      });
      done();
    });
  });
});
