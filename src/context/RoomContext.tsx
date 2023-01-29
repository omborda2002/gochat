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
  setChat: any;
  connectedUsers: any;
  setConnectedUsers: any;
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

  const setConnectedUsers = (connectedUsers: any, userId: any) => {
    console.log("connectedUsers NEWWW", connectedUsers);
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

  let value: ValueInterFace = {
    roomId: state.roomId,
    user: state.user,
    chat: state.chat,
    connectedUsers: state.connectedUsers,
    setRoomID,
    setUser,
    setChat,
    setConnectedUsers,
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
