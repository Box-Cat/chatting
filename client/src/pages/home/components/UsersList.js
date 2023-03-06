import React from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { HideLoader, ShowLoader } from '../../../redux/loaderSlice';
import { SetAllChats, SetSelectedChat } from '../../../redux/userSlice';
import { CreateNewChat } from '../../../apicalls/chats';

function UsersList({ searchKey }) {
    const { allUsers, allChats, user, selectedChat } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    const createNewChat = async (receipentUserId) => {
        try {
            dispatch(ShowLoader());
            const response = await CreateNewChat([user._id, receipentUserId]);
            dispatch(HideLoader());
            if (response.success) {
                toast.success(response.message)
                const newChat = response.data;
                const updatedChats = [...allChats, newChat];
                dispatch(SetAllChats(updatedChats));
                dispatch(SetSelectedChat(newChat));
            }
        } catch (error) {
            dispatch(HideLoader());
            toast.error(error.message);
        }
    }

    const openChat = (receipentUserId) => {
        const chat = allChats.find(
            (chat) =>
                chat.members.map((mem) => mem._id).includes(user._id) &&
                chat.members.map((mem) => mem._id).includes(receipentUserId)
        );
        if (chat) {
            dispatch(SetSelectedChat(chat));
        }
    }

    const getData = () => {
        return allUsers
            .filter((userObj) => (userObj.name.toLowerCase().includes(searchKey.toLowerCase()) && searchKey)
                || allChats.some((chat) => chat.members.map((mem) => mem._id).includes(userObj._id))
            );
    };

    const getIsSelectedChatOrNot = (userObj) => {
        if (selectedChat) {
            return selectedChat.members.map((mem) => mem._id).includes(userObj._id)
        }
        return false
    }

    return (
        <div className='flex flex-col gap-3 mt-5'>
            {getData()
                .map((userObj) => {
                    return (
                        <div
                            className={`shadow-sm border p-2 rounded-xl bg-white flex justify-between items-center cursor-pointer w-full
                                ${getIsSelectedChatOrNot(userObj) && 'border-primary border-2'}
                            `}
                            key={userObj._id}
                            onClick={() => openChat(userObj._id)}
                        >
                            <div className='flex gap-5 item-center'>
                                {userObj.profilePic && ( //profile 사진이 있으면
                                    <img
                                        src={userObj.profilePic}
                                        alt="profile pic"
                                        className='w-10 h-10 rounded-full'
                                    />
                                )}
                                {!userObj.profilePic && (
                                    <div className="bg-gray-400 rounded-full h-12 w-12 flex items-center justify-center relative">
                                        <h1 className="uppercase text-xl font-semibold text-white">
                                            {userObj.name[0]}
                                        </h1>
                                    </div>
                                )}
                                <h1>{userObj.name}</h1>
                            </div>
                            <div onClick={() => createNewChat(userObj._id)}>
                                {!allChats.find((chat) => chat.members.map((mem) => mem._id).includes(userObj._id)) && (
                                    <button className="border-primary border text-primary bg-white p-1 rounded">
                                        Create Chat
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}

export default UsersList;