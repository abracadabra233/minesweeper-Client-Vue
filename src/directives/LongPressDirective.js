// src/directives/LongPressDirective.js
const longpressDirective = {
    mounted(el, binding) {
        if (typeof binding.value !== 'function') {
            console.warn('v-longpress directive expects a function as value')
            return
        }

        let pressTimer = null
        let isPressed = false
        const longPressDelay = binding.arg || 300 // 默认300ms

        const start = (e) => {
            // 只响应鼠标左键或触摸事件
            if (e.type === 'mousedown' && e.button !== 0) {
                return
            }

            if (pressTimer === null && !isPressed) {
                isPressed = true
                pressTimer = setTimeout(() => {
                    try {
                        binding.value(e)
                    } catch (error) {
                        console.error('Long press handler error:', error)
                    }
                }, longPressDelay)
            }
        }

        const cancel = () => {
            if (pressTimer !== null) {
                clearTimeout(pressTimer)
                pressTimer = null
            }
            isPressed = false
        }

        // 鼠标事件
        el.addEventListener('mousedown', start, { passive: false })
        el.addEventListener('mouseup', cancel, { passive: false })
        el.addEventListener('mouseleave', cancel, { passive: false })
        el.addEventListener('click', cancel, { passive: false })

        // 触摸事件
        el.addEventListener('touchstart', start, { passive: false })
        el.addEventListener('touchend', cancel, { passive: false })
        el.addEventListener('touchcancel', cancel, { passive: false })

        // 防止默认行为（如选择文本）
        el.addEventListener('selectstart', (e) => e.preventDefault(), { passive: false })
        el.addEventListener('dragstart', (e) => e.preventDefault(), { passive: false })

        // 保存事件监听器引用，以便之后卸载
        el._v_longpress_handlers = {
            start,
            cancel,
        }
    },

    beforeUnmount(el) {
        // 清理事件监听器
        if (el._v_longpress_handlers) {
            const { start, cancel } = el._v_longpress_handlers

            el.removeEventListener('mousedown', start)
            el.removeEventListener('mouseup', cancel)
            el.removeEventListener('mouseleave', cancel)
            el.removeEventListener('click', cancel)

            el.removeEventListener('touchstart', start)
            el.removeEventListener('touchend', cancel)
            el.removeEventListener('touchcancel', cancel)

            delete el._v_longpress_handlers
        }
    },

    updated(el, binding) {
        // 如果绑定值发生变化，更新处理函数
        if (el._v_longpress_handlers && typeof binding.value === 'function') {
            // 这里可以添加更新逻辑，如果需要的话
        }
    },
}

export default longpressDirective