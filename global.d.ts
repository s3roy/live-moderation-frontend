// global.d.ts
declare module 'sockjs-client' {
  export default class SockJS {
    constructor(url: string, protocols?: string[], options?: any);
  }
}
