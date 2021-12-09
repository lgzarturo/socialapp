import React, { useEffect } from 'react';
import Axios from 'axios';

import Main from '../components/Main';
import Loading from '../components/Loading';

async function getPosts(dateLastPost) {
  const query = dateLastPost ? `?date=${dateLastPost}` : '';
  const { data } = await Axios.get(`/api/v1/posts/feed${query}`);
  return data;
}

export default function Feed({ showError }) {
  useEffect(() => {
    async function getInitialPosts() {
      try {
        const posts = await getPosts();
        console.log(posts);
        if (posts.length === 0) {
          showError('No posts found');
        }
      } catch (error) {
        showError(error.message);
      }
    }
    getInitialPosts();
  }, []);
  return (
    <Main center>
      <h1>Feed</h1>
    </Main>
  );
}
