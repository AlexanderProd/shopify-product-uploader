# shopify-product-uploader

This is a CLI app to upload a batch of products to a Shopify store based on a folder structure, image and text files.

## Installation

```
$ git clone https://github.com/AlexanderProd/shopify-product-uploader
$ cd shopify-product-uploader
$ yarn install
```

## Usage
Create a .env file in the root directory of the cloned repository that looks like this with your shops credentials.
```
SHOP_NAME=testshop
APIKEY=123456
PASSWORD=123456
``` 
Just run `yarn start [directory]` inside the downloaded directory.

Every product needs to be inside its own folder where the folder name sets the products name. 
Images inside of the folder are uploaded as product photos.

A `.rtf` file is used for the description, formatting will be kept.

Filenames are not important, everything is determined based on file extension. 
```
Directory to start in
|
├── Product 1
|     ├── image1.png
|     ├── image2.jpg
|     ├── details.json
|     └── description.rtf
└── Product 2
      ├── image1.png
      ├── image2.jpg
      ├── details.json
      └── description.rtf
```


