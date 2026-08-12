import React from 'react'
import { Route , Routes} from 'react-router-dom';
import Login from './pages/login';
import Discover from './pages/discover';
import Createpost from './pages/createpost';
import Profile from './pages/profile';
import Chatbox from './pages/chatbox';
import Feed from './pages/feed';
import Message from './pages/message';
import Connections from './pages/connections';

const App = () => {
  return (
    <div>
     <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/discover' element={<Discover/>}/>
      <Route path='/createpost' element={<Createpost/>}/>
      <Route path='/profile' element={<Profile/>}/>
       <Route path='/profile/:profileId' element={<Profile/>}/>
      <Route path='/mesasge:UserId' element={<Chatbox/>}/>
      <Route path='/feed' element={<Feed/>}/>
      <Route path='/mesasge' element={<Message/>}/>
      <Route path='/connections' element={<Connections/>}/>


      
     </Routes>
    </div>
  )
}

export default App
