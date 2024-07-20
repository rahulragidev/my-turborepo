const baseConfig = require('../.prettierrc.js');

module.exports = {
    ...baseConfig,
    plugins: ["prettier-plugin-organize-imports"]
}