
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from 'react-query'
import { makeRequest } from "../../axios";
import React, { useState } from 'react';
import SortIcon from '@mui/icons-material/Sort';

const Posts = ({userID,clubID}) => {
  const [filter, setFilter] = useState('all');

  const { isLoading, error, data } = useQuery(['posts', { filter, clubID }], () => {
    if (clubID) {
    
      return makeRequest.get('/posts', { params: { clubID } }).then((res) => res.data);
    } else {
      
      return makeRequest.get('/posts', { params: { filter } }).then((res) => res.data);
    }
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  console.log(data);

  return (
    <div className="posts">
      {clubID ? null : (<div className="filter-buttons">
        <button className={`filter-button ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilterChange('all')}>
          All
        </button>
        <button className={`filter-button ${filter === 'enrolled' ? 'active' : ''}`} onClick={() => handleFilterChange('enrolled')}>
          Enrolled
        </button>
        <button className={`filter-button ${filter === 'events' ? 'active' : ''}`} onClick={() => handleFilterChange('events')}>
          Events 
        </button> <SortIcon style={{padding:"10px"}}/>
      </div>)}
      {error ? (
        <p>Something went wrong </p>
      ) : isLoading ? (
        <p>Loading</p>
      ) : (
        data.map((post) => <Post post={post} key={post.id} />)
      )}
    </div>
  );
};

export default Posts;

