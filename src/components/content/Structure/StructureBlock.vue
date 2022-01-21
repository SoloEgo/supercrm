<template>
  <div class="row flex-nowrap mb-2 justify-content-center">
    <div
      class="col-2 department-list-block"
      v-for="typeL of structureList"
      :key="typeL.id"
    >
      <div class="d-flex" :class="typeL.name">
        <div class="ssn-name">{{ typeL.name }}</div>
        <!-- <div class="ssn-count">{{ typeL.list.length }}</div> -->
      </div>
      <!-- <draggable
        class="list-group"
        :list="typeL.list"
        group="people"
        :move="checkMove"
        :data-id="typeL.status"
      >
        <transition-group>
          <div
            class="list-item-card card mt-2 mb-2"
            v-for="(el, index) in typeL.list"
            :key="el.idx"
            :data-id="index"
            :class="typeL.status"
          >
            <div class="row">
              <div class="col lgt-name">{{ el.contractor_info.name }}</div>
              <div class="col lgt-budget">
                {{ el.budget | currency("RUB") }}
              </div>
            </div>
            <div class="row">
              <div class="col lgt-description-name">Описание</div>
              <div class="col lgt-description">{{ el.description }}</div>
            </div>
            <div class="row">
              <div class="col lgt-date">
                <small>{{ el.date | date("date") }}</small>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable> -->
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  data() {
    return {
      structureList: [],
      loading: true
    };
  },
  async mounted() {
    const structureList = (await this.$store.dispatch("fetchStructure"))
    console.log(structureList)
    // .sort(
    //   (a, b) => (a.order > b.order ? 1 : b.order > a.order ? -1 : 0)
    // );

    // for (let i = 0; i < listTypes.length; i++) {
    //   listTypes[i].list = new Array();
    //   for (let z = 0; z < this.sales.length; z++) {
    //     if (this.sales[z].status == listTypes[i].status) {
    //       listTypes[i].list.push(this.sales[z]);
    //     }
    //   }
    // }
    // for (let i = 0, k = 0; i < listTypes.length; i++) {
    //   for (let z = 0; z < listTypes[i].list.length; z++) {
    //     listTypes[i].list[z].idx = k;
    //     k++;
    //   }
    // }
    this.structureList = structureList;
    this.loading = false;
  },
  methods: {
    add: function () {},
    replace: function () {},
    clone: function (el) {},
    async checkMove(evt) {
      this.loading = true;
      const itemId = evt.draggedContext.element.id;
      const newStatus =
        evt.to.__vue__.$el.parentElement.getAttribute("data-id");
      const sales = await this.$store.dispatch("changeStatusById", {
        id: itemId,
        status: newStatus,
      });
      this.$emit("updated", sales);
      this.loading = false;
    },
  },

  components: {
    draggable,
  },
};
</script>