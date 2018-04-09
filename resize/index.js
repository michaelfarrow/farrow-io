const fs = require('fs-extra')
const path = require('path')
const klaw = require('klaw')
const through2 = require('through2')
const sharp = require('sharp')
const async = require('async')
const changeCase = require('change-case')

const SIZE_REGEX = /\-([a-zA-Z\-]+)$/

const ALLOWED_EXTS = [
  'gif',
  'jpeg',
  'jpg',
  'png'
]

const CROP = {
  auto: sharp.strategy.entropy,
  center: sharp.gravity.center,
  top: sharp.gravity.north,
  bottom: sharp.gravity.south,
  right: sharp.gravity.east,
  left: sharp.gravity.west
}

const SIZES = {
  default: [1000, 1000],
  double: [2000, 1000],
  embed: [2000, 1125],
  reference: [160, 160]
}

const METHODS = {}

for (let size in SIZES) {
  const resize = SIZES[size]
  for (let crop in CROP) {
    const strategy = CROP[crop]
    const methodName = []
    if (size !== 'default' || (size === 'default' && crop === 'auto')) methodName.push(size)
    if (crop !== 'auto') methodName.push(crop)
    METHODS[changeCase.camelCase(methodName.join('-'))] = image => {
      image = image.resize.apply(image, resize)
      image = image.crop.call(image, strategy)
      return image
    }
  }
}

const compressJpeg = image => image.jpeg({quality: 70})

const EXT_METHODS = {
  jpg: compressJpeg,
  jpeg: compressJpeg
}

const filterImages = through2.obj(function (item, enc, next) {
  if (item.stats.isFile()) {
    const ext = path.extname(item.path).substring(1).toLowerCase()
    if (ALLOWED_EXTS.includes(ext)) this.push(item)
  }
  next()
})

const clean = images => {
  const dirs = images
    .map(image => path.dirname(image).split('/')[2])
    .filter((value, index, self) => self.indexOf(value) === index)
    .map(dir => `/dest/${dir}`)
    .forEach(dir => {
      fs.ensureDirSync(dir)
      fs.emptyDirSync(dir)
    })
}

const convert = images => {
  async.eachSeries(images, (image, callback) => {
    const dirname = path.dirname(image)
    const ext = path.extname(image)
    let basename = path.basename(image, ext)

    let size = basename.match(SIZE_REGEX)
    if (size) {
      size = changeCase.camelCase(size[1].toLowerCase())
      basename = basename.replace(SIZE_REGEX, '')
    } else {
      size = 'default'
    }

    const method = METHODS[size]
    const extMethod = EXT_METHODS[ext.substring(1)]
    if (!method) return callback(new Error(`method '${size}' does not exist`))

    const destDir = `/dest/${dirname.split('/').slice(2).join('/')}`
    const dest = `${destDir}/${basename}${ext}`

    fs.ensureDirSync(destDir)

    let sharpImage = method(sharp(image))
    if (extMethod) sharpImage = extMethod(sharpImage)

    sharpImage.toFile(dest)
      .then(() => {
        console.log('done', image, '=>', dest)
        callback(null)
      })
      .catch(callback)
  }, err => {
    if (err) {
      console.error(err)
    } else {
      console.log('finished')
    }
  })
}

const images = []

klaw('/src')
  .pipe(filterImages)
  .on('data', item => images.push(item.path))
  .on('end', () => {
    clean(images)
    convert(images)
  })
