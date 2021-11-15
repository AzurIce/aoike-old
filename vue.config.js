module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        asar: false,
        win: {
          target: ["nsis"],
        },
        linux: {
          target: ["pacman"],
        },
      },
    },
  },
};
