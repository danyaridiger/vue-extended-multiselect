module.exports = {
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        useBuiltIns: false,
      },
    ],
  ],
  assumptions: {
    setPublicClassFields: true,
  },
};
