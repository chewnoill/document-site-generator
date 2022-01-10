import contentConfig from "./content-loader.config";

export default {
  ...contentConfig,
  output: {
    ...contentConfig.output,
    filename: "[name].node.js",
  },
  mode: "production" as const,
  target: "node",
};
