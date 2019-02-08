require('dotenv').config()
const dirTree = require("directory-tree")
const Shopify = require('shopify-api-node')
const image2base64 = require('image-to-base64')
const rtfToHTML = require('@iarna/rtf-to-html')
const { createReadStream } = require('fs')
const _cliProgress = require('cli-progress')

const DIR = '/Users/alexanderhoerl/Dropbox/H2/Bio Balance/Inhalte_Web/Produkte/Tier/Good\ BEE\ Probiotic'
const shopify = new Shopify({
  shopName: process.env.SHOP_NAME,
  apiKey: process.env.APIKEY,
  password: process.env.PASSWORD,
})

const createHtmlDescription = async rtfFilePath => {
  const outputTemplate = (doc, defaults, content) => (
    content.replace(/\n/, '\n    ')
  )
  const options = { template: outputTemplate }
  return new Promise((resolve, reject) => {
    rtfToHTML.fromStream(createReadStream(rtfFilePath), options, (err, html) => {
      if(err) reject(err)
      resolve(html)
    })
  }).catch(err => console.error(err))
}

const countFolders = async tree => {
  let count = 0
  const mapChildren = Promise.all(tree.children.map(child => {
    if (child.type === 'file') return
    count += 1
  }))
  await mapChildren
  return count
}

const main = async () => {
  const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic)
  const tree = dirTree(DIR)

  await bar.start(await countFolders(tree), 0)

  const mapChildren = Promise.all(
    tree.children.map(async (child, index) => {
      if (child.type === 'file') return
  
      const name = child.name
      const productImagesPaths = []
      const images = []
      const rtfFile = []
      
      if (child.children){
        child.children.map(x => {
          if (['.jpeg', '.png', '.jpg'].includes(x.extension)){
            productImagesPaths.push(x.path)
          }
          if (['.rtf'].includes(x.extension)){
            rtfFile.push(x.path)
          }
        })
      }
      
      const createBase64 = Promise.all(productImagesPaths.map(async (path) => {
        const base64Code = await image2base64(path)
        images.push({
          "attachment": base64Code,
        },)
      }))
      await createBase64

      const htmlDescription = await createHtmlDescription(rtfFile[0])

      await shopify.product.create({
          "title": name,
          "body_html": htmlDescription,
          "images": images,
      })
      bar.update(index)
    })
  )
  await mapChildren

  bar.stop()
}

main()
