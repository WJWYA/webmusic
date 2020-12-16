import request from '@/utils/request';
export function ranklist() {
    return request({
      url: 'toplist',
      method: 'get'
    });
  }