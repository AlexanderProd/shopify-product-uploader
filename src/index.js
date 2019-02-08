require('dotenv').config()
const dirTree = require("directory-tree")
const Shopify = require('shopify-api-node')
const image2base64 = require('image-to-base64')
const rtfToHTML = require('@iarna/rtf-to-html')
const { createReadStream, readFile } = require('fs')
const _cliProgress = require('cli-progress')

const DIR = process.argv[2]
const shopify = new Shopify({
  shopName: process.env.SHOP_NAME,
  apiKey: process.env.APIKEY,
  password: process.env.PASSWORD,
})

const createHtmlDescription = async rtfFilePath => {
  if (!rtfFilePath) return
  const outputTemplate = (doc, defaults, content) => (
    content.replace(/\n/, '\n    ')
  )
  const options = { template: outputTemplate }
  return new Promise((resolve, reject) => {
    rtfToHTML.fromStream(createReadStream(rtfFilePath), options, (err, html) => {
      if (err) reject(err)
      resolve(html)
    })
  }).catch(err => console.error(err))
}

const createProductDetails = async jsonFilePath => {
  if (!jsonFilePath) return
  return new Promise((resolve, reject) => {
    readFile(jsonFilePath, 'utf-8', (err, data) => {
      if (err) reject(err)
      resolve(JSON.parse(data))
    })
  }).catch(err => console.error(err))
}

const countFolders = async tree => {
  let count = 0
  const mapChildren = Promise.all(
    tree.children.map(child => {
      if (child.type === 'file') return
      count += 1
    })
  )
  await mapChildren
  return count
}

const main = async () => {
  const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic)
  const tree = dirTree(DIR)
  const foldersToDo = await countFolders(tree)
  let progress = 0

  console.log(`Uploading ${foldersToDo} products!`)
  await bar.start(foldersToDo, progress)

  const mapChildren = Promise.all(
    tree.children.map(async (child, index) => {
      if (child.type === 'file') return
  
      const name = child.name
      const productImagesPaths = []
      const images = []
      const rtfFile = []
      const jsonFile = []

      if (child.children){
        child.children.map(x => {
          if (['.jpeg', '.png', '.jpg'].includes(x.extension)){
            productImagesPaths.push(x.path)
          }
          if (['.rtf'].includes(x.extension)){
            rtfFile.push(x.path)
          }
          if (['.json'].includes(x.extension)){
            jsonFile.push(x.path)
          }
        })
      }
      
      const createBase64 = Promise.all(
        productImagesPaths.map(async (path) => {
          const base64Code = await image2base64(path)
          images.push({
            "attachment": base64Code,
          },)
        })
      )
      await createBase64

      const htmlDescription = await createHtmlDescription(rtfFile[0])
      const productDetails = await createProductDetails(jsonFile[0])

      await shopify.product.create({
          ...productDetails,
          "title": name,
          "body_html": htmlDescription,
          "images": images,
      })
      bar.update(progress += 1)
    })
  )
  await mapChildren

  bar.stop()
}

main()
