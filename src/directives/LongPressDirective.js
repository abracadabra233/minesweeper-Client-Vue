// src/directives/LongPressDirective.js
export const longpressDirective = {
    mounted(el, binding) {
        if (typeof binding.value !== 'function') {
            throw new Error("The expression provided to v-longpress should be a function");
        }

        let pressTimer = null;

        const start = (e) => {
            if (e.type === 'click' && e.button !== 0) {
                return; // 如果不是鼠标左键点击，则忽略
            }
            if (pressTimer === null) {
                pressTimer = setTimeout(() => {
                    handler(e); // 执行长按之后的操作
                }, 300); // 设置定时器，500毫秒后执行长按操作
            }
        };

        const cancel = () => {
            if (pressTimer !== null) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        };

        const handler = (e) => {
            binding.value(e);
        };

        // 添加事件监听器
        el.addEventListener("mousedown", start);
        el.addEventListener("touchstart", start);
        // 取消长按操作
        el.addEventListener("click", cancel);
        el.addEventListener("mouseout", cancel);
        el.addEventListener("touchend", cancel);
        el.addEventListener("touchcancel", cancel);

        // 保存事件监听器，以便之后卸载
        el._v_longpress_start = start;
        el._v_longpress_cancel = cancel;
    },
    beforeUnmount(el) {
        // 卸载时清理事件监听器
        el.removeEventListener("mousedown", el._v_longpress_start);
        el.removeEventListener("touchstart", el._v_longpress_start);
        el.removeEventListener("click", el._v_longpress_cancel);
        el.removeEventListener("mouseout", el._v_longpress_cancel);
        el.removeEventListener("touchend", el._v_longpress_cancel);
        el.removeEventListener("touchcancel", el._v_longpress_cancel);
    }
};
