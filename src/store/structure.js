import firebase from 'firebase/compat/app'
export default {
    actions: {
        async createDept({ dispatch, commit }, { name, date }) {
            try {
                const dpt = {
                    name: name,
                    date: date
                }
                const dept = await firebase.database().ref(`/departments`).push(dpt)
                return dept.key
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async deleteDept({ dispatch, commit }, id) {
            try {

                const res = await firebase.database().ref(`/departments`).child(id).remove()
                let users = await dispatch('fetchUsers')
                for (let i = 0; i < users.length; i++) {
                    if (users[i].info.department == id) {
                        await firebase.database().ref(`/users/${users[i].id}/info`).update({ department: 'noDept' })
                    }
                }
                return res
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async renameDept({ dispatch, commit }, { id, name }) {
            try {
                await firebase.database().ref(`/departments`).child(id).update({ name: name })
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchStructure({ dispatch, commit }) {
            try {
                const departments = (await firebase.database().ref(`/departments`).once('value')).val() || {}
                const result = Object.keys(departments).map(key => ({...departments[key], id: key }))
                return result
            } catch (e) {
                commit('setError', e)
                throw e
            }
        }
    }
}