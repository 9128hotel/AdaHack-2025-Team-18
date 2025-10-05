function testMediaHasCaptions(element) {
    const videos = Array.from(element.querySelectorAll("video"));
    const badVideos = [];
    for (const video of videos) {
        const tracks = Array.from(video.getElementsByTagName("track"));
        const textTracks = Array.from(video.textTracks);
        const hasSubtitles = tracks.some(t => t.kind === "subtitles" || t.kind === "captions") || textTracks.some(t => t.kind === "subtitles" || t.kind === "captions");
        if (!hasSubtitles) {
            badVideos.push(video);
        }
    }
    return { badVideos };
}