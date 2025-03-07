import {ref} from 'vue';
import {api} from 'src/boot/axios';

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

interface RequestOptions {
  method?: RequestMethod;
  data?: unknown;
  params?: Record<string, unknown> | undefined;
  signal?: AbortSignal;
  interceptors?: {
    request?: (config: any) => any;
    response?: (response: any) => any;
  };
}

const errorCodeHandler = (code: number) => {
  const messages: Record<number, string> = {
    400: '请求参数错误',
    401: '登录已过期，请重新登录',
    403: '没有操作权限',
    404: '资源不存在',
    500: '服务器错误',
    503: '服务不可用'
  };
  return messages[code] || '未知错误';
};

export function useApi<T>() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const data = ref<T | null>(null);
  const abortController = ref(new AbortController());


  const request = async (url: string, options: RequestOptions = {}) => {
    try {
      loading.value = true;
      error.value = null;
      let config = {
        url,
        method: options.method || 'get',
        data: options.data,
        params: options.params,
        signal: abortController.value.signal
      };
      if (options.interceptors?.request) {
        config = options.interceptors.request(config);
      }

      const response = await api(config);

      let processedData = response.data;
      if (options.interceptors?.response) {
        processedData = options.interceptors.response(response);
      }
      data.value = processedData;
      return processedData;

    } catch (err: any) {
      // 错误处理增强
      const status = err.response?.status;
      const message = errorCodeHandler(status) || err.message;

      error.value = `${message} (${status || 'ERR_CONNECTION'})`;

      // 特殊错误码处理
      if (status === 401) {
        window.location.href = '/login';
      }
      return null;
    } finally {
      loading.value = false;
    }
  };
  // 取消请求
  const cancel = (message = '用户取消请求') => {
    abortController.value.abort(message);
    abortController.value = new AbortController();
  };
  return {
    loading,
    error,
    data,
    cancel,
    get: (url: string, params?: Record<string, unknown>) => request(url, {method: 'get', params,}),
    post: (url: string, data: unknown) => request(url, {method: 'post', data}),
    put: (url: string, data: unknown) => request(url, {method: 'put', data}),
    del: (url: string) => request(url, {method: 'delete'})
  };
}
