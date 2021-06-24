let puppeteer = require("puppeteer");


(async function () {
    let browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    slowMo:100,
    args: ["--start-maximized"],
  });
  let page = await browser.newPage();
 
  await page.goto('https://web.whatsapp.com/');
  console.log(1);
  setTimeout(async function(){
    await page.waitForSelector(".G8bNp",{visible: true});
  },5000);
  
  console.log(12);
  await page.waitForSelector(".RPX_m",{visible: true});
  await page.click(".RPX_m");
  await page.type(".RPX_m","pavi");
  await page.keyboard.press("Enter",{delay: 200});
  await page.waitForSelector("._2A8P4._2A1WX");
  await page.click("._2A8P4._2A1WX");
  await page.type("._2A8P4._2A1WX","Hello m testing");
  await page.keyboard.press("Enter",{delay: 200});

  console.log(13);
  



})();