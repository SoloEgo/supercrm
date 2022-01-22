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
        :move="checkMove"
        :data-id="stList.id"
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
              <div class="col lic-name">
                <div class="user_avtar"><img :src="el.info.avatarUrl"></div>
                <div class="user_name">{{ el.info.name }} {{ el.info.surname }}</div>                
              </div>
              <div class="col lgt-position">{{ el.info.position }}</div>
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
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  data() {
    return {
      structureList: [],
      users: [],
      loading: true,
      deptName: "",
    };
  },
  async mounted() {
    const structureList = await this.$store.dispatch("fetchStructure");
    const users = await this.$store.dispatch("fetchUsers");
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
    this.structureList = structureList.sort((a, b) =>
      a.date > b.date ? 1 : b.date > a.date ? -1 : 0
    );
    this.loading = false;
  },
  methods: {
    add: function () {},
    replace: function () {},
    clone: function (el) {},
    async checkMove(evt) {
      const itemId = evt.draggedContext.element.id;
      const dept = evt.to.__vue__.$el.parentElement.getAttribute("data-id");
      await this.$store.dispatch("changeDepartment", {
        uid: itemId,
        deptId: dept,
      });
      this.$message('Сотруднику был назначен новый отдел');
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
        if(this.structureList[i].id == id){
          this.structureList[0].list = this.structureList[0].list.concat(this.structureList[i].list)
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
    async showUserInfo(el){
      const uid = el.currentTarget.getAttribute("data-id")
      let user = await this.$store.dispatch('fetchInfoById', uid )
      console.log(user)
    }
  },

  components: {
    draggable,
  },
};
</script>