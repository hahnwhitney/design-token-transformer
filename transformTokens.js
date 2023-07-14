const StyleDictionary = require('style-dictionary')
const deepMerge = require("deepmerge");
const webConfig = require('./src/web/index.js')

StyleDictionary.registerTransform({
  name: 'size/px',
  type: 'value',
  matcher: token => {
    return (token.unit === 'pixel' || token.type === 'dimension') && token.value !== 0
  },
  transformer: token => {
    return `${token.value}px`
  }
})

StyleDictionary.registerTransform({
  name: 'size/percent',
  type: 'value',
  matcher: token => {
    return token.unit === 'percent' && token.value !== 0
  },
  transformer: token => {
    return `${token.value}%`
  }
})

StyleDictionary.registerFilter({
  name: 'validToken',
  matcher: function(token) {
    return [
      "dimension",
      "string",
      "number",
      "color",
      "custom-spacing",
      "custom-gradient",
      "custom-fontStyle",
      "custom-radius",
      "custom-shadow",
    ].includes(token.type);
  }
})

const StyleDictionaryExtended = StyleDictionary.extend({
  ...deepMerge.all([webConfig]),
  source: ["tokens/*.json"],
  platforms: {
    // For now, we're only exporting our tokens as vanilla CSS;
    // we can easily add back SCSS, LESS, JSON, iOS, Android, etc.
    // in the future if they become necessary.

    // FastStore uses SCSS, but because variables follow CSS custom
    // property (aka, variable) syntax instead of SCSS variable syntax,
    // we export a _variables.css file.
    css: {
      transformGroup: "custom/css",
      buildPath: "build/css/",
      files: [
        {
          destination: "_variables.css",
          format: "css/variables",
          filter: "validToken",
          options: {
            showFileHeader: false,
          },
        },
      ],
    },
  },
});
console.log('StyleDictionaryExtended', StyleDictionaryExtended)


StyleDictionaryExtended.buildAllPlatforms()
