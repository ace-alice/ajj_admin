/**
 * @description form表单验证信息方法
 * @description userTypeValidator -- 登录账号验证(字母开头，允许4-12字节，允许字母数字)
 * @description userPasswordValidator -- 用户密码验证(字母开头，允许8-12字节，允许字母数字)
 * @description userPhoneValidator -- 国内电话号码验证
 * @description userEmailValidator -- 邮箱验证
 *
 */
export function RuleValidator() {
  // old 登录账号 (字母开头，允许4-12字节，允许字母数字)
  // new 登录账号 允许3-18字节，允许字母数字)
  const userTypeValidator = (rule: any, value: any, callback: any) => {
    // false: 登录账号不正确
    if (!value) callback();
    // if (!/^[a-zA-Z][a-zA-Z0-9]{4,11}$/.test(value)) {
    if (!/^[a-zA-Z0-9.]{3,18}$/.test(value)) {
      callback(new Error('请输入长度在3-18字节，只能包含字母、数字、标点"."'));
    } else {
      callback();
    }
  };

  // old 用户密码 (字母开头，允许8-12字节，允许字母数字)
  // new 用户密码 (允许6-20字节，允许字母数字)
  const userPasswordValidator = (rule: any, value: any, callback: any) => {
    // false: 用户密码不正确
    if (!value) callback();
    if (!/^[a-zA-Z0-9]{6,20}$/.test(value)) {
      callback(new Error('长度在6-20之间，只能包含字母、数字'));
    } else {
      callback();
    }
  };

  // 国内电话号码
  const userPhoneValidator = (rule: any, value: any, callback: any) => {
    // false: 国内电话号码不正确
    if (!value) callback();
    if (!/^(861||\+861||1)[1-9][0-9]{9}$/.test(value)) {
      callback(new Error('手机号不合法'));
    } else {
      // true: 国内电话号码正确
      callback();
    }
  };

  // 国内电话号码
  const userEmailValidator = (rule: any, value: any, callback: any) => {
    // false: 邮箱不正确
    if (!value) callback();
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      )
    ) {
      callback(new Error('邮箱不正确'));
    } else {
      // true: 邮箱正确
      callback();
    }
  };

  return {
    userTypeValidator,
    userPasswordValidator,
    userPhoneValidator,
    userEmailValidator
  };
}
