import request from '@/utils/request.ts';

// 常规活动记录活动记录—-新手任务记录
export function list(params: any) {
  return request({
    url: '/admin/activity.ActivityRecords/lotteryList',
    method: 'get',
    params
  });
}

// 常规活动记录活动记录—-抽奖记录派奖
export function sendLottery(data: any) {
  return request({
    url: '/admin/activity.ActivityRecords/sendLottery',
    method: 'post',
    data
  });
}

// 常规活动记录活动记录—-抽奖记录派奖详情
export function lotteryInfo(params: any) {
  return request({
    url: '/admin/activity.ActivityRecords/lotteryInfo',
    method: 'get',
    params
  });
}

// 活动列表
export function lotteryActivityList() {
  return request({
    url: '/admin/activity.ActivityRecords/lotteryActivityList',
    method: 'get'
  });
}

export default { list, sendLottery, lotteryInfo, lotteryActivityList };
