<template>
  <table class="table table-striped mb-5 sales-table align-middle">
    <thead>
      <tr>
        <th>#</th>
        <th>Дата</th>
        <th>Контрагент</th>
        <th>Сумма сделки</th>
        <th>Описание</th>
        <th>Статус</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(sale, idx) of sales" :key="sale.id">
        <td>{{ idx + 1 }}</td>
        <td>{{sale.date | date('datetime')}}</td>
        <td>
          <button class="btn btn-light" @click="showModalInfo">
            {{ sale.contractor_info.name }}
          </button>
          <div class="modal modal-card">
            <div class="modal-dialog" role="document">
              <div class="modal-content rounded-6 shadow">
                <div class="modal-header border-bottom-0">
                  <h5 class="modal-title">Данные контрагента</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    @click="closeModalInfo"
                  ></button>
                </div>
                <div class="modal-body py-0">
                  <table class="table table-striped align-middle">
                    <tbody>
                      <tr>
                        <td><i class="bi bi-person"></i></td>
                        <td>Название:</td>
                        <td>{{ sale.contractor_info.name }}</td>
                      </tr>
                      <tr>
                        <td><i class="bi bi-envelope"></i></td>
                        <td>Почта:</td>
                        <td>{{ sale.contractor_info.email }}</td>
                      </tr>
                      <tr>
                        <td><i class="bi bi-telephone"></i></td>
                        <td>Телефон:</td>
                        <td>{{ sale.contractor_info.phone }}</td>
                      </tr>
                      <tr>
                        <td><i class="bi bi-card-heading"></i></td>
                        <td>Описание:</td>
                        <td>{{ sale.contractor_info.description }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </td>
        <td>{{ sale.budget | currency("RUB") }}</td>
        <td>{{ sale.description }}</td>
        <td>
          <div class="sale-table-status" @click.stop="showModalTypes">
            <span :class="sale.status_info.color"></span
            >{{ sale.status_info.name }}
          </div>
          <ul class="dropdown-menu dropdown-menu-end drop-status-list">
            <li
              v-for="s of salesTypes"
              :key="s.order"
              @click="changeSaleStatus"
            >
              <span
                class="dropdown-item"
                :data-sale-id="sale.id"
                :data-sale-status="s.status"
                :class="s.status"
                >{{ s.name }}</span
              >
            </li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  data: () => {
    return {
      salesTypes: [],
    };
  },
  props: {
    sales: {
      required: true,
      type: Array,
    },
  },
  computed: {},
  async mounted() {
    let s = await this.$store.dispatch("fetchSalesStatus");
    this.salesTypes = s;
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
    async changeSaleStatus(el) {
      const id = el.target.getAttribute("data-sale-id");
      const status = el.target.getAttribute("data-sale-status");
      const sales = await this.$store.dispatch("changeStatusById", {
        id: id,
        status: status,
      });
      this.$emit("updated", sales);
    },
  },
};
</script>