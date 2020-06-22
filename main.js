const electron = require('electron')
const puppeteer = require('puppeteer-core')
const os = require('os');
const platform = os.platform();

var options     = {
  headless: false,
  defaultViewport: null,
  args: [
//	'--start-maximized',
	'--ignoreHTTPSErrors', //to really tick "Citation indexes"
	'--window-size=1366,768'
  ],
}

if(platform == "linux"){
    options.executablePath = "/usr/bin/google-chrome"
}else if(platform == "darwin"){
    options.executablePath = "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
} else if(platform == "win32"){
	options.executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
}
const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
var browser = null
var linkSearch = null  
var pages = null
var page = null
var disconnected = false
const selectorBox = '.Adv_formBoxesSearch'
const selectorView = 'a[title="Click to view the results"]'

const wosurl = 'https://apps.webofknowledge.com'
const advurl = 'https://apps.webofknowledge.com/WOS_AdvancedSearch_input.do?product=WOS&search_mode=AdvancedSearch'

global.makeSearch = function(advtext) {
try {
  (async () => {
	  if (browser == null || disconnected == true) {
	browser = await puppeteer.launch(options)
	disconnected = false // to prevent opening a new window for each query
	pages = await browser.pages()
	page = pages[0]
//	await page.setViewport({ width: 1366, height: 768 })
	await page.goto(wosurl, {waitUntil: 'networkidle2'}).catch(e => {
            console.error('WOS URL unreachable!');
            process.exit(2);
        })
	browser.on('disconnected',async()=>{
    disconnected = true;
    })
	// show indexes
	await page.waitForSelector('#settings-arrow');   
	await page.click('#settings-arrow'); 
	// uncheck all indexes 
	await page.$$eval("input[type='checkbox']", checks => checks.forEach(c => c.checked = false))
	// check first three
	await page.$eval('input[id="editionitemSCI"]', check => check.checked = true)
	await page.$eval('input[id="editionitemSSCI"]', check => check.checked = true)
	await page.$eval('input[id="editionitemAHCI"]', check => check.checked = true)
	
	//remember checks
	await page.evaluate(() => {
    saveForm('WOS_AdvancedSearch_input_form')
  });
	//hide indexes
	await page.waitForSelector('#settings-arrow');   
	await page.click('#settings-arrow');
	}
	 
	linkSearch = await page.$('a[title="Use Advanced Search to Narrow Your Search to Specific Criteria"]')
	if (linkSearch)    {
		await linkSearch.click()
		await page.waitForSelector(selectorBox);
		await page.evaluate(selectorBox => {document.querySelector(selectorBox).value = "";}, selectorBox); // clear text area
		await page.type(selectorBox, advtext)
		await page.click('#search-button')
		await page.waitForNavigation({waitUntil: 'networkidle2'});
		if ((await page.$('#noRecordsDiv')) == null) { //if search found records
			await page.waitForSelector(selectorView);
			await page.click(selectorView)
		}

		
	}
	linkSearch = await page.$('a[title="Back to Search"]')
		if (linkSearch)    {
		page.goto(advurl) // either this, or below
//		await link.click()
		await page.waitForSelector(selectorBox);
		await page.evaluate(selectorBox => {document.querySelector(selectorBox).value = "";}, selectorBox); // clear text area
		await page.type(selectorBox, advtext)
		await page.click('#search-button')
		await page.waitForNavigation({waitUntil: 'networkidle2'});
		if ((await page.$('#noRecordsDiv')) == null) { //if search found records
			await page.waitForSelector(selectorView);
			await page.click(selectorView)
		}
		}
	linkSearch = await page.$('div[title="Back to previous page"]')
		if (linkSearch)    {
		page.goto(advurl)
		await page.waitForSelector(selectorBox);
		await page.evaluate(selectorBox => {document.querySelector(selectorBox).value = "";}, selectorBox); // clear text area
		await page.type(selectorBox, advtext)
		await page.click('#search-button')
		await page.waitForNavigation({waitUntil: 'networkidle2'});
		if ((await page.$('#noRecordsDiv')) == null) { //if search found records
			await page.waitForSelector(selectorView);
			await page.click(selectorView)
		}

		}
  })()
} catch (err) {
  console.error(err)
}

}
