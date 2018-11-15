const phantom = require('phantom');
const cheerio = require('cheerio');

// var webPage = require('webpage');

// var page = webPage.create();

// page.open('https://www.sharpie.com/search', function(status) {

//   var products = page.evaluate(function() {
//     return document.getElementsByClassName('product-tile');
//   });

//   console.log(products);
//   phantom.exit();

// });
 
// (async function() {
//   const instance = await phantom.create();
//   const page = await instance.createPage();
//   await page.on('onResourceRequested', function(requestData) {
//     // console.info('Requesting', requestData.url);
//   });
 
//   page.open('https://www.sharpie.com/search', function(status) {
//     console.log('evaluate...');
//     const content = page.evaluate(function() {
//       return document.document.getElementsByClassName('product-tile');
//     });
//     console.log(content);
//     instance.exit();
//   });
// })();

const listProducts = async function(pageNum) {
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', function(requestData) {
    // console.info('Requesting', requestData.url);
  });
  const url = `https://www.sharpie.com/search?page=${pageNum}`;
  console.log(url);
  const status = await page.open(url);
  const content = await page.property('content');
  instance.exit();
  const $ = cheerio.load(content);
  return {
    paths: $('.product-tile-link').map(function(i, el) {
      return $(this).attr('href');
    }).get(),
    images: $('.field--name-field-file-url > .dam-image-formatter').map(function(i, el) {
      return $(this).attr('src');
    }).get()
  };
};

(async function() {
  let prodList = { paths: [], images: []}
  for (let i = 0; i < 3; i++) {
    let products = await listProducts(i);
    prodList = {
      paths: prodList.paths.concat(products.paths),
      images: prodList.images.concat(products.images)
    }
  }
  // const products = [0, 1, 2].map((item) => { return await listProducts(item) });
  console.log(prodList);  
})();


 
// (async function() {
//   const instance = await phantom.create();
//   const page = await instance.createPage();
//   await page.on('onResourceRequested', function(requestData) {
//     console.info('Requesting', requestData.url);
//   });
 
//   const status = await page.open('https://www.sharpie.com/search?page=0');
//   const content = await page.property('content');
//   console.log('loading content...');
//   const $ = cheerio.load(content);
//   // const res = $('product-tile').map((i, elem) => {
//   //   console.log(i);
//   //   return $(this).attr('role');
//   // }).get().join(' ');
//   const products = $('.product-tile-link').map(function(i, el) {
//     return $(this).attr('href');
//   }).get();

//   console.log(products);
//   // await instance.exit();
// })();
