import firebase from 'firebase/compat/app'

export default {
    actions: {
        async createContractor({ dispatch, commit }, contractor) {
            try {
                return await firebase.database().ref(`/contractors`).push(contractor)
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async updateContractor({ dispatch, commit }, { id, name, phone, email, description }) {
            try {
                const cid = id;
                const date = new Date();
                await firebase.database().ref(`/contractors`).child(cid).update({
                    name: name,
                    phone: phone,
                    email: email,
                    description: description,
                    changeDate: date,
                })
                const result = await dispatch('fetchContractorById', { id: cid })
                return result;
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchContractors({ dispatch, commit }) {
            try {
                const contractors = (await firebase.database().ref(`/contractors`).once('value')).val() || {}
                const result = Object.keys(contractors).map(key => ({...contractors[key], id: key }))
                return result
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchContractorById({ dispatch, commit }, { id }) {
            try {
                const contractor = (await firebase.database().ref(`/contractors`).child(id).once('value')).val() || {}
                return {...contractor, id: id }
            } catch (e) {
                commit('setError', e)
                throw e
            }
        }
    }
}