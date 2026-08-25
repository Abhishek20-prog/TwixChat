import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import dummyUsers from '../data/dummyUsers';
import dummyPosts from '../data/dummyposts';

const profile = () => {
  const {profileID}=useParams()
  const {users , setusers}=useState(null)
  const {posts , setposts}=useState([])
  const {activetab, setactivetab}=useState('posts')
  const {showedit , setshowedit}=useState(false)
  const fetchuser = async () => {
    setusers(dummyUsers)
    setposts(dummyPosts)
    
  }
  useEffect(()=>{
    fetchuser()
  },[])

  return (
    <div>
      
    </div>
  )
}

export default profile
