const { nativeImage } = require('electron')

const appWindowIcon = nativeImage.createFromPath('./assets/icons/icon.png')

export { appWindowIcon }
