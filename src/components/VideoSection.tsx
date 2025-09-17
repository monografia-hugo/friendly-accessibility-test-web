// Video component with accessibility improvements
import React, { useRef } from 'react';
import SubtitleControls from './SubtitleControls';

const VideoSection = () => {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  const subtitleTracks = [
    { label: 'English', src: '/sample-video-en.vtt', language: 'en' }
  ];

  const bunnySubtitleTracks = [
    { label: 'English', src: '/bigbuckbunny-en.vtt', language: 'en' }
  ];

  return (
    <section className="stat-card p-6 rounded-lg mb-6">
      {/* Missing heading hierarchy - h4 after h1 */}
      <h4 className="text-xl font-bold stat-title mb-4">Training Videos</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video with subtitles and accessibility features */}
        <div className="relative">
          <video 
            ref={video1Ref}
            className="w-full h-48 bg-black rounded"
            controls
            poster="/placeholder.svg"
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
            <track
              kind="subtitles"
              src="/sample-video-en.vtt"
              srcLang="en"
              label="English"
              default
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolute bottom-2 left-2">
            <SubtitleControls videoRef={video1Ref} subtitleTracks={subtitleTracks} />
          </div>
          {/* Non-semantic div used as button - accessibility violation */}
          <div 
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
            onClick={() => console.log('Favorited')}
          >
            ❤️
          </div>
        </div>

        {/* Second video with subtitles */}
        <div className="relative">
          <video 
            ref={video2Ref}
            className="w-full h-48 bg-black rounded"
            controls
            poster="/placeholder.svg"
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            <track
              kind="subtitles"
              src="/bigbuckbunny-en.vtt"
              srcLang="en"
              label="English"
              default
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolute bottom-2 left-2">
            <SubtitleControls videoRef={video2Ref} subtitleTracks={bunnySubtitleTracks} />
          </div>
        </div>
      </div>

      {/* Color-coded status without text alternative */}
      <div className="mt-4 flex gap-2">
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        {/* User must guess what colors mean - accessibility violation */}
      </div>

      {/* Form without proper labels */}
      <div className="mt-4 flex gap-2">
        <input 
          type="text" 
          placeholder="Search videos..." 
          className="flex-1 p-2 border rounded"
          // No label - accessibility violation
        />
        <input 
          type="submit" 
          value="Go"
          className="px-4 py-2 bg-primary text-white rounded cursor-pointer"
          // Low contrast button - accessibility violation
        />
      </div>
    </section>
  );
};

export default VideoSection;