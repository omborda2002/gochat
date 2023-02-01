import React, { createContext, useReducer, useContext } from "react";
import RoomReducer, {
  initialState,
  RoomActionKind,
} from "@/reducers/RoomReducer";

export const RoomContext = createContext(initialState);

interface ValueInterFace {
  roomId: any;
  setRoomID: any;
  user: any;
  setUser: any;
  chat: any;
  messages: any;
  setChat: any;
  connectedUsers: any;
  setConnectedUsers: any;
  setDisconnectedUsers: any;
  setMessages: any;
  setNewMessage: any;
}

export const RoomProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(RoomReducer, initialState);

  const setRoomID = (roomId: string) => {
    dispatch({
      type: RoomActionKind.ROOMID,
      payload: roomId,
    });
  };

  const setUser = (user: any) => {
    dispatch({
      type: RoomActionKind.USER,
      payload: user,
    });
  };

  const setChat = (chat: any) => {
    dispatch({
      type: RoomActionKind.CHAT,
      payload: chat,
    });
  };

  const setConnectedUsers = (connectedUsers: any, userId: any): void => {
    if (Array.isArray(connectedUsers)) {
      connectedUsers = connectedUsers.filter(
        (user: any) => user.currentUser_id !== userId
      );
    } else {
      connectedUsers = [...state.connectedUsers, connectedUsers];
    }

    console.log("connectedUsers NEWWW 2 => ", connectedUsers);

    dispatch({
      type: RoomActionKind.CONNECTED_USERS,
      payload: connectedUsers,
    });
  };

  const setDisconnectedUsers = (disconnectedUsers: any): void => {
    console.log("disconnectedUsers client=> ", disconnectedUsers);
    dispatch({
      type: RoomActionKind.DISCONNECTED_USERS,
      payload: disconnectedUsers,
    });
  };

  const setMessages = (messages: any): void => {
    if (Array.isArray(messages)) {
      for (let i = 0; i < messages.length; i++) {
        for (let j = 0; j < state.messages.length; j++) {
          if (messages[i]._id !== state.messages[j]._id) {
            messages = [...state.messages, messages[i]];
          }
        }
      }
    } else {
      messages = [...state.messages, messages];
    }

    console.log("messages )))=> ", messages);

    dispatch({
      type: RoomActionKind.MESSAGES,
      payload: messages,
    });
  };

  const setNewMessage = (message: any): void => {
    console.log("message => ", message);
    dispatch({
      type: RoomActionKind.ADD_MESSAGE,
      payload: message,
    });
  };

  let value: ValueInterFace = {
    roomId: state.roomId,
    user: state.user,
    chat: state.chat,
    connectedUsers: state.connectedUsers,
    messages: state.messages,
    setRoomID,
    setUser,
    setChat,
    setConnectedUsers,
    setDisconnectedUsers,
    setMessages,
    setNewMessage,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useShop must be used within ShopContext");
  }
  return context;
};

export default useRoom;
