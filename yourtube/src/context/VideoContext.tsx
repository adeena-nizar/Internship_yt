"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
interface Video {
  _id: string;
  thumbnail: string;
  duration: string;
  channelAvatar: string;
  title: string;
  channelName: string;
  isVerified?: boolean;
  views: string;
  uploadedAt: string;
  category?: string;
  videoUrl: string;
}

interface HistoryVideo extends Video {
  watchedAt: Date;
}

interface VideoContextType {
  history: HistoryVideo[];
  likedVideos: Video[];
  watchLater: Video[];
  addToHistory: (video: Video) => void;
  clearHistory: () => void;
  removeFromHistory: (videoId: string) => void;
  toggleLike: (video: Video) => void;
  isLiked: (videoId: string) => boolean;
  toggleWatchLater: (video: Video) => void;
  isInWatchLater: (videoId: string) => boolean;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider = ({ children }: VideoProviderProps) => {
  const [history, setHistory] = useState<HistoryVideo[]>([]);
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [watchLater, setWatchLater] = useState<Video[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('video-history');
    const storedLiked = localStorage.getItem('video-liked');
    const storedWatchLater = localStorage.getItem('video-watch-later');

    if (storedHistory) setHistory(JSON.parse(storedHistory));
    if (storedLiked) setLikedVideos(JSON.parse(storedLiked));
    if (storedWatchLater) setWatchLater(JSON.parse(storedWatchLater));
  }, []);

  useEffect(() => {
    localStorage.setItem('video-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('video-liked', JSON.stringify(likedVideos));
  }, [likedVideos]);

  useEffect(() => {
    localStorage.setItem('video-watch-later', JSON.stringify(watchLater));
  }, [watchLater]);

  const addToHistory = (video: Video) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.filter(v => v._id !== video._id);
      return [{ ...video, watchedAt: new Date() }, ...newHistory];
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeFromHistory = (videoId: string) => {
    setHistory(prevHistory => prevHistory.filter(v => v._id !== videoId));
  };

  const toggleLike = (video: Video) => {
    setLikedVideos(prevLiked => {
      const isLiked = prevLiked.some(v => v._id === video._id);
      if (isLiked) {
        return prevLiked.filter(v => v._id !== video._id);
      } else {
        return [video, ...prevLiked];
      }
    });
  };
  
  const isLiked = (videoId: string) => likedVideos.some(v => v._id === videoId);

  const toggleWatchLater = (video: Video) => {
    setWatchLater(prevWatchLater => {
      const isInList = prevWatchLater.some(v => v._id === video._id);
      if (isInList) {
        return prevWatchLater.filter(v => v._id !== video._id);
      } else {
        return [video, ...prevWatchLater];
      }
    });
  };

  const isInWatchLater = (videoId: string) => watchLater.some(v => v._id === videoId);

  const value = {
    history,
    likedVideos,
    watchLater,
    addToHistory,
    clearHistory,
    removeFromHistory,
    toggleLike,
    isLiked,
    toggleWatchLater,
    isInWatchLater,
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};