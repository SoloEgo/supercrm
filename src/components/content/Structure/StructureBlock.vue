<template>
  <div class="dlb-row row flex-nowrap mb-2 justify-content-start">
    <div
      class="col-2 department-list-block"
      v-for="stList of structureList"
      :key="stList.id"
    >
      <div class="d-flex structure-cols-name justify-content-between">
        <div class="ssn-name">
          <input
            type="text"
            :disabled="stList.id == 'noDept'"
            :data-id="stList.id"
            :value="stList.name"
            @change="deptNameChange"
          />
        </div>
        <div class="ssn-delete" v-if="stList.id != 'noDept'">
          <button
            type="button"
            class="btn btn-light btn-sm"
            @click="deleteDept(stList.id)"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <draggable
        class="list-group"
        :list="stList.list"
        :key="stList.length"
        group="people"
        :data-id="stList.id"
        @end="onEnd"
      >
        <transition-group>
          <div
            class="list-item-card card mt-2 mb-2"
            :class="{ 'text-danger': el.info.deptHead }"
            v-for="el in stList.list"
            :key="el.id"
            :data-id="el.id"
            @click="showUserInfo"
          >
            <div class="row">
              <div class="col-2 lic-avatar">
                <div
                  class="avatar avatar-xl user-image"
                  :style="{ backgroundImage: 'url(' + el.info.avatarUrl + ')' }"
                ></div>
              </div>
              <div class="col-7 lic-name">
                <div class="user_name">
                  {{ el.info.name }} {{ el.info.surname }}
                </div>
                <div class="user-position">
                  {{ el.info.positionName }}
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
    <div class="col-1 ndb-holder">
      <button class="btn btn-light new-dept-btn btn-sm" @click="addNewDept">
        <i class="bi bi-plus-square"></i>
      </button>
    </div>
    <div
      class="modal modal-card py-5 active"
      tabindex="-1"
      role="dialog"
      v-if="showModal"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content rounded-5 shadow">
          <div class="modal-header p-5 pb-4 border-bottom-0 mb-3">
            <h4 class="fw-bold mb-0">
              {{ selectedUser.name }} {{ selectedUser.surname }}
            </h4>
            <button
              @click="closeModal"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body p-5 pt-0">
            <form class="form" @submit.prevent="handleSubmit">
              <input
                type="text"
                v-model="selectedUserId"
                style="display: none"
                disabled
              />

              <div class="form-row mb-3">
                <div class="row">
                  <div class="col-3">
                    <div
                      class="user-img"
                      :style="{
                        backgroundImage: 'url(' + selectedUser.avatarUrl + ')',
                      }"
                    ></div>
                  </div>
                  <div class="col">
                    <div class="input-group mb-3">
                      <input
                        type="text"
                        class="form-control"
                        v-model="selectedUserName"
                        placeholder="Имя"
                        aria-label="Имя"
                      />

                      <input
                        type="text"
                        class="form-control"
                        v-model="selectedUserSurname"
                        placeholder="Фамилия"
                        aria-label="Фамилия"
                      />
                    </div>
                    <div class="input-group mb-3">
                      <span class="input-group-text" id="basic-addon1"
                        ><i class="bi bi-circle"></i
                      ></span>
                      <select
                        class="form-select"
                        id="floatingInputMail"
                        placeholder="Должность"
                        v-model="userPosition"
                      >
                        <option
                          v-for="p of positions"
                          :key="p.id"
                          :value="p.id"
                        >
                          {{ p.name }}
                        </option>
                      </select>
                    </div>
                    <div class="d-flex">
                      <button
                        class="w-100 mb-2 btn rounded-4 btn-primary"
                        type="submit"
                      >
                        Обновить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { required } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      structureList: [],
      users: [],
      loading: true,
      showModal: false,
      deptName: "",
      positions: [],
      selectedUser: {},
      userPosition: "",
      selectedUserId: "",
      selectedUserName: "",
      selectedUserSurname: "",
    };
  },
  validations: {
    selectedUserName: { required },
    selectedUserSurname: { required },
  },
  async mounted() {
    const structureList = await this.$store.dispatch("fetchStructure");
    const users = await this.$store.dispatch("fetchUsers");
    const positions = await this.$store.dispatch("fetchPositions");
    let emptyDept = [];
    for (let i = 0; i < users.length; i++) {
      if (!users[i].info.department || users[i].info.department == "noDept") {
        users[i].info.department = "noDept";
        emptyDept.push(users[i]);
      }
    }
    if (emptyDept.length > 0) {
      structureList.unshift({ id: "noDept", name: "Отдел не назначен" });
    }

    for (let i = 0; i < structureList.length; i++) {
      structureList[i].list = [];
      for (let z = 0; z < users.length; z++) {
        if (users[z].info.department == structureList[i].id) {
          structureList[i].list.push(users[z]);
        }
      }
    }

    for (let i = 0; i < structureList.length; i++) {
      for (let z = 0; z < structureList[i].list.length; z++) {
        for (let k = 0; k < positions.length; k++) {
          if (structureList[i].list[z].info.position == positions[k].id) {
            structureList[i].list[z].info.positionName = positions[k].name;
          }
        }
      }
    }

    this.structureList = structureList.sort((a, b) =>
      a.date > b.date ? 1 : b.date > a.date ? -1 : 0
    );
    this.positions = positions;
    this.loading = false;
  },
  methods: {
    async handleSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const userInfo = {
          name: this.selectedUserName,
          surname: this.selectedUserSurname,
          position: this.userPosition,
          id: this.selectedUserId,
        };
        await this.$store.dispatch("updateInfoById", userInfo);
        let lists = this.structureList;
        for (let i = 0; i < lists.length; i++) {
          for (let z = 0; z < lists[i].list.length; z++) {
            if (lists[i].list[z].id == this.selectedUserId) {
              lists[i].list[z].info.name = this.selectedUserName;
              lists[i].list[z].info.surname = this.selectedUserSurname;
              lists[i].list[z].info.position = this.userPosition;
            }
          }
        }
        this.structureList = lists;
        for (let i = 0; i < this.structureList.length; i++) {
          for (let z = 0; z < this.structureList[i].list.length; z++) {
            for (let k = 0; k < this.positions.length; k++) {
              if (this.structureList[i].list[z].info.position == this.positions[k].id) {
                this.structureList[i].list[z].info.positionName = this.positions[k].name;
              }
            }
          }
        }
        this.$v.$reset();
        this.$message("Данные успешно обновлены");
      } catch (e) {
        this.$error("Данные не были обновлены:" + e);
      }
    },

    async onEnd(evt) {
      const itemId = evt.item.getAttribute("data-id");
      const dept = evt.to.__vue__.$el.parentElement.getAttribute("data-id");
      await this.$store.dispatch("changeDepartment", {
        uid: itemId,
        deptId: dept,
      });
      this.$message("Сотруднику был назначен новый отдел");
    },
    async addNewDept() {
      const id = await this.$store.dispatch("createDept", {
        name: "Новый отдел",
        date: new Date().toJSON(),
      });
      this.structureList.push({ id: id, name: "Новый отдел", list: [] });
      this.$message("Отдел успешно создан");
    },
    async deleteDept(id) {
      for (let i = 0; i < this.structureList.length; i++) {
        if (this.structureList[i].id == id) {
          this.structureList[0].list = this.structureList[0].list.concat(
            this.structureList[i].list
          );
        }
      }
      this.structureList = this.structureList.filter(function (obj) {
        return obj.id !== id;
      });
      await this.$store.dispatch("deleteDept", id);
      this.$message("Отдел успешно удален. Сотрудники перемещены");
    },
    async deptNameChange(el) {
      const name = el.target.value;
      const id = el.currentTarget.getAttribute("data-id");
      for (let i = 0; i < this.structureList.length; i++) {
        if (this.structureList[i].id == id) {
          this.structureList[i].name = name;
        }
      }
      await this.$store.dispatch("renameDept", { id, name });
      this.$message("Отдел успешно переименован");
    },
    async showUserInfo(el) {
      const uid = el.currentTarget.getAttribute("data-id");
      let user = await this.$store.dispatch("fetchInfoById", uid);
      this.selectedUser = user;
      this.selectedUserId = uid;
      this.userPosition = user.position;
      this.selectedUserName = user.name;
      this.selectedUserSurname = user.surname;
      this.showModal = !this.showModal;
    },
    closeModal: function () {
      this.showModal = !this.showModal;
    },
  },
  components: {
    draggable,
  },
};
</script>