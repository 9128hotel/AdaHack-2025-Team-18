export function imgsWithoutAlts(elems) {
    const imgs = elems.querySelectorAll('img');
    for (const img of imgs){
        if (img.alt.length < 15){
            return False
        }
    }
    return True 
}