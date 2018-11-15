const phantom = require('phantom');
const cheerio = require('cheerio');
const fs = require('fs');

const ORIGIN = 'https://www.sharpie.com';
const products = [ 
  { 
    path: '/collections/color-burst?sku=SHColorBurstFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1948374%2Dsharpie%2Dfine%2Dcolor%2Dburst%2D5cd%2Dcanada%2Dtip%2Ddetail%2Dfull%2Dangle?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/pro/china-marker?sku=SHChinaMarkerBlackBullet',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/2173PP%2Dsharpie%2Dspecialty%2Dchina%2Ditem%2Dfront?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/art/water-based-paint?sku=SHWaterBasedPaintBlackExtraBold',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/36671PP%2Dsharpie%2Dpaint%2Dwater%2Ditem%2Dfront?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/pro/tec?sku=SHTECBlackFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/13401%2Dsharpie%2Dprofessional%2Dtec%2Ditem%2Dfront?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/highlighters/ink-indicator-tank?sku=SHInkIndicatorTankYellow',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/2021211%2Dsharpie%2Dink%2Dindicator%2Dtank%2Dhighlighter%2Dyellow%2Dcap%2Don%2Dback?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/collections/special-edition-packs-featuring-alex-morgan?sku=SHAMorgan4CT',
    image: 'https://s7d2.scene7.com/is/image/Newellsync/alex-morgan-banner-tpt-pack?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/highlighters/clear-view-stick?sku=SHClearViewStickBlueNarrowChisel',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1964389%2Dsharpie%2Dclearview%2Dhighlighter%2Dclearview%2Dblue%2Dangle?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/collections/special-edition-packs-featuring-aaron-rodgers?sku=SHARodgers10CT',
    image: 'https://s7d2.scene7.com/is/image/Newellsync/aaron-rodgers-tpt-pack?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/specialty/extreme?sku=SHExtremeBlackFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1927432%2Dsharpie%2Dprofessional%2Dextreme%2Ditem%2Dalt%2D2?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/collections/special-edition-packs-featuring-chris-paul?sku=SHCPaul5CT',
    image: 'https://s7d2.scene7.com/is/image/Newellsync/chris-paul-tpt-pack?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/pens/stainless-steel-pen?sku=SHStainlessSteelBlackFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/SHSSPen_Blk_AC?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/classic/super?sku=SHSuperBlackFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/33001%5FSHSuper%5FBlk%5Fos%5FA?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/collections/electro-pop?sku=SHElectroPopFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/SharpieElectroPop%5F5Fine%5FThumbnail?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/pens/grip-pen?sku=SHGripBlackFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/SHPen3%5Fblk%5FA?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/highlighters/ink-indicator-stick?sku=SHInkIndicatorStickYellow',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/2012325%2Dsharpie%2Dink%2Dindicator%2Dstick%2Dhighlighter%2Dyellow%2Dcap%2Don%2Dback%2Dclip%2Dvisible?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/pro/industrial?sku=SHIndustrialBlackFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/13763PP%2Dsharpie%2Dprofessional%2Dindustrial%2Ditem%2Dfront?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/classic/ultra-fine?sku=SHUltraFineAlmondUltraFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/Almond?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/classic/chisel?sku=SHChiselBlackChisel',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1927296%2Dsharpie%2Dpermanent%2Dchisel%2Ditem%2Dalt?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/highlighters/pocket?sku=SHPocketBlueNarrowChisel',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1788761%5FSHHPK%5FBlu%5FAC%2D1?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/collections/reusable-pen-case?sku=SHReusablePenCaseFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1983965%2Dsharpie%2Dpen%2D12ct%2Dassorted%2DCAN%2Din%2Dpack%2Dangle?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/collections/special-edition-packs-featuring-aaron-judge?sku=SHAJudge4CT',
    image: 'https://s7d2.scene7.com/is/image/Newellsync/aaron-judge-tpt-pack?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/pro/professional?sku=SHProfessionalBlackChisel',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/SHPRO%5FBlack%5FThumbnail?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/classic/fine?sku=SHFineAlmondFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1756744%2Dsharpie%2Dpermanent%2Dfine%2Ditem%2Dfront%2D1a?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/pro/pro-bullet?sku=SHProBulletBlackBullet',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1794229%2Dsharpie%2Dprofessional%2Dprobullet%2Ditem%2Dfront?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/collections/reusable-permanent-marker-cases?sku=SHReusablePermanentMarkerCasesColorAssortmentFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/CoolCaseProduct%5FSupersonic%5FTurquoise?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/highlighters/gel?sku=SHGelBlueGelStick',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1780471%5FSAGel%5FFlBlu%5FE%2D1?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/art/brush-tip?sku=SHBrushTipBerryBrush',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/Sharpie%5FBrushTip%5FBerry%5FThumbnail?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/highlighters/retractable-highlighter?sku=SHRetractableHighlighterBerryNarrowChisel',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/28101%2Dsharpie%2Dhighlighters%2Dretractable%2Ditem%2Dfront?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/pro/king?sku=SHKingBlackChisel',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/SHKing%5FBlack%5FThumbnail?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/specialty/neon?sku=SHNeonBlueFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1878459%2Dsharpie%2Dpermanent%2Dneon%2Ditem%2Dfront?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/highlighters/clear-view-tank?sku=SHClearViewTankBlueChisel',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1964389%2Dwace%2Dsharpie%2Dclear%2Dview%2Dstick%2Dos%2Dblue%2Dcap%2Doff%2Dprimary%2D2?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/pens/art-pen?sku=SHARPArtPenBerryFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1983967-sharpie-art-pen-berry-cap-off-tip-angled?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/pens/retractable-pen?sku=SHRetractablePenBlackFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/SHPenRT%5FBlk%5Fout%5FC?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/classic/retractable?sku=SHRetractableAquaFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/32727_SHRT_F_Aqu_out?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/classic/twin-tip?sku=SHTwinTipBerryFine&UltraFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/32245%5FSHTwinTip%5FBry%5FUPC%5Fos%5FA?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/classic/mini?sku=SHMiniAquaFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/35110_SHMiniF_Aqu_os_A?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/specialty/metallic?sku=SHMetallicBronzeFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1823888%2Dsharpie%2Dpermanent%2Dmetallic%2Ditem%2Dfront?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/classic/super-twin-tip?sku=SHSuperTwinTipBlackChisel&Fine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/36401PP%2Dsharpie%2Dpermanent%2Dsupertwin%2Dtip%2Ddetail?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/pro/pro-chisel?sku=SHProChiselBlackChisel',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1794224_SHMetalBarrelCh_Blk_AC-1?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/highlighters/liquid?sku=SHLiquidBerryNarrowChisel',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/24415%5FSHHLiqPen%5FBry%5FA%2D1?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/highlighters/tank?sku=SHTankBlueChisel',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1788346%5FSHHTK%5FBlu%5FA?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/pro/magnum?sku=SHMagnumBlackChisel',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/44101PP%2Dsharpie%2Dprofessional%2Dmagnum%2Ditem%2Dalt?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/collections/ultimate-packs?sku=SHUltimatePacks',
    image: 'https://s7d2.scene7.com/is/image/Newellsync/sharpie-ultimate-collection-2005-Present?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/pens/brush-pen?sku=SHBrushPenBlack',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/2011280%2Dsharpie%2Dpen%2Dbrush%2Dtip%2Dblack%2Dcap%2Don%2Dback%2D1?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/pro/sharpie-pro?sku=SHProFineBlack',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/2018326%2Dsharpie%2Dpermanent%2Dmarker%2Dpro%2Dchisel%2Dblack%2Dproduct%2Dsilo%2Dstraight%2Don%2Dcap%2Don%2Dback%2Dstraight%2Don?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/specialty/sharpie-metallic-colors?sku=SHMetallicSapphire',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/2029672%2Dsharpie%2Dpermanent%2Dmarker%2D1ct%2Dmetallic%2Dsapphire%2Dcap%2Doff%2Dstraight%2Don?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/art/oil-based-paint?sku=SHOilBasedPaintAquaFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/35548%5FSHPaintF%5FAquBlu%5FUPC%5Fos%5FB?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/pro/mean-streak?sku=SHMeanStreakBlackBullet',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1359%2D1011%2D1179%20%28Mean%20Streak%20Permanent%20Marking%20Stick%20Cap%20On%20%2D%20Black%29?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/markers/art/stained-sharpie?sku=SHStainedBlackBrush',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/1787700%5FSHST%5FBlk%5FA?&hei=514&qlt=85%2C0&wid=514'
  },
  { 
    path: '/collections/sharpie-cosmic-color-permanent-markers?sku=SHCosmicColor4CTFine',
    image: 'https://s7d9.scene7.com/is/image/NewellRubbermaid/2010958%2Dsharpie%2Dcosmic%2Dcolors%2Dfine%2Dassorted%2Din%2Dpack%2D1%2D2?&hei=514&qlt=85%2C0&wid=514'
  }
]

