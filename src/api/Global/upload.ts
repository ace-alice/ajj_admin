import request from '@/utils/request';
import { getLocal, getSession } from '@/utils/storage';

// const baseApi = getLocal('baseApi');

export function upload(url: string, data: any) {
  url = url || window.location.origin + '/api' + '/admin/file.File/add';
  return request({
    url: url,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  });
}

export const uploadApi = {
  // 单文件上传
  fileUploadApi: window.location.origin + '/api' + '/admin/file.File/add',
  baseApi: location.origin,
  headers: { AdminToken: getLocal('token') }
};

export const userAddsApi = {
  // 单文件上传
  fileUploadApi:
    window.location.origin + '/api' + '/admin/member.Member/userAdds',
  baseApi: location.origin,
  headers: { AdminToken: getLocal('token') }
};
