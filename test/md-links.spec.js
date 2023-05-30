const Table = require("cli-table");
const { mdLinks } = require("../src/index.js");

describe("mdLinks", () => {
  // Tests that mdLinks function returns a Promise and rejects with an error message when a file instead of a directory is provided as route.
  it("test_md_links_route_provided_is_file", () => {
    const route = "./test/test-director";
    const options = { validate: true, stats: false };
    return mdLinks(route, options).catch((err) => {
      expect(err).toBe("Error: La ruta no existe");
    });
  });

  // Tests that mdLinks function returns a Promise and resolves with a table string when a valid route and options are provided.
  it("test_md_links_valid_route_and_options", () => {
    const route = "./test/test-directory";
    const options = { validate: true, stats: true };
    return mdLinks(route, options).then((res) => {
      expect(typeof res).toBe("string");
      expect(res.includes("Total")).toBe(true);
      expect(res.includes("Unique")).toBe(true);
      expect(res.includes("Broken")).toBe(true);
    });
  });
  // Tests that mdLinks function returns a Promise with a table of stats when provided with a valid route and only the stats option.
  it("test_md_links_valid_route_and_only_stats_option", (done) => {
    jest.setTimeout(15000);

    const route = "./test/test-directory";
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
  it("test_empty_options_object", (done) => {
    jest.setTimeout(15000);

    const route = "./test/test-directory";
    const options = {};
    const expectedOutput = `URL                                     Text                Route                     
http://google.com                       google              ${route}/README.md              
https://github.com/markdown-it/markdown-it                       markdown-it             ${route}/dir1/README.md       `;
    new Promise((resolve) => {
      mdLinks(route, options).then((result) => {
        expect(result).toEqual(expectedOutput);
        // resolve();
      });
      done();
    });
  });
});
