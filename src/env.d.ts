import { WindowAPI } from 'src/common/interface/common'
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }

}

declare global {
  interface Window {
    myWindowAPI: WindowAPI
  }
}
