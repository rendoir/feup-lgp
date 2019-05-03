module.exports = {
  components: "./src/components/**/*.{js,jsx,ts,tsx}",
  propsParser: require("react-docgen-typescript/lib/index").withDefaultConfig({
    propFilter: {
      skipPropsWithoutDoc: true
    }
  }).parse,
  theme: {
    maxWidth: "100%",
    sidebarWidth: 250,
    fontFamily: {
      base: [
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol"
      ],
      monospace: [
        "SF Mono",
        "Monaco",
        "Inconsolata",
        "Fira Code",
        "Fira Mono",
        "Droid Sans Mono",
        "Consolas",
        "Roboto Mono",
        "Source Code Pro",
        "monospace"
      ]
    },
    color: {
      link: "#1673b1",
      linkHover: "rgb(70, 69, 171)",
      sidebarBackground: "rgba(246,145,39,.8)",
      errorBackground: "#e22d44"
    }
  },
  sections: [
    {
      name: "Forms",
      components: [
        "src/components/Input/*.tsx",
        "src/components/InputNext/*.tsx",
        "src/components/Radio/Radio.tsx",
        "src/components/Range/Range.tsx",
        "src/components/Select/*.tsx",
        "src/components/Switcher/*.tsx"
      ]
    },
    {
      name: "Buttons",
      components: [
        "src/components/Button/*.tsx",
        "src/components/ButtonNext/*.tsx",
        "src/components/IconButton/*.tsx",
        "src/components/LinkButton/*.tsx",
        "src/components/LinkIconButton/*.tsx"
      ]
    },
    {
      name: "Interface",
      components: [
        "src/components/Avatar/*.tsx",
        "src/components/AvatarSelector/*.tsx",
        "src/components/ImageEdit/ImageEdit.tsx",
        "src/components/ImagePreloader/*.tsx",
        "src/components/Icon/*.tsx",
        "src/components/Modal/Modal.tsx",
        "src/components/Scroller/*.tsx",
        "src/components/Tabs/Tabs.tsx",
        "src/components/Tags/Tag.tsx"
      ]
    },
    {
      name: "Plug & Play Modals",
      components: ["src/components/CreateNewModal/CreateNewModal.tsx"]
    },
    {
      name: "Post",
      components: ["src/components/Comment2/*.tsx"]
    }
  ]
};
