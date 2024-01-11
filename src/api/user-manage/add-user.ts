import request from '@/utils/request.ts';

// 单条会员增加
export function addOne(data: any) {
  return request({
    url: '/admin/member.Member/userAdd',
    method: 'post',
    data
  });
}

// 编辑充值类型
export function addMore(data: any) {
  return request({
    url: '/admin/member.Member/userAdds',
    method: 'post',
    data
  });
}

export default { addOne, addMore };
