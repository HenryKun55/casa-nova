import nextConfig from "eslint-config-next/core-web-vitals";

const config = [
  ...nextConfig,
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/incompatible-library": "off",
    },
  },
];

export default config;
