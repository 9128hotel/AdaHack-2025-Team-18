function testMediaHasCaptions(element: Document) {
    const video = element.getElementById("video") as HTMLVideoElement | null;
    if (video) {
        const tracks = Array.from(video.getElementsByTagName("track")) as HTMLTrackElement[];
        const textTracks = Array.from(video.textTracks) as TextTrack[];
        const hasSubtitles = tracks.some(t => (t.kind === "subtitles" || t.kind === "captions")) || textTracks.some(t => (t.kind === "subtitles" || t.kind === "captions"));
        return { hasSubtitles };
    }

    const audio = element.getElementById("audio") as HTMLAudioElement | null;
    // there is no cross-browser reilable way to do this
    const isTranscribing = false;
    console.log("Audio may need transcript")
    return { isTranscribing };
}
