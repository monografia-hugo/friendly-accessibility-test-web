// Video component with poor accessibility - intentional violations
import React from 'react';

const VideoSection = () => {
  return (
    <section className="stat-card p-6 rounded-lg mb-6">
      {/* Missing heading hierarchy - h4 after h1 */}
      <h4 className="text-xl font-bold stat-title mb-4">Training Videos</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video without captions/subtitles - major accessibility violation */}
        <div className="relative">
          <video 
            className="w-full h-48 bg-black rounded"
            controls
            poster="/placeholder.svg"
          >
            <source src="/sample-video.mp4" type="video/mp4" />
            {/* Fallback to online video if local file doesn't work */}
            <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
            {/* No captions or subtitles provided */}
            Your browser does not support the video tag.
          </video>
          {/* Non-semantic div used as button - accessibility violation */}
          <div 
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
            onClick={() => console.log('Favorited')}
          >
            ❤️
          </div>
        </div>

        {/* Second video with different source */}
        <div className="relative">
          <video 
            className="w-full h-48 bg-black rounded"
            controls
            poster="/placeholder.svg"
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
            {/* No captions or subtitles provided - accessibility violation */}
            Your browser does not support the video tag.
          </video>
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