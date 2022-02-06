import firebase from 'firebase/app'
import { db } from "@/plugins/db";

export default {
    actions: {
        async login({ dispatch, commit }, { email, password }) {
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password)
                const uid = await dispatch('getUid')
                db.collection("users").doc(uid).set({
                    online: true
                })
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async register({ dispatch, commit }, { email, password, name }) {
            try {
                await firebase.auth().createUserWithEmailAndPassword(email, password)
                const uid = await dispatch('getUid')
                let avatarUrl = await firebase
                    .storage()
                    .ref("users/stock-avatar.jpg")
                    .getDownloadURL();
                db.collection("users").doc(uid).set({
                    online: true
                })
                await firebase.database().ref(`/users/${uid}/info`).set({
                    uid: uid,
                    avatarUrl: avatarUrl,
                    preferedTheme: 'lightTheme',
                    name: name,
                    position: 'empty',
                    email: email
                })
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        getUid() {
            const user = firebase.auth().currentUser
            return user ? user.uid : null
        },
        async logout({ dispatch, commit }) {
            try {
                const uid = await dispatch('getUid')
                db.collection("users").doc(uid).set({
                    online: false
                })
                await firebase.auth().signOut()
                commit('clearInfo')
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
    }
}