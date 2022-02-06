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
                const uid = await dispatch('getUid')
                const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
                commit('setInfo', info)
            } catch (e) {
                commit('setError')
                throw e
            }

        },
        async fetchInfoById({ dispatch, commit }, uid) {
            try {
                const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
                return info
            } catch (e) {
                commit('setError')
                throw e
            }

        },
        async fetchUsers({ commit, dispatch }) {
            try {
                const users = (await firebase.database().ref(`/users`).once('value')).val() || {}
                return Object.keys(users).map(key => ({...users[key], id: key }))
            } catch (error) {
                commit('setError', e)
                throw e
            }
        },
        async updateInfo({ dispatch, commit, getters }, toUpdate) {
            try {
                const uid = await dispatch('getUid')
                const updateData = {...getters.info, ...toUpdate }
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
        async updateInfoById({ dispatch, commit }, toUpdate) {
            try {
                const id = toUpdate.id
                const updateData = toUpdate
                    //delete updateData.id
                await firebase.database().ref(`/users/${id}/info`).update(updateData)
            } catch (e) {
                commit('setError')
                throw e
            }
        },
        async fetchPositions({ commit, dispatch }) {
            try {
                let positions = await (await firebase.database().ref(`/positions`).once('value')).val()
                positions = Object.values(positions)
                return positions
            } catch (e) {
                commit('setError')
                throw e
            }
        },
        async changeDepartment({ commit, dispatch }, { uid, deptId }) {
            try {
                await firebase.database().ref(`/users/${uid}/info`).update({ department: deptId })
            } catch (e) {
                commit('setError')
                throw e
            }
        },
        async fetchViewedNotifications({ commit, dispatch }) {
            try {
                const uid = await dispatch('getUid')
                const nots = await (await firebase.database().ref(`/users/${uid}/info/viewvedNots`).once('value')).val() || {}
                return nots
            } catch (e) {
                commit('setError')
                throw e
            }
        },
        async addToViewedNotsId({ commit, dispatch }, id) {
            try {
                const uid = await dispatch('getUid')
                let nots = await (await firebase.database().ref(`/users/${uid}/info/viewvedNots`).once('value')).val() || {}
                console.log(nots)
                nots = nots + '|' + id
                console.log(nots)
                await firebase.database().ref(`/users/${uid}/info`).update({ viewvedNots: nots })
                    //return nots
            } catch (e) {
                commit('setError')
                throw e
            }
        },
    },
    getters: {
        info: s => s.info
    }
}