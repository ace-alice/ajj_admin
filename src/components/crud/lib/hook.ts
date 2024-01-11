/* eslint-disable indent */
import { nextTick, onActivated, onMounted, reactive, Ref, ref } from 'vue';
import { parseTime as parseTimeFn } from '@/utils/formatTime';
import Sortable from 'sortablejs';
import {
  CrudMethodType,
  CrudmsgType,
  CrudNOTIFICATION_TYPE,
  CrudOptionsType,
  CrudOptShowType,
  crudPageType,
  CrudResDataType,
  crudStatusType,
  Row,
  STATUSType
} from './interface';
import { ElNotification } from 'element-plus';
import { callVmHook, HOOK } from './utils';
//  引入store实例
import { store } from '@/store/index.ts';

//  引入下载方法
import { download } from '@/utils/download';

/**
 * @description 后台获取的租户权限按钮标识数组
 */
const roles = store.state.userInfos.roles;

function isHave(Authority: string): boolean {
  return roles.includes(Authority);
}

import { i18n } from '@/i18n';
/**
 *@description CRUD HOOK方法 包含了基础的 增、删、改、查
 * @param crudOptions 一些可配置的参数
 * @returns crud对象
 */
export default function CRUD(crudOptions: CrudOptionsType) {
  const keys = Object.keys(crudOptions);
  const hasKey = (key: string) => {
    return keys.includes(key);
  };

  /**
   *@description 一些权限判断方法
   */
  const crudFindRole = {
    /**
     * @description 只满足一个权限标识
     * @param Authority 权限标识字符串
     */
    only(Authority: string) {
      try {
        // if (roles && roles.length > 0 && roles[0] === '*:*:*') return true;
        return !!roles.includes(Authority);
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    /**
     * @description 满足所有列出的权限标识
     * @param Authoritys 权限标识数组
     */
    all(Authoritys: Array<string>) {
      try {
        // if (roles && roles.length > 0 && roles[0] === '*:*:*') return true;
        return Authoritys.every(isHave);
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    /**
     * @description 只要满意一个权限即可
     * @param Authoritys 权限标识数组
     */
    once(Authoritys: Array<string>) {
      try {
        // if (roles && roles.length > 0 && roles[0] === '*:*:*') return true;
        return Authoritys.some(isHave);
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  };

  /**
   * @description 时间格式化方法
   */
  const parseTime = parseTimeFn;

  /**
   * @description 状态标识
   */
  const STATUS: STATUSType = {
    NORMAL: 0,
    PREPARED: 1,
    PROCESSING: 2
  };

  /**
   * @description 结果状态标识
   */
  const NOTIFICATION_TYPE: CrudNOTIFICATION_TYPE = {
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info',
    ERROR: 'error'
  };

  /**
   * @description 成功提示语
   */
  const MSG: CrudmsgType = {
    submit: i18n.global.t('crud.Submittedsuccessfully'),
    add: i18n.global.t('crud.Addsuccessfully'),
    edit: i18n.global.t('crud.Editsuccessfully'),
    del: i18n.global.t('crud.Deletesuccessfully'),
    recall: i18n.global.t('crud.Recallsuccessfully'),
    top: i18n.global.t('crud.BaseHandlesuccessfully')
  };

  /**
   * @description 插件标识
   */
  let crudTag: string | undefined = 'default';
  if (hasKey('crudTag')) {
    crudTag = crudOptions['crudTag'];
  }

  const crudPermission = reactive({
    add: crudTag + 'add',
    edit: crudTag + 'edit',
    delete: crudTag + 'delete',
    recall: crudTag + 'recall',
    top: crudTag + 'top'
  });

  /**
   * @description 是否加载时请求list接口
   */
  let crudCreateQuery = true;
  if (hasKey('crudCreateQuery')) {
    crudCreateQuery = crudOptions['crudCreateQuery'] as any;
  }

  /**
   *  @description 钩子函数
   */
  const crudHook = reactive(Object.assign({}, HOOK));

  /**
   *  @description 数据主键，默认从接口返回数据中取该值存入 crudResData 中
   */
  const crudPrimarykey: Ref<string> = ref('id');
  if (hasKey(`crudPrimarykey`)) {
    crudPrimarykey.value = crudOptions['crudPrimarykey'] as any;
  }

  /**
   *  @description 标题（新增和编辑弹窗的title）
   */
  const crudTitle: Ref<string | undefined> = ref('');
  if (hasKey('crudTitle')) {
    crudTitle.value = crudOptions['crudTitle'];
  }

  /**
   *  @description 启用分页查询标识
   */
  let isPageQuery: boolean | undefined = true;
  if (hasKey('isPageQuery')) {
    isPageQuery = crudOptions['isPageQuery'];
  }

  /**
   *  @description 响应数据
   */
  let crudResData: CrudResDataType = reactive({});

  /**
   *  @description 删除传参keys
   */
  let crudDelKeys: Array<string> | undefined = ['id'];
  if (hasKey('crudDelKeys')) {
    crudDelKeys = crudOptions['crudDelKeys'];
  }

  /**
   *  @description 表格多选时的已选项
   */
  const crudSelections: Ref<Array<Row>> = ref([]);

  /**
   *  @description form表单DOM标识<crudDefaultForm>
   */
  const crudFormRefsKey = ref('crudDefaultForm');
  if (hasKey('crudFormRefsKey')) {
    crudFormRefsKey.value = crudOptions['crudFormRefsKey'] as any;
  }

  /**
   *  @description form表单DOM标识<crudDefaultForm>
   */
  let crudDefaultFormRefs: any = null;
  function getCrudDefaultFormRefs($refs: any) {
    crudDefaultFormRefs = $refs;
    return crudDefaultFormRefs;
  }

  /**
   *  @description 表单数据 （从表格获取，提交时使用）
   */
  let crudForm: Row = reactive({});

  /**
   *  @description 初始化表单数据 （新增时初始化代理表单数据）
   */
  let defaultForm: Row = reactive({});
  if (hasKey('defaultForm')) {
    defaultForm = Object.assign(defaultForm, crudOptions['defaultForm']);
  }

  /**
   *  @description 代理表单数据 （新增和编辑时实际操作的数据）
   */
  let proxyForm: Row = reactive({});

  /**
   *  @description 查询条件
   */
  let crudQuery: Row = reactive({});

  /**
   *  @description 初始化查询条件数据
   */
  let defaultQuery: Row = reactive({});
  if (hasKey('defaultQuery')) {
    defaultQuery = Object.assign(defaultQuery, crudOptions['defaultQuery']);
    crudQuery = Object.assign(
      crudQuery,
      defaultQuery,
      crudOptions['defaultQuery']
    );
  }

  /**
   *  @description 暴露给外部的修改 crudQuery 的方法
   * @param setObj 需要修改的查询条件
   */
  function crudSetQueryKey(setObj: Row) {
    crudQuery = Object.assign(crudQuery, setObj);
  }

  /**
   *  @description 暴露给外部的修改 proxyForm 的方法
   * @param setObj 需要修改的查询条件
   */
  function crudSetProxyFormKey(setObj: Row) {
    proxyForm = Object.assign(proxyForm, setObj);
  }

  /**
   * @description 加载延时
   */
  const time = 50;
  /**
   * @description crud接口
   *  @type {*} */
  let crudMethod: CrudMethodType = reactive({
    list: (): Promise<CrudResDataType> =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ code: 200, rows: [{ name: 'crud' }] });
        }, 2000);
      }),
    add: (): Promise<CrudResDataType> =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ code: 200 });
        }, 2000);
      }),
    edit: (): Promise<CrudResDataType> =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ code: 200 });
        }, 2000);
      }),
    del: (): Promise<CrudResDataType> =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ code: 200 });
        }, 2000);
      })
  });
  if (hasKey('crudMethod')) {
    crudMethod = Object.assign(crudMethod, crudOptions['crudMethod']);
  }

  //  下载接口地址
  let downloadUrl = '';
  if (hasKey('downloadUrl')) {
    downloadUrl = crudOptions['downloadUrl'] ? crudOptions['downloadUrl'] : '';
  }

  /**
   * @description 修改状态的一些接口的统一调用形式
   * @param fnName 需要调用的api的名称
   * @param value 需要传入的数据
   */
  function changeStatus(fnName: any, value: any) {
    return new Promise((resolve, reject) => {
      (crudMethod as any)
        [fnName](value)
        .then((result: any) => {
          if (result.code == 1) {
            editSuccessNotify();
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  // 按钮显示控制标识
  /**
   * @description 一些页面显示的按钮及插件
   * @param query 是否显示查询区域
   * @param add 是否显示新增按钮
   */
  let crudOptShow: CrudOptShowType = reactive({
    operate: true,
    query: true,
    pullOrder: false,
    add: false,
    edit: true,
    del: true,
    download: false,
    import: false,
    reset: true,
    autoRefresh: false,
    moreSet: false,
    moreDel: false,
    more: false,
    fullscreen: false,
    dragAble: false,
    formSize: '60%',
    hideFooter: false
  });
  if (hasKey('crudOptShow')) {
    crudOptShow = Object.assign(crudOptShow, crudOptions['crudOptShow']);
  }

  // 加载页面时是否请求查询接口
  let setupQuery: boolean | undefined = true;
  if (hasKey('setupQuery')) {
    setupQuery = crudOptions['setupQuery'];
  }

  const crudData = ref([]);

  // 页面展示key值
  let crudTableParams: any = 'list';
  if (hasKey('crudTableParams')) {
    crudTableParams = crudOptions['crudTableParams'] as any;
  }

  /**
   * @description crud状态（新增、编辑、弹窗标题）
   */
  const crudStatus: crudStatusType = reactive({
    // （添加）状态标识
    add: STATUS.NORMAL,
    // （编辑）状态标识
    edit: STATUS.NORMAL,

    get cu() {
      if (this.add === STATUS.NORMAL && this.edit === STATUS.NORMAL) {
        return STATUS.NORMAL;
      } else if (
        this.add === STATUS.PREPARED ||
        this.edit === STATUS.PREPARED
      ) {
        return STATUS.PREPARED;
      } else if (
        this.add === STATUS.PROCESSING ||
        this.edit === STATUS.PROCESSING
      ) {
        return STATUS.PROCESSING;
      }
      throw new Error("wrong crud's cu status");
    },
    // 获得标题
    get title() {
      return this.add > STATUS.NORMAL
        ? `添加${crudTitle.value}`
        : this.edit > STATUS.NORMAL
        ? `编辑${crudTitle.value}`
        : '';
    }
  });

  /**
   * @description 重置crud状态
   */
  function resetCrudStatus() {
    crudStatus.add = STATUS.NORMAL;
    crudStatus.edit = STATUS.NORMAL;
  }

  /**
   * @description 设置新增状态值
   * @param status 状态值
   */
  function setAddStatus(status: number) {
    crudStatus.add = status;
  }

  /**
   * @description 设置编辑状态值
   * @param status 状态值
   */
  function setEditStatus(status: number) {
    crudStatus.edit = status;
  }

  /**
   * @description 获取新增状态值
   */
  function getAddStatus(): number {
    return crudStatus.add;
  }

  /**
   * @description 获取编辑状态值
   */
  function getEditStatus(): number {
    return crudStatus.edit;
  }

  /**
   * @description 获取弹窗标题
   */
  function getTitleStatus(): string {
    return crudStatus.title;
  }

  /**
   *@description 侧边提示框
   * @param title 提示内容标题
   * @param type 提示类型
   */
  const notify = (title: string, type = NOTIFICATION_TYPE.INFO) => {
    ElNotification({ title, type, duration: 2500 });
  };

  /**
   * @description 提交成功提示
   */
  const submitSuccessNotify = () => {
    notify(MSG.submit, NOTIFICATION_TYPE.SUCCESS);
  };

  /**
   * @description 添加成功提示
   */
  const addSuccessNotify = () => {
    notify(MSG.add, NOTIFICATION_TYPE.SUCCESS);
  };

  /**
   * @description 编辑成功提示
   */
  const editSuccessNotify = () => {
    notify(MSG.edit, NOTIFICATION_TYPE.SUCCESS);
  };

  /**
   * @description 删除成功提示
   */
  const delSuccessNotify = () => {
    notify(MSG.del, NOTIFICATION_TYPE.SUCCESS);
  };

  /**
   * @description 撤回成功提示
   */
  const recallSuccessNotify = () => {
    notify(MSG.recall, NOTIFICATION_TYPE.SUCCESS);
  };

  /**
   * @description 置顶成功成功提示
   */
  const topSuccessNotify = () => {
    notify(MSG.top, NOTIFICATION_TYPE.SUCCESS);
  };

  // 查询的 Loading
  const queryLoading = ref(false);
  // 导出的 Loading
  const downloadLoading = ref(false);
  // 删除的 Loading
  const delLoading = ref(false);
  // 多选删除的 Loading
  const delAllLoading = ref(false);

  let crudPage: crudPageType = reactive({
    page: 1,
    limit: 20,
    count: 0
  });

  async function setCrudPageNum(value: number) {
    crudPage.page = value;
    await refresh();
  }

  async function setCrudPageSize(value: number) {
    crudPage.limit = value;
    await refresh();
  }

  function crudTinymce(key: string, value: string) {
    proxyForm[key] = value;
  }

  // 重置form表单数据
  const resetForm = (rowForm = {}) => {
    crudForm = Object.assign(crudForm, defaultForm, rowForm);
    proxyForm = Object.assign(proxyForm, crudForm);
  };

  // 重置搜索数据
  const resetQuery = (selfQuery = {}) => {
    Object.keys(crudQuery).forEach((key) => {
      crudQuery[key] = null;
    });
    crudQuery = Object.assign(crudQuery, defaultQuery, selfQuery);
    crudPage = Object.assign(crudPage, {
      page: 1,
      limit: 20,
      count: 0
    });
  };

  // 设置请求参数
  function setTheQuery(query: Row) {
    Object.assign(crudQuery, query);
  }

  // 设置form参数
  function setTheForm(from: Row) {
    Object.assign(proxyForm, from);
  }

  // 搜索条件处理
  const getQueryParams = () => {
    if (Object.keys(crudQuery).length != 0) {
      Object.keys(crudQuery).forEach((item) => {
        if (crudQuery[item] === null || crudQuery[item] === '') {
          crudQuery[item] = undefined;
        }
      });
    }
    if (!isPageQuery) {
      return {
        page: 1,
        limit: 100000,
        ...crudQuery
      };
    } else {
      return {
        ...crudPage,
        ...crudQuery
      };
    }
  };

  async function toQuery(params?: any) {
    crudPage.page = 1;
    await refresh(params);
  }

  let statisticsTotal: any = null;
  /**
   * @param {boolean} [loadingFlag=false]
   * @return {*}
   */
  async function refresh(params?: any) {
    const loadingFlag = false;
    const beforeRefreshFlag = await callVmHook(crudHook.beforeRefresh);
    if (!beforeRefreshFlag) return;
    return new Promise(async (resolve, reject) => {
      queryLoading.value = !loadingFlag;
      const query = { ...getQueryParams(), ...params };
      crudMethod
        .list(query)
        .then((result: CrudResDataType) => {
          if (result.code == 1) {
            crudResData = result.data;
            crudPage.count = result.data.count
              ? result.data.count
              : result.data.total
              ? result.data.total
              : 0;
            if (crudTableParams) {
              crudData.value = crudResData[crudTableParams];
            } else {
              crudData.value = crudResData as any;
            }
            // 保存总和数据
            // eslint-disable-next-line no-prototype-builtins
            result.data.hasOwnProperty('statistics')
              ? (statisticsTotal = result.data.statistics)
              : (statisticsTotal = null);

            callVmHook(crudHook.afterRefresh, crudResData);
            resolve(crudData);
            setTimeout(() => {
              queryLoading.value = false;
            }, time);
          } else {
            crudResData = {};
            reject(result);
          }
        })
        .catch((err: any) => {
          queryLoading.value = false;
          reject(err);
        });
    });
  }

  /**
   *@description 触发新增操作
   * @param {Row} [form]
   * @return {*}
   */
  async function toAdd(form?: Row) {
    return new Promise(async (resolve, reject) => {
      try {
        resetForm(form);
        const beforeAdd = await callVmHook(crudHook.beforeToAdd, proxyForm);
        const beforeCu = await callVmHook(crudHook.beforeToCU, proxyForm);
        if (!beforeAdd || !beforeCu) return;
        setAddStatus(STATUS.PREPARED);
        resolve(true);
      } catch (error) {
        reject(false);
      }
    });
  }

  /**
   *@description 进行新增操作
   * @return {*}
   */
  async function doAdd() {
    return new Promise(async (resolve, reject) => {
      try {
        crudForm = Object.assign(crudForm, proxyForm);
        const afterAdd = await callVmHook(crudHook.beforeValidateCU, crudForm);
        if (!afterAdd) {
          resolve(false);
          return;
        }
        crudDefaultFormRefs &&
          crudDefaultFormRefs.validate(async (valid: any) => {
            if (valid) {
              // 验证通过
              crudMethod
                .add(crudForm)
                .then(async (res: any) => {
                  if (res.code == 1) {
                    notify(MSG.add, NOTIFICATION_TYPE.SUCCESS);
                  }
                  await callVmHook(crudHook.afterToAdd);
                  await callVmHook(crudHook.afterToCU);
                  await toQuery();
                  resolve(res.code == 1);
                })
                .catch(() => {
                  callVmHook(crudHook.afterAddError);
                  resolve(false);
                });
            } else {
              resolve(false);
            }
          });
      } catch (error) {
        await callVmHook(crudHook.afterAddError);
        resolve(false);
      }
    });
  }

  /**
   *@description 触发编辑操作
   * @param {Row} row
   * @return {*}
   */
  async function toEdit(row: Row) {
    return new Promise(async (resolve, reject) => {
      try {
        resetForm(row);
        const beforeEdit = await callVmHook(crudHook.beforeToEdit, proxyForm);
        const beforeCu = await callVmHook(crudHook.beforeToCU, proxyForm);
        if (!beforeEdit || !beforeCu) return;
        setEditStatus(STATUS.PREPARED);
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(false);
      }
    });
  }

  async function doPullOrder() {
    return new Promise(async (resolve, reject) => {
      try {
        crudDefaultFormRefs &&
          crudDefaultFormRefs.validate(async (valid: any) => {
            if (valid) {
              let apiUrl = '';
              // eslint-disable-next-line no-prototype-builtins
              if (proxyForm.hasOwnProperty('game_type')) {
                apiUrl = proxyForm.game_type;
              }
              crudMethod
                .pullOrder(proxyForm, apiUrl)
                .then(async (res: any) => {
                  if (res.code == 1) {
                    resolve(true);
                  }
                })
                .catch(() => {
                  resolve(false);
                });
            } else {
              resolve(false);
            }
          });
      } catch (error) {
        resolve(false);
      }
    });
  }

  /**
   *@description 进行编辑操作
   * @return {*}
   */
  async function doEdit() {
    return new Promise(async (resolve, reject) => {
      try {
        crudForm = Object.assign(crudForm, proxyForm);
        const afterEdit = await callVmHook(crudHook.beforeValidateCU, crudForm);
        if (!afterEdit) {
          resolve(false);
          return;
        }
        crudDefaultFormRefs &&
          crudDefaultFormRefs.validate(async (valid: any) => {
            if (valid) {
              // 验证通过
              crudMethod
                .edit(crudForm)
                .then(async (res: any) => {
                  if (res.code == 1) {
                    notify(MSG.edit, NOTIFICATION_TYPE.SUCCESS);
                  }
                  await callVmHook(crudHook.afterToAdd);
                  await callVmHook(crudHook.afterToCU);
                  await toQuery();
                  resolve(res.code == 1);
                })
                .catch(async () => {
                  await callVmHook(crudHook.afterAddError);
                  resolve(false);
                });
            } else {
              resolve(false);
            }
          });
      } catch (error) {
        await callVmHook(crudHook.afterAddError);
        resolve(false);
      }
    });
  }

  /**
   *@description 触发删除操作
   * @param {*} data
   * @return {*}
   */
  async function toDel(data: any) {
    const beforeDel = await callVmHook(crudHook.beforeDelete);
    if (!beforeDel) return;
    await doDel(data);
  }

  /**
   *@description 进行删除操作
   * @param {*} data
   * @return {*}
   */
  async function doDel(data: any) {
    return new Promise(async (resolve, reject) => {
      crudMethod
        .del(data)
        .then(async (res: CrudResDataType) => {
          if (res.code == 1) {
            await toQuery();
            notify(MSG.del, NOTIFICATION_TYPE.SUCCESS);
          }
          await callVmHook(crudHook.afterDelete);
          resolve(res.code == 1);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  /**
   *@description 触发撤回操作
   * @param {*} data
   * @return {*}
   */
  async function toRecall(data: any) {
    const beforeRec = await callVmHook(crudHook.beforeRecall);
    if (!beforeRec) return;
    await doRecall(data);
  }

  /**
   *@description 进行撤回操作
   * @param {*} data
   * @return {*}
   */
  async function doRecall(data: any) {
    return new Promise(async (resolve, reject) => {
      crudMethod
        .recall(data)
        .then(async (res: CrudResDataType) => {
          if (res.code == 1) {
            await toQuery();
            notify(MSG.recall, NOTIFICATION_TYPE.SUCCESS);
          }
          await callVmHook(crudHook.afterRecall);
          resolve(res.code == 1);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  /**
   *@description 触发置顶操作
   * @param {*} data
   * @return {*}
   */
  async function toTop(data: any) {
    const beforeRec = await callVmHook(crudHook.beforeTop);
    if (!beforeRec) return;
    await doTop(data);
  }

  /**
   *@description 进行置顶操作
   * @param {*} data
   * @return {*}
   */
  async function doTop(row: any) {
    const params = {
      id: row.id
    };
    return new Promise(async (resolve, reject) => {
      crudMethod
        .top(params)
        .then(async (res: CrudResDataType) => {
          if (res.code == 1) {
            await toQuery();
            notify(MSG.top, NOTIFICATION_TYPE.SUCCESS);
          }
          await callVmHook(crudHook.afterTop);
          resolve(res.code == 1);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  /**
   *  @type {Array<id>}
   *  @description 选中的行数据
   */
  const selectIds: Ref<any[]> = ref([]);

  /**
   *@description 进行多条数据删除
   */
  function doMoreDel() {
    return new Promise(async (resolve, reject) => {
      crudMethod
        .del({ ids: selectIds.value })
        .then(async (res: CrudResDataType) => {
          if (res.code == 1) {
            await toQuery();
            notify(MSG.del, NOTIFICATION_TYPE.SUCCESS);
          }
          resolve(res.code == 1);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  /**
   *@description 进行下载操作
   * @param {*} data
   * @return {*}
   */
  function doDownLoad() {
    downloadLoading.value = true;
    return new Promise((resolve, reject) => {
      const query = getQueryParams();
      crudMethod
        .list(Object.assign(query, { export: 1 }))
        .then((result: CrudResDataType) => {
          downloadLoading.value = false;
          if (result.code == 1) {
            resolve(result.data.export);
          }
        })
        .catch((err: any) => {
          downloadLoading.value = false;
          reject(err);
        });
    });
  }

  async function crudSelectHandle(selection: Array<Row>, row: Row) {
    selectIds.value = [];
    selection.forEach((list: any) => {
      selectIds.value.push(list[crudPrimarykey.value]);
    });
  }

  async function crudSelectAllhandle(selection: Array<Row>, row: Row) {
    selectIds.value = [];
    selection.forEach((list: any) => {
      selectIds.value.push(list[crudPrimarykey.value]);
    });
  }

  async function crudSelectionChangeHandle(selection: Array<Row>, row: Row) {
    selectIds.value = [];
    selection.forEach((list: any) => {
      selectIds.value.push(list[crudPrimarykey.value]);
    });
  }

  /**
   * 表格合计统计逻辑
   * @param param 默认表格row
   * @returns '总计' || '-' || number || 'N/A'
   */
  const getSummaries = (param: any) => {
    const { columns, data } = param;
    const sums: any = [];
    // 接口是否返回了全部统计总和的数据 先不放开
    // const totalFlag = false;
    const totalFlag = statisticsTotal !== null;
    columns.forEach((column: any, index: number) => {
      if (index === 0) {
        sums[index] = totalFlag ? '本页合计\n总计' : '本页合计';
        return;
      }
      if (
        hasKey('excludeSumColumn') &&
        crudOptions['excludeSumColumn'].includes(column.property)
      ) {
        sums[index] = totalFlag ? '-\n-' : '-';
        return;
      }
      if (
        hasKey('includeSumColumn') &&
        !crudOptions['includeSumColumn'].includes(column.property)
      ) {
        sums[index] = totalFlag ? '-\n-' : '-';
        return;
      }
      const values = data.map((item: any) => Number(item[column.property]));
      if (!values.every((value: any) => Number.isNaN(value))) {
        const _sum = `${values.reduce((prev: any, curr: any) => {
          const value = Number(curr);
          if (!Number.isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0)}`;
        const _total = totalFlag ? statisticsTotal[column.property] : '-';
        if (
          hasKey('unfixedSum') &&
          crudOptions['unfixedSum'].includes(column.property)
        ) {
          sums[index] = totalFlag
            ? `${parseFloat(Number(_sum).toFixed(4))}\n${parseFloat(
                Number(_total).toFixed(4)
              )}`
            : parseFloat(Number(_sum).toFixed(4));
        } else {
          sums[index] = totalFlag
            ? `${Number(_sum).toFixed(4)}\n${Number(_total).toFixed(4)}`
            : Number(_sum).toFixed(4);
        }
      } else {
        sums[index] = totalFlag ? 'N/A\nN/A' : 'N/A';
      }
    });

    return sums;
  };

  onMounted(() => {
    if (crudOptShow.dragAble && crudFindRole.only(crudTag + 'sort')) {
      nextTick(() => {
        const selector = '.el-table__body-wrapper table > tbody';
        const el = document.querySelectorAll(selector)[0];
        Sortable.create(el, {
          onMove: (evt: any) => {
            // 拿到拖动元素和交换位置的相关元素，可做一些操作，比如某些条件下禁止拖动排序
          },
          onEnd: (evt: any) => {
            // 拖动结束
            const { oldIndex, newIndex } = evt;
            callVmHook(crudHook.dragEnd, { oldIndex, newIndex });
          },
          filter: '.disabled-drag'
        });
      });
    }

    if (!crudCreateQuery) return;

    toQuery();
  });

  onActivated(() => {
    refresh();
  });

  return {
    parseTime,
    MSG,
    STATUS,
    NOTIFICATION_TYPE,
    crudTag,
    crudData,
    crudHook,
    crudPrimarykey,
    isPageQuery,
    crudResData,
    crudSelections,
    crudForm,
    crudDefaultFormRefs,
    crudFormRefsKey,
    getCrudDefaultFormRefs,
    crudStatus,
    crudMethod,
    crudOptShow,
    crudPage,
    notify,
    submitSuccessNotify,
    addSuccessNotify,
    editSuccessNotify,
    delSuccessNotify,
    recallSuccessNotify,
    topSuccessNotify,
    queryLoading,
    downloadLoading,
    delLoading,
    delAllLoading,
    resetForm,
    resetQuery,
    getQueryParams,
    setCrudPageNum,
    setCrudPageSize,
    refresh,
    toQuery,
    crudQuery,
    resetCrudStatus,
    getTitleStatus,
    setEditStatus,
    getEditStatus,
    setAddStatus,
    getAddStatus,
    proxyForm,
    setTheForm,
    toAdd,
    doAdd,
    toEdit,
    doEdit,
    doPullOrder,
    toDel,
    doDel,
    toRecall,
    doRecall,
    toTop,
    doTop,
    crudSelectHandle,
    crudSelectAllhandle,
    crudSelectionChangeHandle,
    setTheQuery,
    crudSetQueryKey,
    crudTinymce,
    crudFindRole,
    roles,
    doDownLoad,
    crudPermission,
    changeStatus,
    doMoreDel,
    crudSetProxyFormKey,
    getSummaries
  };
}
