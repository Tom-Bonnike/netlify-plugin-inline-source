const util = require('util')
const fs = require('fs')
const path = require('path')
const { inlineSource } = require('inline-source')
const readdirp = require('readdirp')
const writeFile = util.promisify(fs.writeFile)

const getHtmlFiles = async (directory) => {
  const files = await readdirp.promise(directory, {
    fileFilter: '*.html',
    directoryFilter: ['!node_modules']
  })

  return files.map((file) => file.fullPath)
}

const getHtmlWithInlinedSources = async ({
  htmlFiles,
  inputs,
  constants,
  utils
}) => {
  try {
    const inlineSourcePromises = htmlFiles.map((file) =>
      inlineSource(file, { ...inputs, rootpath: constants.PUBLISH_DIR })
    )
    const htmlWithInlinedSources = await Promise.all(inlineSourcePromises)

    return htmlWithInlinedSources
  } catch (error) {
    return utils.build.failBuild('Inlining sources failed.', { error })
  }
}

const overwriteHtmlFiles = async ({ htmlFiles, htmlWithInlinedSources }) => {
  const overwriteFilePromises = htmlFiles.map((filePath, index) => {
    const content = htmlWithInlinedSources[index]

    return writeFile(filePath, content)
  })

  await Promise.all(overwriteFilePromises)
}

module.exports = {
  onPostBuild: async ({ inputs, constants, utils }) => {
    const htmlFiles = await getHtmlFiles(constants.PUBLISH_DIR)
    const htmlWithInlinedSources = await getHtmlWithInlinedSources({
      htmlFiles,
      inputs,
      constants,
      utils
    })

    await overwriteHtmlFiles({ htmlFiles, htmlWithInlinedSources })
    console.log('Sources successfully inlined!')
  }
}
