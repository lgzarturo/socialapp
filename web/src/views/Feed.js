import React, { useEffect, useState } from 'react'
import Axios from 'axios'

import Main from '../components/Main'
import Loading from '../components/Loading'

async function getPosts(dateLastPost) {
  const query = dateLastPost ? `?date=${dateLastPost}` : ''
  const { data: newPosts } = await Axios.get(`/api/v1/posts/feed${query}`)
  return newPosts
}

export default function Feed({ showError }) {
  const [posts, setPosts] = useState([])
  const [loadInitialPosts, setLoadInitialPosts] = useState(true)
  useEffect(() => {
    async function loadInitialPosts() {
      try {
        const posts = await getPosts()
        if (posts.length === 0) {
          showError('No posts found')
        }
        setPosts(posts)
        setLoadInitialPosts(false)
      } catch (error) {
        showError(error.message)
        console.log(error)
      }
    }
    loadInitialPosts()
  }, [])
  return (
    <Main center>
      <h1>Feed</h1>
      <div>{JSON.stringify(posts)}</div>
    </Main>
  )
}
