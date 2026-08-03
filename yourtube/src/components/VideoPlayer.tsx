"use client";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  FastForward,
  Rewind,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const VideoPlayer = ({ video }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => setCurrentTime(videoElement.currentTime);
    const handleDurationChange = () => setDuration(videoElement.duration);
    const handleError = () => setError(true);

    const handlePlay = () => {
      setIsPlaying(true);
      const history = JSON.parse(localStorage.getItem("watchHistory") || "[]");
      const existingIndex = history.findIndex((v: any) => v._id === video._id);
      if (existingIndex > -1) {
        history.splice(existingIndex, 1);
      }
      const videoData = {
        ...video,
        watchedAt: new Date().toISOString(),
      };
      history.unshift(videoData);
      localStorage.setItem("watchHistory", JSON.stringify(history));
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("durationchange", handleDurationChange);
    videoElement.addEventListener("error", handleError);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("durationchange", handleDurationChange);
      videoElement.removeEventListener("error", handleError);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
    };
  }, [video]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      const newVolume = parseFloat(e.target.value);
      video.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progress = progressRef.current;
    if (video && progress) {
      const rect = progress.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = progress.clientWidth;
      const duration = video.duration;
      video.currentTime = (x / width) * duration;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current?.parentElement;
    if (videoContainer) {
      if (!isFullscreen) {
        if (videoContainer.requestFullscreen) {
          videoContainer.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const seek = (seconds: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime += seconds;
    }
  };

  if (error) {
    return (
      <div className="aspect-video bg-black rounded-xl flex items-center justify-center text-white">
        Video unavailable
      </div>
    );
  }

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        className="w-full aspect-video rounded-xl"
        poster={video.thumbnail}
        onClick={togglePlay}
      >
        <source src={video.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          ref={progressRef}
          className="w-full h-1 bg-gray-500 cursor-pointer mb-2"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-red-500"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => seek(-10)}>
              <Rewind />
            </button>
            <button onClick={togglePlay}>
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button onClick={() => seek(10)}>
              <FastForward />
            </button>
            <div className="flex items-center gap-2">
              <button onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div>
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="peer">
                {playbackRate}x
              </button>
              <div className="absolute bottom-full mb-2 hidden peer-hover:block hover:block bg-black/75 rounded-md p-1">
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-700"
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
            <button onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize /> : <Maximize />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;