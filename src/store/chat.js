import firebase from 'firebase/app'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { db } from "@/plugins/db";
export default {
    state: {
        chatRooms: {},
        usersOnline: []
    },
    mutations: {
        ...vuexfireMutations
    },
    actions: {
        bindUsersOnline: firestoreAction(context => {
            return context.bindUsersOnline('users', db.collection('users'))
        }),
    },
    getters: {
        usersOnline: s => s.usersOnline
    }
}