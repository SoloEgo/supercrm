import Vue from "vue";
import Vuex from "vuex";
import auth from './auth'
import info from './info'
import category from './category'
import record from './record'
import contractors from './contractors'
import sales from './sales'
import structure from './structure'

import firebase from 'firebase/app'
import { collection, query, where, getDocs } from "firebase/firestore";
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { db } from "@/plugins/db";

Vue.use(Vuex);

export default new Vuex.Store({
    //const store = new Vuex.Store({
    state: {
        error: null,
        usersOnline: [],
        messages: [],
        rooms: [],
        chatRooms: [],
        activeChatRoomId: null
    },
    mutations: {
        ...vuexfireMutations,
        setError(state, error) {
            state.error = error
        },
        clearError(state) {
            state.error = null
        }
    },
    actions: {
        bindUsersOnline: firestoreAction(({ bindFirestoreRef }) => {
            return bindFirestoreRef('usersOnline', db.collection('users'))
        }),
        bindChatRooms: firestoreAction(({ bindFirestoreRef }) => {
            const uid = firebase.auth().currentUser.uid
            return bindFirestoreRef('rooms', db.collection('rooms').where('members', 'array-contains', uid))
        }),
        bindMessages: firestoreAction(({ state, bindFirestoreRef, }) => {
            const id = state.activeChatRoomId
            return bindFirestoreRef('messages', db.collection('messageGroup').doc(id).collection('messages').orderBy("sentAt", "desc"))
        }),
        unbindMessages: firestoreAction(({ state, unbindFirestoreRef }) => {
            const id = state.activeChatRoomId
            return unbindFirestoreRef(db.collection('messageGroup').doc(id).collection('messages'))
        }),
        async fetchCurrency() {
            const key = process.env.VUE_APP_CERRUNCY_API_KEY
            const res = await fetch(`https://freecurrencyapi.net/api/v2/latest?apikey=${key}&base_currency=RUB`)
            return await res.json()
        },
    },
    getters: {
        error: s => s.error,
        messages: m => m.messages
    },
    modules: {
        auth,
        info,
        category,
        record,
        contractors,
        sales,
        structure
    },
});