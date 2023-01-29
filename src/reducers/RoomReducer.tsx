export enum RoomActionKind {
  ROOMID = "ROOMID",
  USER = "USER",
  CHAT = "CHAT",
  CONNECTED_USERS = "CONNECTED_USERS",
}

interface RoomState {
  roomId: string | null;
  user: any;
  chat: any;
  connectedUsers: any;
}

interface RoomAction {
  type: RoomActionKind;
  payload: any;
}

export const initialState = {
  roomId: null,
  user: null,
  chat: [],
  connectedUsers: [],
};

const RoomReducer = (state: RoomState, action: RoomAction) => {
  const { type, payload } = action;
  switch (type) {
    case RoomActionKind.ROOMID:
      return {
        ...state,
        roomId: payload,
      };

    case RoomActionKind.USER:
      return {
        ...state,
        user: payload,
      };
    case RoomActionKind.CHAT:
      return {
        ...state,
        chat: payload,
      };
    case RoomActionKind.CONNECTED_USERS:
      return {
        ...state,
        connectedUsers: payload,
      };

    default:
      return state;
  }
};

export default RoomReducer;
