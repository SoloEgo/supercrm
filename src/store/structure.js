import firebase from 'firebase/app'

export default {
    // state: {
    //     salesArray: {}
    // },
    // mutations: {
    //     setSales(state, salesArray) {
    //         state.salesArray = salesArray
    //     },
    // },
    actions: {
        // async fetchSalesStatus({ dispatch, commit }) {
        //     try {
        //         const stArr = (await firebase.database().ref(`/salesStatus`).once('value')).val() || {}
        //         return Object.keys(stArr).map(key => ({...stArr[key], status: key }))
        //     } catch (e) {
        //         commit('setError', e)
        //         throw e
        //     }
        // },
        // async createSale({ dispatch, commit }, newsale) {
        //     try {
        //         const uid = await dispatch('getUid')
        //         const sale = await firebase.database().ref(`/users/${uid}/sales`).push(newsale)
        //         const statusTypes = await dispatch('fetchSalesStatus')
        //         newsale.contractor_info = await dispatch('fetchContractorById', { id: newsale.contractor_id })
        //         newsale.status_info = statusTypes.find(e => e.status === newsale.status)
        //         return {...newsale, id: sale.key }
        //     } catch (e) {
        //         commit('setError', e)
        //         throw e
        //     }
        // },
        async fetchStructure({ dispatch, commit }) {
            try {
                const departments = (await firebase.database().ref(`/departments`).once('value')).val() || {}
                const result = Object.keys(departments).map(key => ({...departments[key], id: key }))
                return result
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        // async fetchSaleById({ dispatch, commit }, id) {
        //     try {
        //         const uid = await dispatch('getUid')
        //         const sale = (await firebase.database().ref(`/users/${uid}/sales`).child(id).once('value')).val() || {}
        //         return {...sale, id: id }
        //     } catch (e) {
        //         commit('setError', e)
        //         throw e
        //     }
        // },
        // async changeStatusById({ dispatch, commit }, { id, status }) {
        //     try {
        //         const uid = await dispatch('getUid')
        //         await firebase.database().ref(`/users/${uid}/sales`).child(id).update({ status: status })
        //         const sales = await dispatch('fetchSales')
        //         return sales
        //     } catch (e) {
        //         commit('setError', e)
        //         throw e
        //     }
        // }
    },
    // getters: {
    //     salesArray: s => s.salesArray
    // }
}