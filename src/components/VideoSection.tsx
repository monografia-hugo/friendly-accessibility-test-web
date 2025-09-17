// Video component with accessibility improvements
import { useRef } from 'react';
import SubtitleControls from './SubtitleControls';
import firstVideo from '../assets/videos/videoplayback.mp4';
import firstVideoVtt from '../assets/subtitles/videoplayback.mp4.vtt';

const VideoSection = () => {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  const subtitleTracks = [
    { label: 'Português', src: '/sample-video-en.vtt', language: 'en' }
  ];

  const bunnySubtitleTracks = [
    { label: 'Português', src: '/bigbuckbunny-en.vtt', language: 'en' }
  ];

  return (
    <section className="stat-card p-4 sm:p-6 rounded-lg mb-6" aria-labelledby="training-videos-heading">
      <h2 id="training-videos-heading" className="text-base sm:text-xl font-bold stat-title mb-4">Training Videos</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Video with subtitles and accessibility features */}
        <div className="relative">
          <video
            ref={video1Ref}
            className="w-full bg-black rounded object-contain"
            style={{ maxHeight: '300px' }}
            controls
            poster="/placeholder.svg"
            aria-describedby="video-1-description"
          >
            <source src={firstVideo} type="video/mp4" />
            <track
              kind="subtitles"
              src={firstVideoVtt}
              srcLang="en"
              label="English"
              default
            />
            Your browser does not support the video tag.
          </video>
          <div id="video-1-description" className="sr-only">
            Training video with English subtitles available
          </div>
          {/* Accessible favorite button */}
          <button
            className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white px-2 py-1 rounded accessible-focus transition-colors"
            onClick={() => console.log('Favorited')}
            aria-label="Add to favorites"
          >
            <span aria-hidden="true">❤️</span>
          </button>
          <div className="mt-2">
            <SubtitleControls videoRef={video1Ref} subtitleTracks={subtitleTracks} />
          </div>
        </div>

        {/* Second video with subtitles */}
        <div className="relative">
          <video
            ref={video2Ref}
            className="w-full bg-black rounded object-contain"
            style={{ maxHeight: '300px' }}
            controls
            poster="/placeholder.svg"
            aria-describedby="video-2-description"
          >
            <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4" type="video/mp4" />
            <track
              kind="subtitles"
              src="/bigbuckbunny-en.vtt"
              srcLang="en"
              label="English"
              default
            />
            Your browser does not support the video tag.
          </video>
          <div id="video-2-description" className="sr-only">
            Volkswagen GTI review video with English subtitles available
          </div>
          <div className="mt-2">
            <SubtitleControls videoRef={video2Ref} subtitleTracks={bunnySubtitleTracks} />
          </div>
        </div>
      </div>

      {/* Accessible status indicators with text alternatives */}
      <div className="mt-4 flex flex-wrap gap-3 sm:gap-4" role="status" aria-label="Video processing status">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full" aria-hidden="true"></div>
          <span className="nav-text text-xs sm:text-sm">Processing Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full" aria-hidden="true"></div>
          <span className="nav-text text-xs sm:text-sm">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full" aria-hidden="true"></div>
          <span className="nav-text text-xs sm:text-sm">Error</span>
        </div>
      </div>

      {/* Accessible search form */}
      <form className="mt-4 flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="video-search" className="sr-only">Search videos</label>
        <input
          id="video-search"
          type="text"
          placeholder="Search videos..."
          className="flex-1 p-2 sm:p-3 border border-border rounded accessible-focus nav-text bg-input text-sm"
          aria-describedby="search-instructions"
        />
        <div id="search-instructions" className="sr-only">
          Enter keywords to search through available training videos
        </div>
        <button
          type="submit"
          className="px-4 py-2 sm:py-3 bg-primary text-primary-foreground rounded accessible-focus hover:bg-primary/90 transition-colors text-sm font-medium"
          aria-label="Search videos"
        >
          Search
        </button>
      </form>
    </section>
  );
};

export default VideoSection;