const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const postcssMixins = require('postcss-mixins');
const postcssNested = require('postcss-nested');

const config = {
    plugins: [
        postcssMixins(),
        postcssNested(),
        autoprefixer(),
        postcssPresetEnv()
    ]
}

module.exports = config