import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import dummyUsers from '../data/dummyUsers';
import dummyPosts from '../data/dummyposts';
import Loading from '../components/loading';

const profile = () => {
  const {profileID}=useParams()
  const [user , setuser]=useState(null)
  const [posts , setposts]=useState([])
  const [activetab, setactivetab]=useState('posts')
  const [showedit , setshowedit]=useState(false)
  const fetchuser = async () => {
    setuser(dummyUsers)
    setposts(dummyPosts)
    
  }
  useEffect(()=>{
    fetchuser()
  },[])

  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
  <div className="max-w-3xl mx-auto">

    {/* Profile Card */}
    <div className="bg-white rounded-2xl shadow overflow-hidden">

      {/* Cover Photo */}
      <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
        {user.cover && (
          <img
            src={user.cover}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

    </div>

  </div>
</div>
  ):(<Loading/>)
}

export default profile
