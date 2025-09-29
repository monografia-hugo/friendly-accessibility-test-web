import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SubtitleControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  subtitleTracks: { label: string; src: string; language: string }[];
}

const SubtitleControls: React.FC<SubtitleControlsProps> = ({ videoRef, subtitleTracks }) => {
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true); // Ativado por padrão
  const [selectedTrack, setSelectedTrack] = useState(subtitleTracks.length > 0 ? subtitleTracks[0].language : '');

  // Inicializar legendas quando o componente for montado
  useEffect(() => {
    if (videoRef.current && subtitleTracks.length > 0) {
      const tracks = videoRef.current.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].language === selectedTrack) {
          tracks[i].mode = 'showing';
        } else {
          tracks[i].mode = 'disabled';
        }
      }
    }
  }, [videoRef, selectedTrack, subtitleTracks]);

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
    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].language === language && subtitlesEnabled) {
          tracks[i].mode = 'showing';
        } else {
          tracks[i].mode = 'disabled';
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-4 p-2 bg-background/80 rounded" role="group" aria-label="Controles de legendas">
      <div className="flex items-center space-x-2">
        <Switch
          id="subtitles-toggle"
          checked={subtitlesEnabled}
          onCheckedChange={toggleSubtitles}
          aria-describedby="subtitles-description"
        />
        <Label htmlFor="subtitles-toggle" className="text-sm nav-text">Áudio Descrição</Label>
      </div>

      {subtitlesEnabled && subtitleTracks.length > 0 && (
        <div className="flex items-center gap-2">
          <Label htmlFor="subtitle-language" className="text-sm nav-text sr-only">
            Selecionar idioma das legendas
          </Label>
          <Select value={selectedTrack} onValueChange={changeSubtitleTrack}>
            <SelectTrigger className="w-32" id="subtitle-language" aria-label="Selecionar idioma das legendas">
              <SelectValue placeholder="Idioma" />
            </SelectTrigger>
            <SelectContent>
              {subtitleTracks.map((track) => (
                <SelectItem key={track.language} value={track.language}>
                  {track.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div id="subtitles-description" className="sr-only">
        Ative ou desative as legendas do vídeo. Quando ativado, você pode selecionar o idioma das legendas.
      </div>
    </div>
  );
};

export default SubtitleControls;