let puppeteer = require("puppeteer");
let links = "https://www.cowin.gov.in/home";
let pincode=process.argv[2];
const PDFDocument = require('pdfkit');
const fs = require('fs');

let pdfDoc = new PDFDocument;
pdfDoc.pipe(fs.createWriteStream('Vaccine.pdf'));


//async function to notify

(async function () {
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            slowMo:100,
            args: ["--start-maximized"]
        });
        let slots = await getlistofplaces(links, browser,pincode);
        

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
  await page.waitForSelector("._2A8P4");
  await page.click("._2A8P4");
  console.log(13);
  let details=JSON.stringify(slots,null,2);
  
  await page.click("[data-testid='clip']");
  
  await page.click("[data-testid='attach-document']");
  
  pdfDoc.text(details);
pdfDoc.end();
const { MessageMedia } = require('whatsapp-web.js');

const media = MessageMedia.fromFilePath('Vaccine.pdf');
chat.sendMessage(media);
   
       
    
})();



//function to get the listing of Vaccine Available

async function getlistofplaces(link, browserInstance,pincode){
    let newPage = await browserInstance.newPage();
    await newPage.goto(link);
    await newPage.waitForSelector("#mat-input-0", { visible: true });
    await newPage.click("#mat-input-0");
    await newPage.type("#mat-input-0",pincode,{ delay: 200 });
    await newPage.keyboard.press("Enter",{ delay: 200 });
    console.log("yes");
    // if(age>=45){
    //     await newPage.click("label[for='flexRadioDefault3']");
        

    // }else{
    //     let eighteenplus=await page.evaluate(async function(){
    //         let list=document.querySelectorAll("[for='flexRadioDefault2']");
    //         return list[1];


    //     })

     await newPage.click(".col-padding.filerandsearchblock.margin0auto [for='flexRadioDefault2']");
    // }
    
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let cost="Free";

    function consoleFn(date,place,no_vaccine,type) {
        let places = document.querySelectorAll(place);
        let vaccines= document.querySelectorAll(no_vaccine);
        let t=document.querySelectorAll(type);
        let details = [];
            for (let i=0,j = 0;i < places.length && j<vaccines.length; i++,j+=7) {
                if(vaccines[j].innerText == "Booked"){
                        continue ;
                } 
            let Available_at = places[i].innerText;
            let No_of_Vaccines=vaccines[j].innerText;
            let type_of_Vaccine=t[j].innerText;
            details.push({
                date,Available_at,No_of_Vaccines,type_of_Vaccine
            })
            
        }

        
        return details;
    }
    return await newPage.evaluate(consoleFn,date,
        ".row-disp>.center-name-text",".vaccine-box.vaccine-box1.vaccine-padding a",".vaccine-box.vaccine-box1.vaccine-padding h5");
}

