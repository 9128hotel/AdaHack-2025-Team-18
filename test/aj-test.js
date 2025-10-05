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

function checkSemantic(name){
    const elem = document.querySelector(name)
    if (elem == []) {
        return false
    } else {
        return true
    }
}

function checkSemantics(){
    const semElements = [['article',false], ['aside',false], ['details',false], ['figcaption', false], ['figure',false], ['footer', false], ['header', false], ['main', false], ['mark', false], ['nav',false], ['section', false] ['summary',false], ['time',false]];
    for (let i = 0; i < 13; i++) {
        semElements[i,1] = checkSemantic([i,0])
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