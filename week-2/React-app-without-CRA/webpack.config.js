const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/Main.tsx", // change to .ts or .tsx
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "main.js",
  },
  target: "web",
  devServer: {
    port: 3000,
    static: ["./public"],
    open: true,
    hot: true,
    liveReload: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"], // add TypeScript extensions
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/, // handle .js, .jsx, .ts, .tsx
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
};
