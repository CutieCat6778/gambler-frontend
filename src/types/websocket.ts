export enum WebSocketEvent {
  WS_CONNECTION = 0,
  WS_CLOSE,
  WS_ERR,
  MESSAGE,
  BET_ACTION_BET,
  BET_ACTION_CANCEL,
  BET_INFO,
  BET_INFO_RES,
  BET_UPDATE,
  PING,
  PONG,
}

export interface WebSocketMessage {
  event: number;
  data: Uint8Array;
}
