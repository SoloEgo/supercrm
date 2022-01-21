import firebase from 'firebase/app'
export default {
    state: {
        info: {}
    },
    mutations: {
        setInfo(state, info) {
            state.info = info
        },
        clearInfo(state) {
            state.info = {}
        }
    },
    actions: {
        async fetchInfo({ dispatch, commit }) {
            try {
                console.log('fetching user info')
                const uid = await dispatch('getUid')
                const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
                commit('setInfo', info)
            } catch (e) {
                commit('setError')
                throw e
            }

        },

        async updateInfo({ dispatch, commit, getters }, toUpdate) {
            try {
                const uid = await dispatch('getUid')
                const updateData = {...getters.info, ...toUpdate }
                console.log(updateData)
                if (updateData.imgFile) {
                    await firebase.storage().ref("users/" + uid + '/avatar/' + updateData.avatarUrl).put(updateData.imgFile)
                    updateData.avatarUrl = await firebase.storage().ref("users/" + uid + '/avatar/' + updateData.avatarUrl).getDownloadURL();
                }

                await firebase.database().ref(`/users/${uid}/info`).update(updateData)

                commit('setInfo', updateData)
            } catch (e) {
                commit('setError')
                throw e
            }
        },

        // async fetchTheme({ commit, dispatch }, id) {
        //     try {
        //         const uid = await dispatch('getUid')
        //         const theme = (await firebase.database().ref(`/users/${uid}/info`).child('preferedTheme').once('value')).val() || {}
        //         return theme
        //     } catch (error) {
        //         commit('setError', e)
        //         throw e
        //     }

        // },

        // async updateTheme({ dispatch, commit }, theme) {
        //     try {
        //         const uid = await dispatch('getUid')
        //         await firebase.database().ref(`/users/${uid}/info`).update({
        //             preferedTheme: theme
        //         })
        //     } catch (e) {
        //         commit('setError')
        //         throw e
        //     }
        // }
    },
    getters: {
        info: s => s.info
    }
}