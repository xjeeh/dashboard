function isBabelJest(caller) {
  return !!(caller && caller.name === "babel-jest");
}

module.exports = function (api) {
  const transpileTests = api.caller(isBabelJest);

  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "12.17.0",
        },
      },
    ],
    "@babel/preset-react",
  ];

  const ignore = ["**/*.test.ts", "**/*.test.tsx", "./src/react-app-env.d.ts"];

  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "inline-react-svg",
    [
      "file-loader",
      {
        name: "[name].[ext]",
        extensions: ["png", "jpg", "jpeg", "gif", "woff", "woff2", "eot", "otf"],
        publicPath: "/",
        outputPath: "/build/common-design/GlobalStyles",
        context: "/src",
        limit: 100000,
      },
    ],
    [],
  ];
  const include = ["src"];
  const compact = true;
  const extensions = [".ts", ".tsx"];
  const sourceMaps = true;

  const configurableOptions = {
    include,
    ignore,
  };

  const standardOptions = {
    presets,
    plugins,
    sourceMaps,
    compact,
  };

  const options = transpileTests ? standardOptions : { ...standardOptions, ...configurableOptions };

  return options;
};
