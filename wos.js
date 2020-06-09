const puppeteer = require('puppeteer-core')
const os = require('os');
const platform = os.platform();
const screenshot = 'web of science.png'
const advtext = 'AD=(harvard univ  SAME  (Otorhinolaryngol OR Head & Neck OR ENT OR Otolaryngol))'
var options     = {
  headless: false,
//  args: [
//	'--start-fullscreen',
//  ],
}

if(platform == "linux"){
    options.executablePath = "/usr/bin/google-chrome"
}else if(platform == "darwin"){
    options.executablePath = "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
} else if(platform == "win32"){
	options.executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
}
try {
  (async () => {
	const browser = await puppeteer.launch(options)
	const pages = await browser.pages()
	const page = pages[0]
	await page.setViewport({ width: 1280, height: 1024 })
	await page.goto('https://apps.webofknowledge.com', {waitUntil: 'networkidle2'}).catch(e => {
            console.error('WOS URL unreachable!');
            process.exit(2);
        })
	
	const link = await page.$('a[title="Use Advanced Search to Narrow Your Search to Specific Criteria"]')
		if (link)    await link.click()
	await page.waitForSelector('.Adv_formBoxesSearch');
	await page.type('.Adv_formBoxesSearch', advtext)
	await page.click('#search-button')
	await page.waitForNavigation({waitUntil: 'networkidle2'});
	await page.screenshot({path: screenshot})

//    await browser.close()
    console.log('See screenshot: ' + screenshot)
  })()
} catch (err) {
  console.error(err)
}
