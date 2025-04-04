import { cpSync, readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'
import { resolve } from 'path'
import { optimize } from 'svgo'

const DIR = resolve('./')
const SRC_DIR = `${DIR}/src`
const SRC_PUBLIC_DIR = `${SRC_DIR}/public`
const SRC_UNCOMPRESSED_DIR = `${SRC_DIR}/uncompressed`

const IMAGES_DIR = resolve(`${SRC_UNCOMPRESSED_DIR}/svg`)
const FONTS_DIR = resolve(`${SRC_UNCOMPRESSED_DIR}/font`)

const FONT_SOURCE_FILES = [
  {
    files: ['*'],
    fontface: true, // auto generate @fontface css
    formats: ['woff2', 'woff', 'ttf'], // default ['eot','woff2','woff','ttf','svg']
    characters: '0123456789AaÀàÁáÂâÃãÄäBbCcÇçDdEeÈèÉéÊêËëFfGgHhIiÌìÍíÎîÏïJjKkLlMmNnÑñOoÒòÓóÔôÕõÖöPpQqRrSsTtUuÙùÚúÛûÜüVvWwXxyYÝýŸÿZz!@#$%ˆ&*()_+{}":?><`-=[];\'/.,\\|~©®ª°º±«»¿×÷“'
  }
]

const fonts = () => {
  return
  const fontStyles = ['normal', 'italic', 'oblique']
  const fontWeights = {
    thin: 100,
    extralight: 200,
    ultralight: 200,
    light: 300,
    book: 400,
    normal: 400,
    regular: 400,
    roman: 400,
    medium: 500,
    semibold: 600,
    demibold: 600,
    bold: 700,
    extrabold: 800,
    ultrabold: 800,
    black: 900,
    heavy: 900
  }
  const fonts = []
  const fontFamilyFunctions = []
  const fontFunctions = []
  const dicFontFamilyFuncs = {}

  FONT_SOURCE_FILES.forEach((obj, index) => {
    const files = obj.files
    const fontface = obj.fontface
    let formats = obj.formats

    if (!fontface) return

    formats = formats || ['eot', 'woff2', 'woff', 'ttf', 'svg']
  })

  const TARGET_DIR = resolve(`${SRC_PUBLIC_DIR}/font`)
}

const images = async () => {
  const TARGET_DIR = resolve(`${SRC_PUBLIC_DIR}/img`)
  const svgs = glob.sync(`${IMAGES_DIR}/**/*.svg`)

  svgs.forEach(filePath => {
    const newFilePath = `${TARGET_DIR}${filePath.replace(IMAGES_DIR, '')}`
    cpSync(filePath, newFilePath, { recursive: true })
    const result = optimize(readFileSync(filePath, 'utf8'), {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              cleanupIds: false,
              convertColors: false,
              removeViewBox: false,
              mergeStyles: false,
              inlineStyles: false,
              minifyStyles: false,
              collapseGroups: false,
              removeUselessStrokeAndFill: false,
              removeUnknownsAndDefaults: false
            }
          }
        }
      ]
      // js2svg: { pretty: true, indent: 2 }
    })
    writeFileSync(newFilePath, result.data, { encoding: 'utf8' })
  })
}

for (let i = 0; i < process.argv.length; i++) {
  switch (process.argv[i]) {
    case 'fonts':
      fonts()
      break
    case 'images':
      images()
      break
  }
}
