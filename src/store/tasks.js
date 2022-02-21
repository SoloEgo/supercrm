import firebase from 'firebase/compat/app'
import { db } from "@/plugins/db";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
export default {
    actions: {
        async createTask({ dispatch, commit }, newTask) {
            try {
                await db.collection('tasks').add(newTask)
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchTasks({ dispatch, commit }) {
            try {
                let result = []
                const uid = await dispatch('getUid')
                const q = query(collection(db, "tasks"), where("taskManager", "array-contains", uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    result.push({...doc.data(), id: doc.id });
                });

                return result

            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchTaskById({ dispatch, commit }, id) {
            try {
                const docRef = doc(db, "tasks", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    return docSnap.data();
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async updateTask({ dispatch, commit }, id) {
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
        async closeTask({ commit, dispatch }, tid) {
            try {
                const taskRef = doc(db, "tasks", tid);
                const uid = await dispatch('getUid')
                await updateDoc(taskRef, {
                    status: 'closed'
                });
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
    },
}