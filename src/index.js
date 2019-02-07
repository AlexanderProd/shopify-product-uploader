require('dotenv').config()
const dirTree = require("directory-tree")
const Shopify = require('shopify-api-node')
const image2base64 = require('image-to-base64')
const rtfToHTML = require('@iarna/rtf-to-html')
const { createReadStream } = require('fs')
 
const DIR = '/Users/alexanderhoerl/Dropbox/H2/Bio Balance/Inhalte_Web/Produkte/Tier/Good\ BEE\ Probiotic'
const shopify = new Shopify({
  shopName: process.env.SHOP_NAME,
  apiKey: process.env.APIKEY,
  password: process.env.PASSWORD,
});

const createHtmlDescription = (rtfFilePath) => {
  const outputTemplate = (doc, defaults, content) => (
    content.replace(/\n/, '\n    ')
  )
  const options = { template: outputTemplate }
  return new Promise((resolve, reject) => {
    rtfToHTML.fromStream(createReadStream(rtfFilePath), options, (err, html) => {
      if(err){
        reject(err)
      }
      resolve(html)
    })
  })
}

const createProduct = async (product) => {
  try {
    await shopify.product.create(product)
  } catch (error) {
    console.error(error)
  }
}

const main = async () => {
  const tree = dirTree(DIR)
  tree.children.map(async (child) => {
    if(child.type === 'file'){
      return
    }

    const name = child.name
    const productImagesPaths = []
    const images = []
    const rtfFile = []

    if(child.children){
      child.children.map(x => {
        if (['.jpeg', '.png', '.jpg'].includes(x.extension)){
          productImagesPaths.push(x.path)
        }
        if(['.rtf'].includes(x.extension)){
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

    createProduct({
        "title": name,
        "body_html": htmlDescription,
        "images": images,
    })
  })
}

main()
