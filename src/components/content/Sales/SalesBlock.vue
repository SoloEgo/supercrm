<template>
  <div class="row flex-nowrap h-100 mb-2 justify-content-center">
    <div
      class="col-2 sale-list-block"
      v-for="typeL of typeList"
      :key="typeL.id"
      :class="typeL.status"
    >
      <div class="sale-status-name" :class="typeL.status">
        <div class="ssn-name">{{ typeL.name }}</div>
        <div class="ssn-count">{{typeL.list.length}}</div>
      </div>
      <draggable
        class="list-group"
        :list="typeL.list"
        group="people"
        :data-id="typeL.status"
        @end="onEnd"
      >
        <transition-group>
          <div
            class="list-item-card card mt-2 mb-2"
            v-for="(el) in typeL.list"
            :key="el.idx"
            :data-id="el.id"
            :class="typeL.status"
          >
            <div class="row">
              <div class="col lgt-name">{{ el.contractor_info.name }}</div>
              <div class="col lgt-budget">
                {{ el.budget | currency("RUB") }}
              </div>
            </div>
            <div class="row">
              <div class="col lgt-description">{{ el.description }}</div>
            </div>
            <div class="row">
              <div class="col lgt-date">
                <small>{{ el.date | date("date") }}</small>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  props: {
    sales: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      typeList: [],
      loading: true,
      salesList: [],
    };
  },
  async mounted() {
    const listTypes = (await this.$store.dispatch("fetchSalesStatus")).sort(
      (a, b) => (a.order > b.order ? 1 : b.order > a.order ? -1 : 0)
    );

    for (let i = 0; i < listTypes.length; i++) {
      listTypes[i].list = new Array();
      for (let z = 0; z < this.sales.length; z++) {
        if (this.sales[z].status == listTypes[i].status) {
          listTypes[i].list.push(this.sales[z]);
        }
      }
    }
    for (let i = 0, k = 0; i < listTypes.length; i++) {
      for (let z = 0; z < listTypes[i].list.length; z++) {
        listTypes[i].list[z].idx = k;
        k++;
      }
    }
    console.log(listTypes)
    this.typeList = listTypes;
    this.loading = false;
  },
  methods: {
    add: function () {},
    replace: function () {},
    clone: function (el) {
    },
    async onEnd(evt) {
      this.loading = true;
      const itemId = evt.item.getAttribute("data-id");
      const newStatus = evt.to.__vue__.$el.parentElement.getAttribute("data-id");
      const sales = await this.$store.dispatch("changeStatusById", {
        id: itemId,
        status: newStatus,
      });
      this.$emit('updated',sales)
      this.loading = false;
      this.$message("Статус продажи успешно изменен");
    },
  },

  components: {
    draggable,
  },
};
</script>