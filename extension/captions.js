function testMediaHasCaptions(element) {
    const video = element.getElementById("video") ;
    if (video) {
        const tracks = Array.from(video.getElementsByTagName("track")) ;
        const textTracks = Array.from(video.textTracks) ;
        const hasSubtitles = tracks.some(t => (t.kind === "subtitles" || t.kind === "captions")) || textTracks.some(t => (t.kind === "subtitles" || t.kind === "captions"));
        return { hasSubtitles };
    }
}
