import request from '@/utils/request.ts';

// 新增提交
export function changeSuperior(data: any) {
  return request({
    url: '/admin/member.Agent/changeSuperior',
    method: 'post',
    data
  });
}


export function getInfoByName(params: any) {
  return request({
    url: '/admin/member.Member/getInfoByName',
    method: 'get',
    params
  });
}

export function getUserInviteCode(params: any) {
  return request({
    url: '/admin/member.Agent/getCode',
    method: 'get',
    params
  });
}

// // 编辑充值类型
// export function addMore(data: any) {
//   return request({
//     url: '/admin/member.Member/userAdds',
//     method: 'post',
//     data
//   });
// }

export default { changeSuperior , getInfoByName, getUserInviteCode};
