// @ts-ignore
module.exports = {
  components: "./components/**/*.{js,jsx,ts,tsx}",
  propsParser: require("react-docgen-typescript").withDefaultConfig({
    propFilter: {
      skipPropsWithoutDoc: true
    }
  }).parse
};
