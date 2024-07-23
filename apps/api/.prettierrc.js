const baseConfig = require('../../.prettierrc.js')

module.exports = {
    ...baseConfig,
    trailingComma: "none",
    overrides: [
        {
            files: "*.ts",
            options: {
                parser: "typescript"
            }
        }
    ]
}