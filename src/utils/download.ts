import { ElMessage } from 'element-plus';
import axios from 'axios';
import { parseTime } from './formatTime';
import { getLocal, getSession } from './storage';
const baseApi = getLocal('baseApi');

/**
 * @param {string} url 请求地址
 * @param {Object} params 参数
 * @param {string} title 导出名
 * @param {'xlsx' | 'xls' | 'txt' | 'pdf'} format 导出格式
 * @return 二进制文件流，自动下载xlsx
 * @example
 */
export function download(
  url: string,
  params: { [key: string]: any },
  title: string = '数据',
  exportMethod: 'get' | 'post' = 'get',
  format: 'xlsx' | 'xls' | 'txt' | 'pdf' = 'xlsx'
) {
  let requestExport = {};
  if (exportMethod === 'get') {
    requestExport = {
      method: 'get',
      params,
      url: `${baseApi}/${url}`,
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getLocal('token')
      }
    };
  } else {
    requestExport = {
      method: exportMethod,
      data: params,
      url: `${baseApi}/${url}`,
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getLocal('token')
      }
    };
  }

  return axios(requestExport)
    .then((res) => {
      downloadFile(res.data, title, format);
    })
    .catch((err) => {
      ElMessage({
        message: err || '导出数据失败！',
        type: 'error'
      });
    });
}

/**
 * @param {string} obj 下载的流文件
 * @param {Object} name 文件名
 * @param {'xlsx' | 'xls' | 'txt' | 'pdf'} suffix 导出格式
 * @example
 */
export function downloadFile(
  obj: any,
  name: string,
  suffix: 'xlsx' | 'xls' | 'txt' | 'pdf'
) {
  const url = window.URL.createObjectURL(new Blob([obj]));
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  const fileName = parseTime(new Date()) + '-' + name + '.' + suffix;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
