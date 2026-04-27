module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind", unstable_transformImportMeta: true }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@/components": "./src/components",
            "@/stores": "./src/stores",
            "@/repositories": "./src/repositories",
            "@/storage": "./src/storage",
            "@/types": "./src/types",
            "@/hooks": "./src/hooks",
            "@/utils": "./src/utils",
            "@/theme": "./src/theme",
          },
        },
      ],
    ],
  };
};
