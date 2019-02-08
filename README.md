# shopify-product-uploader

This is a CLI app to upload a batch of products to a Shopify store based on a folder structure, image and text files.

## Installation

```
$ npm install -g shopify-product-uploader
```

## Usage
Just run `shopify-upload` inside a directory that contains a folder structure that looks like this.
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
Every product needs to be inside its own folder where the folder name sets the products name. 
Images inside of the folder are uploaded as product photos.

A `.rtf` file is uses for the description, formatting will be kept.

Filenames are not important everything is determined based on file extension. 


