import React, { useState } from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SubtitleControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  subtitleTracks: { label: string; src: string; language: string }[];
}

const SubtitleControls: React.FC<SubtitleControlsProps> = ({ videoRef, subtitleTracks }) => {
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('');

  const toggleSubtitles = (enabled: boolean) => {
    setSubtitlesEnabled(enabled);
    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = enabled && tracks[i].language === selectedTrack ? 'showing' : 'disabled';
      }
    }
  };

  const changeSubtitleTrack = (language: string) => {
    setSelectedTrack(language);
    if (videoRef.current && subtitlesEnabled) {
      const tracks = videoRef.current.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = tracks[i].language === language ? 'showing' : 'disabled';
      }
    }
  };

  return (
    <div className="flex items-center gap-4 p-2 bg-background/80 rounded">
      <div className="flex items-center space-x-2">
        <Switch
          id="subtitles-toggle"
          checked={subtitlesEnabled}
          onCheckedChange={toggleSubtitles}
        />
        <Label htmlFor="subtitles-toggle">Subtitles</Label>
      </div>
      
      {subtitlesEnabled && subtitleTracks.length > 0 && (
        <Select value={selectedTrack} onValueChange={changeSubtitleTrack}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {subtitleTracks.map((track) => (
              <SelectItem key={track.language} value={track.language}>
                {track.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SubtitleControls;