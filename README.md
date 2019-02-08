# shopify-product-uploader

This is a CLI app to upload a batch of products to a Shopify store based on a folder structure, image and text files.

## Installation

```
$ git clone https://github.com/AlexanderProd/shopify-product-uploader
$ yarn install
```

## Usage
Just run `yarn start [directory]` inside the downloaded directory.

Create a .env file in the root directory the cloned repository that looks like this with your shops credentials.
```
SHOP_NAME=testshop
APIKEY=123456
PASSWORD=123456
``` 
Every product needs to be inside its own folder where the folder name sets the products name. 
Images inside of the folder are uploaded as product photos.

A `.rtf` file is uses for the description, formatting will be kept.

Filenames are not important everything is determined based on file extension. 
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


