export enum RoomActionKind {
  ROOMID = "ROOMID",
}

interface RoomState {
  roomId: string | null;
}

interface RoomAction {
  type: RoomActionKind;
  payload: any;
}

export const initialState = {
  roomId: null,
};

const RoomReducer = (state: RoomState, action: RoomAction) => {
  const { type, payload } = action;
  switch (type) {
    case RoomActionKind.ROOMID:
      return {
        ...state,
        roomId: payload,
      };
    default:
      return state;
  }
};

export default RoomReducer;
