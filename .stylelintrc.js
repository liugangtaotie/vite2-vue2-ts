module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  plugins: ["stylelint-scss"],
  rules: {
    // 校验规则略
    "no-empty-source": null, // 允许空的来源
    // 禁止低优先级的选择器出现在高优先级的选择器之后
    "no-descending-specificity": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["function", "if", "each", "include", "mixin"],
      },
    ],
    "rule-empty-line-before": null,
    "no-extra-semicolons": null,
    "at-rule-empty-line-before": null,
    "no-missing-end-of-source-newline": null,
    "selector-list-comma-newline-after": null,
    "font-family-no-missing-generic-family-keyword": null,
    "declaration-block-trailing-semicolon": null,
  },
};
