const util = require('util')
const fs = require('fs')
const path = require('path')
const { inlineSource } = require('inline-source')
const readdirp = require('readdirp')
const writeFile = util.promisify(fs.writeFile)

const getHtmlFiles = async (directory) => {
  const files = await readdirp.promise(directory, { fileFilter: '*.html' })

  return files.map((file) => file.fullPath)
}

const inlineSources = async ({ htmlFiles, inputs, utils }) => {
  try {
    const inlineSourcePromises = htmlFiles.map((file) =>
      inlineSource(file, inputs)
    )
    const htmlWithInlinedSources = await Promise.all(inlineSourcePromises)

    return htmlWithInlinedSources
  } catch (error) {
    return utils.build.failBuild('Inlining sources failed.', { error })
  }
}

module.exports = {
  onPostBuild: async ({ inputs, constants, utils }) => {
    const htmlFiles = await getHtmlFiles(constants.PUBLISH_DIR)
    const htmlWithInlinedSources = await inlineSources({
      htmlFiles,
      inputs,
      utils
    })
    const overwriteFilePromises = htmlWithInlinedSources.map(
      (content, index) => {
        const filePath = path.join(constants.PUBLISH_DIR, htmlFiles[index])

        return writeFile(filePath, content)
      }
    )

    await Promise.all(overwriteFilePromises)

    console.log('Sources successfully inlined!')
  }
}
