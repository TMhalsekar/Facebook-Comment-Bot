const puppeteer = require('puppeteer');
const jsdom = require("jsdom")
const {JSDOM} = jsdom
global.DOMParser = new JSDOM().window.DOMParser

const isHeadless = false


async function scroll(page, scrollDelay = 1000) {
    let previousHeight;
    try {
        while (mutationsSinceLastScroll > 0 || initialScrolls > 0) {
            mutationsSinceLastScroll = 0;
            initialScrolls--;
            previousHeight = await page.evaluate(
                'document.body.scrollHeight'
            );
            await page.evaluate(
                'window.scrollTo(0, document.body.scrollHeight)'
            );
            await page.waitForFunction(
                `document.body.scrollHeight > ${previousHeight}`,
                {timeout: 600000}
            ).catch(e => console.log('scroll failed'));
            await page.waitFor(scrollDelay);
        }
    } catch (e) {
        console.log(e);
    }
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}




async function logIn(page) {

    await page.goto('https://www.facebook.com/',
        {waitUntil: 'networkidle2'})

    await page.waitForSelector('input[name="email"]')

    await page.type('input[name="email"]', "brock.helmsley@yahoo.com")
    await page.type('input[name="pass"]', "mer119")


    await page.click('label[id=loginbutton]')

    await page.waitForSelector('span[class="imgWrap"]')

}

async function goToPage(page, pagename) {

    await page.goto("https://m.facebook.com/" + pagename + "/",
        {waitUntil: 'networkidle2'})
    await page.goto(postUrl)
    await page.waitFor(5000)
    await page.click('[contenteditable]')
  	await page.keyboard.type("Hello", { delay: 10 })
  	await page.keyboard.press('Tab'{delay:5})
  	await page.keyboard.press('Tab'{delay:5})
    await page.keyboard.press('Tab',{delay:5})
  	await page.keyboard.press('Enter')
    #await page.click('class=" _3n43"')
    await page.waitForSelector('div[data-nt="NT:BOX_3"]') 	
//await scroll(page)
    
}




exports.gotopage = async function(){
    pagename = "goodrx"
    const browser = await puppeteer.launch({headless: isHeadless})
    const page = await browser.newPage()
    postUrl="https://www.facebook.com/9gag/posts/10160168617981840?__xts__[0]=68.ARDqYEdyjsBtARX17abg0kEIwzP1SOp_OE736S7e45i3NNlrr9KDQQsmtfbdMw83sNEnwQh7gubC7-Bg08HggRtxFuiUK4JWbFJlEKgmZV_s68gb_kSULK2vcWUkLR1OmwdKIuDAWyK-feyqAwnaHmCm7gJLa38qtHPIK9sEjlkzmBAlLkQwAj-aWFTCERg2x1cHydhoDwWIj_WXuKv5xrcxmQbJQG-r8YeNMEmS29G8i6gqbcEXNkIOZCep32Q2E6LMxeSd_AM-SFXnzNHXTlsQnJorh0Bff245AzvAgkeIYIOISBvaqyW0Ix3HANf85cO_aDysIJAuJFXSKw&__tn__=-R"

    await page.setViewport({width: 1280, height: 800})


    await logIn(page)

    await goToPage(page, pagename, postUrl)
}


