const fs = require("fs");
const path = require("path");
const {
  isRouteAbs,
  readFilesMD,
  getLinks,
  stats,
  readDir,
} = require("./functions.js");

jest.mock("fs");
describe("isRouteAbs", () => {
  test('should return "error" when route does not exist', () => {
    const route = "./test-direc";
    jest.spyOn(fs, "existsSync").mockReturnValue(false);

    const result = isRouteAbs(route);

    expect(result).toBe("error");
    expect(fs.existsSync).toHaveBeenCalledWith(route);
  });

  it("should returns array of objects", (done) => {
    jest.setTimeout(15000);

    getLinks("./test/test-directory/README.md").then((result) => {
      expect(result).toEqual([
        {
          href: "https://github.com/markdown-it/markdown-it",
          text: "markdown-it",
          file: "./test/test-directory/README.md",
          status: 200,
          statusText: "OK",
        },
      ]);
    });
    done();
  });
});
describe("readDir", () => {
  it("returns array of markdown files", () => {
    const route =
      "C:\\Users\\hp\\Documents\\BOOTCAMP LABO\\DEV005-md-links\\test\\test-directory";

    const result = readDir(route);
    expect(result).toStrictEqual([
      "C:\\Users\\hp\\Documents\\BOOTCAMP LABO\\DEV005-md-links\\test\\test-directory\\README.md",
      "C:\\Users\\hp\\Documents\\BOOTCAMP LABO\\DEV005-md-links\\test\\test-directory\\dir1\\README.md",
    ]);
  });

  it("returns empty array", () => {
    const route =
      "C:\\Users\\hp\\Documents\\BOOTCAMP LABO\\DEV005-md-links\\test\\test-directory";

    const result = readDir(route);
    expect(result).toEqual([]);
  });
});
describe("readFilesMD", () => {
  it("should read array with files md", (done) => {
    jest.setTimeout(15000);
    readFilesMD(["./test/test-directory/README.md"]).then((res) => {
      expect(res).toEqual([
        [
          {
            href: "https://github.com/markdown-it/markdown-it",
            text: "markdown-it",
            file: "./test/test-directory/README.md",
            status: 200,
            statusText: "OK",
          },
        ],
      ]);
    });
    done();
  });

  it("should read files MD with empty array", async () => {
    const result = await readFilesMD([]);
    expect(result).toEqual([]);
  });
});
describe("stats", () => {
  it("should show stats with links object", () => {
    const obj = [
      { href: "https://www.google.com", status: 200 },
      { href: "https://www.facebook.com", status: 404 },
      { href: "https://www.twitter.com", status: 200 },
    ];
    const expectedOutput = {
      totalLinks: 3,
      uniqueLinksArray: [
        "https://www.google.com",
        "https://www.facebook.com",
        "https://www.twitter.com",
      ],
      brokenLinks: [{ href: "https://www.facebook.com", status: 404 }],
    };
    expect(stats(obj)).toEqual(expectedOutput);
  });
});
