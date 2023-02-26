import React from 'react'
import ChatArea from './components/ChatArea'
import UserSearch from './components/UserSearch'
import UsersList from './components/UsersList';

const Home = () => {
  const [searchKey, setSearchKey] = React.useState("");
  return (
    <div className="flex">
      
      {/* 1st part user search, userslist/chatlist */}
      <div className='w-96 gap-5'>
        <UserSearch
          searchKey={searchKey}
          setSearchKey={setSearchKey}
        />
        <UsersList
          searchKey={searchKey}
        />
      </div>

      {/* 2nd paort chatbox */}
      <div>
        <ChatArea/>
      </div>
    </div>
  )
}

export default Home