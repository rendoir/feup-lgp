module.exports = {
  components: "./components/**/*.{js,jsx,ts,tsx}",
  propsParser: require("react-docgen-typescript/lib/index").withDefaultConfig({
    propFilter: {
      skipPropsWithoutDoc: true
    }
  }).parse
};