const delay = ms => new Promise(_ => setTimeout(_, ms));

const loadProduct = async function(prod) {
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', function(requestData) {});
  
  const status = await page.open(`${ORIGIN}${prod.path}`);
  const content = await page.property('content');

  instance.exit();

  const $ = cheerio.load(content);
  return {
    title: $('.commerce-tile__title').text(),
    colors: $('.swatch-color').map(function(i, el) {
      return {
        code: $(this).attr('data-swatch-value'),
        name: $(this).attr('aria-label')
      };
    }).get(),
    sizes: $('.swatch-size').map(function(i, el) {
      return $(this).attr('data-swatch-value');
    }).get(),
    category: JSON.parse($("[data-drupal-selector='drupal-settings-json']").html())['newell']['product_category'],
    subCategory: JSON.parse($("[data-drupal-selector='drupal-settings-json']").html())['newell']['product_subcategory'],
    overview: $('.field-content').text(),
    overviewItems: $('.field-content > ul > li').map(function(i, el) {
      return $(this).text();
    }).get(),
    image: decodeURI(prod.image)
  }
};

let fd = fs.openSync('./scripts/seeds/products.json', 'a');

(async function() {
  let productList = []
  for (let i = 0; i < products.length; i++) {
    const prod = await loadProduct(products[i]);
    console.log(prod);
    productList.push(prod);
    fs.appendFileSync(fd, JSON.stringify(prod) + '\r\n');
  }
  console.log(productList);
  fs.closeSync(fd);
})(products);
