function testMediaHasCaptions(element: Document) {
    const videos = element.querySelectorAll("video");
    for (const video of Array.from(videos) as HTMLVideoElement[]) {
        const tracks = Array.from(video.getElementsByTagName("track")) as HTMLTrackElement[];
        const textTracks = Array.from(video.textTracks) as TextTrack[];
        const hasSubtitles = tracks.some(t => t.kind === "subtitles" || t.kind === "captions") || textTracks.some(t => t.kind === "subtitles" || t.kind === "captions");
        if (hasSubtitles) return { hasSubtitles: true };
    }
    return { hasSubtitles: false };
}