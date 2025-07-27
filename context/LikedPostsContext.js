import React, { createContext, useContext, useState } from 'react';

const LikedPostsContext = createContext();

export const useLikedPosts = () => useContext(LikedPostsContext);

export const LikedPostsProvider = ({ children }) => {
  const [likedFeeds, setLikedFeeds] = useState({});

  const toggleLike = (id) => {
    setLikedFeeds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <LikedPostsContext.Provider value={{ likedFeeds, toggleLike }}>
      {children}
    </LikedPostsContext.Provider>
  );
};
