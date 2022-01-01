// how to run
// node .\1_HackerrankAutomation.js --url=https://www.hackerrank.com --config=config.json

// install  
// npm init -y
// npm install minimist
// npm install peppeteer-core

let minimist= require("minimist");
let fs=require("fs");
let puppeteer=require("puppeteer");
let args=minimist(process.argv);
let configJSON=fs.readFileSync(args.config,"utf-8");
let configJSO=JSON.parse(configJSON);





async function run(){
let browser=await puppeteer.launch({
    headless:false,
args:['--Start-maximized'],
defaultViewport:null
});

let pages=await browser.pages();
let page=pages[0];
await page.goto(args.url);

//step 1,clicking on login button of 1st page
await page.waitForSelector("a[data-event-action='Login']");
await page.click("a[data-event-action='Login']");

//step 2 ,clicking on second login 
await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
await page.click("a[href='https://www.hackerrank.com/login']");

//step 3 writing username
await page.waitFor(2000);
await page.waitForSelector("input[name='username']");
await page.type("input[name='username']",configJSO.userId,{delay:30});

//step 4 writing password
await page.waitForSelector("input[name='password']");
await page.type("input[name='password']",configJSO.password,{delay:30});

// step 5 clicking on the login
await page.waitFor(2000);
await page.waitForSelector("button[data-analytics='LoginPassword']");
await page.click("button[data-analytics='LoginPassword']");

//step 6 clicking on the compete 
await page.waitFor(2000);
await page.waitForSelector("a[data-analytics='NavBarContests']");
await page.click("a[data-analytics='NavBarContests']");

// step 7 clicking on the manage contest
await page.waitFor(2000);
await page.waitForSelector("a[href='/administration/contests/']");
await page.click("a[href='/administration/contests/']");

// step 8 find all URLS of the same page

await page.waitForSelector("a.backbone.block-center")
let contestURLS= await page.$$eval("a.backbone.block-center", function (atags) {
    let urls=[];
    for(let i=0;i<atags.length;i++){
        let url=atags[i].getAttribute("href");
        urls.push(url);
    }
    return urls;
});

// step 9 ab tere pass sab urls aa gaya hai..ek ek open kr ab new tab pe

for(let i=0;i<contestURLS.length;i++){
    let ctab=await browser.newPage();
    await ctab.bringToFront();
    await ctab.goto(args.url+contestURLS[i]);
    await ctab.waitFor(3000);

    // ab moderator pe click karenge
    await ctab.waitForSelector("li[data-tab='moderators']");
    await ctab.click("li[data-tab='moderators']");

    //type in moderator
    await ctab.waitFor(2000);
    await ctab.waitForSelector("input#moderator");
    await ctab.type("input#moderator", configJSO.moderator, { delay: 50 });
    await ctab.waitFor(2000);
    // press enter
    await ctab.keyboard.press("Enter");
    await ctab.waitFor(2000);
    await ctab.close();
    await page.waitFor(2000);
}
await browser.close();
}

run();

