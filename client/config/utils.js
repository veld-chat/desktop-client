/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require("path");
const fs = require("fs");

/**
 * Convert the aliases defined in tsconfig.json to webpack aliases.
 */
exports.getTsAlias = function () {
  const root = join(__dirname, "..");
  const tsconfig = JSON.parse(
    fs.readFileSync(join(root, "tsconfig.json"), "utf-8")
  );

  return Object.keys(tsconfig.compilerOptions.paths).reduce(
    (aliases, aliasName) => {
      let path = tsconfig.compilerOptions.paths[aliasName][0];
      let isAbsolute = true;

      if (aliasName.endsWith("*")) {
        aliasName = aliasName.substr(0, aliasName.length - 1);
        isAbsolute = false;
      }

      if (aliasName.endsWith("/")) {
        aliasName = aliasName.substr(0, aliasName.length - 1);
      }

      if (path.endsWith("*")) {
        path = path.substr(0, path.length - 1);
      }

      if (isAbsolute) {
        aliasName += "$";
      }

      aliases[aliasName] = join(root, `src/${path}`);

      return aliases;
    },
    {}
  );
}
