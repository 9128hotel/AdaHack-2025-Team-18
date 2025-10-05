//import('tesseract.js')

function imgsWithoutAlts(elems) {
    const imgs = elems.querySelectorAll('img');
    var badIDs = [];
    for (const img of imgs) {
        if (img.alt.length < 15){
            badIDs.push(img);
        }
    }
    return badIDs
}

function checkNav() {
    const elem = document.querySelector('nav')
    if (elem == []) {
        return "Your document does not have a nav tag"
    } else {
        return ""
    }
}

function checkMain() {
    const elem = document.querySelector('main')
    if (elem == []) {
        return "Your document does not have a main tag"
    } else {
        return ""
    }
}

/*
async function imgsWithText(elems) {
    const { createWorker } = require('tesseract.js');
    const worker = await createWorker('eng');

    const imgs = elems.querySelectorAll('img');
    for (const img of imgs) {
    }

}

async function test(src){
    const { createWorker } = require('tesseract.js');
    const worker = await createWorker('eng');
    (async () => {
    const { data: { text } } = await worker.recognize(src);
        console.log(text);
        await worker.terminate();
    })();
}

test('https://www.datocms-assets.com/132613/1724440968-creditgreenpeace-greatbearrainforest-spruceinterior-2.jpg?w=1200')
*/