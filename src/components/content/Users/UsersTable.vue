<template>
  <div class="table-wrapper">
    <table
      class="table table-striped mb-5 users-table align-middle table-hover"
    >
      <thead>
        <tr>
          <th></th>
          <th>e-mail</th>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Должность</th>
          <th>Отдел</th>
          <th>Роль</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user of users" :key="user.id">
          <td>
            <div
              class="user-page-avatar"
              :style="{
                backgroundImage: 'url(' + user.avatarUrl + ')',
              }"
            ></div>
          </td>
          <td>{{ user.email }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.surname }}</td>
          <td>{{ user.positionName }}</td>
          <td>{{ user.departmentName }}</td>
          <td>
            <span
              class="badge rounded-pill"
              :class="
                user.positionRole == 'admin' ? 'bg-primary' : 'bg-secondary'
              "
              >{{ user.positionRole }}</span
            >
          </td>
          <td>
            <button
              class="btn btn-light btn-sm"
              :data-id="user.id"
              @click="openModalEditUser"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
import { required } from "vuelidate/lib/validators";
export default {
  data: () => {
    return {
      positions: [],
      selectedUser: {},
      userPosition: "",
      selectedUserId: "",
      selectedUserName: "",
      selectedUserSurname: "",
      showModal: false,
    };
  },
  props: {
    users: {
      required: true,
      type: Array,
    },
  },
  validations: {
    selectedUserName: { required },
    selectedUserSurname: { required },
  },
  computed: {},
  async mounted() {
    this.positions = await this.$store.dispatch("fetchPositions");
  },
  methods: {
    showModalInfo(e) {
      const btn = e.target;
      const modal = btn.parentElement.children[1];
      modal.classList.add("active");
    },
    closeModalInfo() {
      document
        .querySelectorAll(".modal-card")
        .forEach((el) => el.classList.remove("active"));
    },
    showModalTypes(el) {
      el.target.parentElement.children[1].classList.add("show");
    },
    async openModalEditUser(el) {
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
    async changeUserPosition(el) {
      const id = el.target.getAttribute("data-sale-id");
      const status = el.target.getAttribute("data-sale-status");
      const sales = await this.$store.dispatch("changeStatusById", {
        id: id,
        status: status,
      });
      this.$emit("updated", sales);
    },
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
        this.$v.$reset();
        this.$emit("updateUser", userInfo);
        this.$message("Данные успешно обновлены");
      } catch (e) {
        this.$error("Данные не были обновлены:" + e);
      }
    },
  },
};
</script>