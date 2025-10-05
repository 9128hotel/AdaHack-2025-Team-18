function imgsWithoutAlts(elemtents) {
    const imgs = elements.querySelectorAll('img');
    var badIDs = []
    for (const img of imgs) {
        if (img.alt.length < 15){
            badIDs.push(img)
        }
    }
    return badIDs
}
