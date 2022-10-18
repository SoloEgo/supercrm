<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <div class="page-header">
        <h3>Users</h3>
      </div>
      <div class="page-controls">
        <div class="searchInput me-4">
          <input type="search" v-model="usersSearch" v-on:keyup="searchEvent" @click="searchEvent" class="form-control form-control-sm" placeholder="search..." aria-label="Search">
        </div>
      </div>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="empty-results-holder" v-else-if="!users.length">
        <div class="empty-result">No users yet.</div>
      </div>
      <div class="tile-holder" v-else>
        <div class="tile-card tile-0">
          <div class="card white-card minh-100">
            <UsersTable
              :users="users"
              :key="users.length"
              @updateUser="updateUserInfo"
            />
            <nav aria-label="Page navigation example">
              <Paginate
                v-model="page"
                :page-count="pageCount"
                :click-handler="pageChangeHandler"
                :prev-text="'next'"
                :next-text="'prev'"
                :container-class="'pagination pagination-sm'"
                :page-class="'page-item'"
                :page-link-class="'page-link'"
                :prev-class="'page-item'"
                :prev-link-class="'page-link'"
                :next-class="'page-item'"
                :next-link-class="'page-link'"
              />
            </nav>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import "@/assets/users.css";
import UsersTable from "@/components/content/Users/UsersTable";
import paginationMixin from "@/mixins/pagination.mixin";
export default {
  name: "users",
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    users: [],
    usersReal: [],
    displayTable: null,
    updC: 0,
    positions: [],
    usersSearch: ''
  }),
  async mounted() {
    const usersDirty = await this.$store.dispatch("fetchUsers");
    const positions = await this.$store.dispatch("fetchPositions");
    const departments = await this.$store.dispatch("fetchStructure");
    let users = Object.keys(usersDirty).map((key) => ({
      ...usersDirty[key].info,
      id: usersDirty[key].id,
      positionName: (positions.filter( (position) => position.id == usersDirty[key].info.position ))[0].name,
      positionRole: (positions.filter(
        (position) => position.id == usersDirty[key].info.position
      ))[0].role,
    }));

    for (let i = 0; i < users.length; i++) {
      users[i].departmentName = "Нет отдела";
      for (let z = 0; z < departments.length; z++) {
        if (users[i].department == departments[z].id) {
          users[i].departmentName = departments[z].name;
        }
      }
    }
    this.positions = positions;
    this.users = users;
    this.usersReal = users
    this.setupPagination(
      this.users.map((user) => {
        return {
          ...user,
        };
      })
    );
    this.loading = false;
  },
  methods: {
    openModalCreateSale() {
      document
        .querySelector(".create-new-record-card")
        .classList.toggle("active");
    },
    updateUserInfo(uInfo) {
      let userTmp = this.users;
      for (let i = 0; i < userTmp.length; i++) {
        if (userTmp[i].id == uInfo.id) {
          userTmp[i].name = uInfo.name;
          userTmp[i].surname = uInfo.surname;
          userTmp[i].position = uInfo.position;
          for (let z = 0; z < this.positions.length; z++) {
            if (this.positions[z].id == userTmp[i].position) {
              userTmp[i].positionName = this.positions[z].name;
              userTmp[i].positionRole = this.positions[z].role;
            }
          }
        }
      }
      this.users = userTmp
      this.usersReal = userTmp
      this.updC++;
    },
    searchEvent(){
      let realUsers = this.usersReal
      let resSearch = []
      for (let i = 0; i < realUsers.length; i++) {
        if(
          realUsers[i].departmentName.indexOf(this.usersSearch) >= 0 ||
          realUsers[i].name.indexOf(this.usersSearch) >= 0 ||
          realUsers[i].positionName.indexOf(this.usersSearch) >= 0 ||
          realUsers[i].email.indexOf(this.usersSearch) >= 0 ||
          realUsers[i].surname.indexOf(this.usersSearch) >= 0
          ){
            resSearch.push(realUsers[i])
        }
      }
      this.users = resSearch
    }
  },
  components: {
    UsersTable,
  },
};
</script>