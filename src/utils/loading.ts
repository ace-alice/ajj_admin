import { nextTick } from 'vue';

// 定义方法
export const NextLoading = {
  // 创建 loading
  start: async () => {
    await NextLoading.done();
    const bodys: any = document.body;
    const div = document.createElement('div');
    div.setAttribute('class', 'loading-next');
    const htmls = `
			<div class="loading-next-box">
			<div class="loading-next-box-warp">
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
				<div class="loading-next-box-item"></div>
			</div>
		</div>
		`;
    div.innerHTML = htmls;
    bodys.insertBefore(div, bodys.childNodes[0]);
  },
  // 移除 loading
  done: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const el = document.querySelector('.loading-next');
        el && el.parentNode?.removeChild(el);
        resolve(true);
      }, 100);
    });
  }
};
