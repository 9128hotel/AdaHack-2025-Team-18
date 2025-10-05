function imgsWithoutAlts() {
    const imgs = document.querySelectorAll('img');
    var badIDs = []
    for (const img of imgs) {
        if (img.alt.length < 15){
            badIDs.push(img.id)
        }
    }
    return badIDs
}


