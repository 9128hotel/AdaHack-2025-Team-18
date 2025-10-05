function testMediaHasCaptions(element: Document) {
    const videos = Array.from(element.querySelectorAll("video")) as HTMLVideoElement[];
    const badVideos: HTMLVideoElement[] = [];
    for (const video of videos) {
        const tracks = Array.from(video.getElementsByTagName("track")) as HTMLTrackElement[];
        const textTracks = Array.from(video.textTracks) as TextTrack[];
        const hasSubtitles = tracks.some(t => t.kind === "subtitles" || t.kind === "captions") || textTracks.some(t => t.kind === "subtitles" || t.kind === "captions");
        if (!hasSubtitles) {
            badVideos.push(video);
        }
    }
    return { badVideos };
}