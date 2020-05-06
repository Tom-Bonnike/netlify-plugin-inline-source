const util = require('util')
const fs = require('fs')
const path = require('path')
const { inlineSource } = require('inline-source')
const readdir = util.promisify(fs.readdir)
const writeFile = util.promisify(fs.writeFile)

const getHtmlFiles = async (directory) => {
  const files = await readdir(directory)

  return files.filter((file) => path.extname(file) === '.html')
}

module.exports = {
  onPostBuild: async ({ inputs, constants, utils }) => {
    try {
      const htmlFiles = await getHtmlFiles(constants.PUBLISH_DIR)
      const inlineSourcePromises = htmlFiles.map((file) =>
        inlineSource(file, { ...inputs, rootpath: constants.PUBLISH_DIR })
      )
      const htmlWithInlinedSources = await Promise.all(inlineSourcePromises)
      const overwriteFilePromises = htmlWithInlinedSources.map(
        (content, index) => {
          const filePath = path.join(constants.PUBLISH_DIR, htmlFiles[index])

          return writeFile(filePath, content)
        }
      )

      await Promise.all(overwriteFilePromises)

      console.log('Sources successfully inlined!')
    } catch (error) {
      utils.build.failBuild('Inlining sources failed.', { error })
    }
  }
}
