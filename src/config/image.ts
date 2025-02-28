const { nativeImage } = require('electron')

const appWindowIcon = nativeImage.createFromPath('./assets/icon.png')

export { appWindowIcon }
