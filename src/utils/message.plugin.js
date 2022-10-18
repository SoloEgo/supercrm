
export default {
    install(Vue, options) {
        Vue.prototype.$message = function(html) {
            const h = this.$createElement
            const message = h(
                'p', { class: ['mb-0'] }, [
                    h('i', { class: ['bi-exclamation-diamond', 'bi', 'green'] }),
                    `${html} `
                ]
            )
            this.$bvToast.toast(
                [message], {
                    title: "Success",
                    autoHideDelay: 5000,
                    appendToast: true,
                }
            );
        }

        Vue.prototype.$warning = function(html) {
            const h = this.$createElement
            const message = h(
                'p', { class: ['mb-0'] }, [
                    h('i', { class: ['bi-exclamation-diamond', 'bi', 'yellow'] }),
                    `${html} `
                ]
            )
            //console.log(message)
            this.$bvToast.toast(
                [message], {
                    title: "Warning",
                    autoHideDelay: 5000,
                    appendToast: true,
                }
            );

        }

        Vue.prototype.$error = function(html) {
            const h = this.$createElement
            const message = h(
                'p', { class: ['mb-0'] }, [
                    h('i', { class: ['bi-exclamation-diamond', 'bi', 'red'] }),
                    `${html} `
                ]
            )
            this.$bvToast.toast(
                [message], {
                    title: "Error",
                    autoHideDelay: 5000,
                    appendToast: true,
                }
            );
        }
    }
}