import firebase from 'firebase/compat/app'
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
        async getCurrentRunTask({ commit, dispatch }, uid) {
            try {
                const task = (await firebase.database().ref(`/users/${uid}/currentTask`).once('value')).val() || {}
                return task
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async getCurrentRunTaskId({ commit, dispatch }, uid) {
            try {
                const task = (await firebase.database().ref(`/users/${uid}/currentTask`).once('value')).val() || {}
                return task.id
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchTaskTimeById({ commit, dispatch }, { uid, tid }) {
            try {
                const res = (await firebase.database().ref(`/users/${uid}/tasksTime/${tid}`).once('value')).val() || {}
                return res.taskTime
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async setCurrentTaskStop({ commit, dispatch }, tid) {
            try {
                const uid = await dispatch('getUid')
                const dateEnd = new Date()
                let dateStart = (await firebase.database().ref(`/users/${uid}/currentTask`).once('value')).val().dateStart
                let timeDif = dateEnd - new Date(dateStart)
                let timeTask = 0;
                let timeTaskObj = (await firebase.database().ref(`/users/${uid}/tasksTime/${tid}`).once('value')).val()
                if (timeTaskObj != undefined) {
                    timeTask = timeTaskObj.taskTime + timeDif
                } else {
                    timeTask = timeDif
                }
                await firebase.database().ref(`/users/${uid}/currentTask`).update({
                    dateEnd: dateEnd.toJSON()
                })

                await firebase.database().ref(`/users/${uid}/tasksTime/${tid}`).update({
                    taskTime: timeTask
                })

                await firebase.database().ref(`/users/${uid}/currentTask`).update({
                    id: '',
                    dateStart: '',
                    dateEnd: '',
                    pause: false
                })

            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async setCurrentTaskRun({ commit, dispatch }, tid) {
            try {
                const uid = await dispatch('getUid')
                await firebase.database().ref(`/users/${uid}/currentTask`).update({
                    id: tid,
                    dateStart: (new Date()).toJSON(),
                    dateEnd: '',
                    pause: false
                })
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async setCurrentTaskPause({ commit, dispatch }, tid) {
            try {
                const uid = await dispatch('getUid')
                const dateEnd = new Date()
                let dateStart = (await firebase.database().ref(`/users/${uid}/currentTask`).once('value')).val().dateStart
                let timeDif = dateEnd - new Date(dateStart)
                let timeTask = 0;
                let timeTaskObj = (await firebase.database().ref(`/users/${uid}/tasksTime/${tid}`).once('value')).val()
                if (timeTaskObj != undefined) {
                    timeTask = timeTaskObj.taskTime + timeDif
                } else {
                    timeTask = timeDif
                }
                await firebase.database().ref(`/users/${uid}/currentTask`).update({
                    dateEnd: dateEnd.toJSON(),
                    pause: true
                })
                await firebase.database().ref(`/users/${uid}/tasksTime/${tid}`).update({
                    taskTime: timeTask
                })

                return (await firebase.database().ref(`/users/${uid}/currentTask`).once('value')).val()

            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async setTaskTime({ commit, dispatch }, tid) {
            try {
                const uid = await dispatch('getUid')
                const dateEnd = new Date()
                let dateStart = (await firebase.database().ref(`/users/${uid}/currentTask`).once('value')).val().dateStart
                let timeDif = dateEnd - new Date(dateStart)
                let timeTask = 0;
                let timeTaskObj = (await firebase.database().ref(`/users/${uid}/tasksTime/${tid}`).once('value')).val()
                console.log(timeTaskObj)
                if (timeTaskObj != undefined) {
                    timeTask = timeTaskObj.taskTime + timeDif
                } else {
                    timeTask = timeDif
                }
                await firebase.database().ref(`/users/${uid}/tasksTime/${tid}`).update({
                    taskTime: timeTask
                })
            } catch (e) {
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