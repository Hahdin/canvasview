const presets = [
  ["@babel/env", {
    targets: {
      edge: "17",
      firefox: "60",
      chrome: "67",
      safari: "11.1"
    },
    useBuiltIns: "usage"
  }]
];
const plugins = [
  ["@babel/plugin-proposal-class-properties", { "loose": true }]
];
module.exports = { presets, plugins };
