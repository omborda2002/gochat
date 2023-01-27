import React, { createContext, useReducer, useContext } from "react";
import RoomReducer, {
  initialState,
  RoomActionKind,
} from "@/reducers/RoomReducer";

export const RoomContext = createContext(initialState);

interface ValueInterFace {
  roomId: any
  setRoomID: (roomId: string) => void
}

export const RoomProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(RoomReducer, initialState);

  const setRoomID = (roomId: string) => {
    dispatch({
      type: RoomActionKind.ROOMID,
      payload: roomId,
    });
  };

  let value: ValueInterFace = {
    roomId: state.roomId,
    setRoomID,
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
