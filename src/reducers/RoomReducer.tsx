export enum RoomActionKind {
  ROOMID = "ROOMID",
  USER = "USER",
  CHAT = "CHAT",
  CONNECTED_USERS = "CONNECTED_USERS",
  DISCONNECTED_USERS = "DISCONNECTED_USERS",
  MESSAGES = "MESSAGES",
  ADD_MESSAGE = "ADD_MESSAGE",
}

interface RoomState {
  roomId: string | null;
  user: any;
  chat: any;
  connectedUsers: any;
  messages: any;
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
  messages: [],
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

    case RoomActionKind.DISCONNECTED_USERS:
      return {
        ...state,
        connectedUsers: state.connectedUsers.filter(
          (user: any) => user.currentUser_id !== payload
        ),
      };

    case RoomActionKind.MESSAGES:
      return {
        ...state,
        messages: payload,
      };

    case RoomActionKind.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, payload],
      };

    default:
      return state;
  }
};

export default RoomReducer;
