// 判断是否是mac系统
import { Platform} from 'quasar'
import { ref } from 'vue'
export const usePlatForem = () => {
  const isMac = ref(Platform.is.mac)
  const isElectron = ref(Platform.is.electron)
  return { isMac, isElectron }
}


