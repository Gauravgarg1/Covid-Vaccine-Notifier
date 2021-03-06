let puppeteer = require("puppeteer");
let links = "https://www.cowin.gov.in/home";
//pincode input
let pincode = process.argv[2];
//age input
let age = process.argv[3];
//username input to send details on whatsapp
let personName = process.argv[4];
//vaccine you want
let vaccineyouwant=process.argv[5];
const PDFDocument = require('pdfkit');
const fs = require('fs');

let pdfDoc = new PDFDocument;
pdfDoc.pipe(fs.createWriteStream('Vaccine.pdf'));


//async function to notify

(async function () {
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        slowMo: 100,
        args: ["--start-maximized"]
    });
    //calling the function to get all the details
    let slots = await getlistofplaces(links, browser, pincode,vaccineyouwant);


    //Here after getting the details we will send the information to user on whatsapp
    let page = await browser.newPage();

    await page.goto('https://web.whatsapp.com/');
    //console.log(1);
    setTimeout(async function () {
        await page.waitForSelector(".G8bNp", { visible: true });
    }, 5000);

    // console.log(12);
    await page.waitForSelector(".RPX_m", { visible: true });
    await page.click(".RPX_m");
    await page.type(".RPX_m", personName);
    await page.keyboard.press("Enter", { delay: 200 });
    await page.waitForSelector("._2A8P4");
    await page.click("._2A8P4");
      // message
      let message="";
    if( Object.keys(slots).length==0)
    {
        message="Hello Sir, there are NO available slots of "+ vaccineyouwant;
        await page.type("._2A8P4", message);
        await page.keyboard.press("Enter", { delay: 200 });
    }
  
    else
    {
     message="Hello Sir, these are the available slots of "+ vaccineyouwant;
     await page.type("._2A8P4", message);
     await page.keyboard.press("Enter", { delay: 200 });
    await page.type("._2A8P4", JSON.stringify(slots));
    await page.keyboard.press("Enter", { delay: 200 });
    // console.log(13);
    }



    //Here i added additionall functionality for those who run any organisation 
    // so they can take a printout of it and paste on the notice board and notifies to all the society members
    let details = JSON.stringify(slots, null, 2);
    pdfDoc.text(message);
    pdfDoc.text(details);
    
    pdfDoc.end();




})();



//function to get the listing of Vaccine Available

async function getlistofplaces(link, browserInstance, pincode,vaccineyouwant) {
    let newPage = await browserInstance.newPage();
    await newPage.goto(link);
    await newPage.waitForSelector("#mat-input-0", { visible: true });
    await newPage.click("#mat-input-0");
    await newPage.type("#mat-input-0", pincode, { delay: 200 });
    await newPage.keyboard.press("Enter", { delay: 200 });
    console.log("yes");

    if (age >= 45) {
        await newPage.click(".col-padding.filerandsearchblock.margin0auto [for='flexRadioDefault3']");
    }

    else {

        await newPage.click(".col-padding.filerandsearchblock.margin0auto [for='flexRadioDefault12']");
    }

    if(vaccineyouwant=="Covishield")
    await newPage.click(".mobile-hide [for='flexRadioDefault4'].form-check-label");
    else
    await newPage.click(".mobile-hide [for='flexRadioDefault5'].form-check-label");

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    // let date=document.querySelector(".availability-date p").innerText;
    let cost = "Free";

    function consoleFn(date, place, no_vaccine, type) {
        let places = document.querySelectorAll(place);
        let vaccines = document.querySelectorAll(no_vaccine);
        let details = [];
        let j=-7;
        for (let i = 0;  i < places.length ; i++) {

            j+=7;
            
            let Available_at = places[i].innerText;
            let No_of_Vaccines = vaccines[j].innerText;
            if(No_of_Vaccines=="NA")
            continue;
            let type_of_Vaccine = type;
            details.push({
                date, Available_at, No_of_Vaccines, type_of_Vaccine
            })
        

        }


        return details;
    }
    return await newPage.evaluate(consoleFn, date,
        ".row-disp>.center-name-text", ".vaccine-box.vaccine-box1.vaccine-padding a", vaccineyouwant);
}

