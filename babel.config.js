module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { unstable_transformImportMeta: true }],
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
            "@/i18n": "./src/i18n",
          },
        },
      ],
    ],
  };
};
