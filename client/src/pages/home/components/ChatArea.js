import React from 'react';
import { useSelector } from 'react-redux';

function ChatArea() {
    const { selectedChat, user } = useSelector(state => state.userReducer)
    const receipentUser = selectedChat.members.find(
        (mem) => mem._id !== user._id
    );
    console.log(receipentUser);
    return (
        <div className='ml-10 bg-white h-[82vh] border rounded-2xl w-full flex flex-col justify-between p-5'>
           {/* 1st-part-receipent-user */}
           <div>
                {receipentUser.name}
           </div>
           {/* 2nd-part-receipent-user */}
           <div>
                Chat Messages
           </div>
           {/* 3rd-part-receipent-user */}
            <div>
                Chat Input
            </div>
        </div>
    );
}

export default ChatArea