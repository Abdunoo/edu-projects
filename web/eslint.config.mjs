// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "no-alert": "off",
    "no-undef": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "vue/html-self-closing": "off",
  },
});
