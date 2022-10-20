<template>
  <div class="row flex-nowrap h-100 mb-2 justify-content-center">
    <div
      class="col task-list-block"
      v-for="taskT of taskTypes"
      :key="taskT.id"
      :class="taskT.class"
    >
      <div class="task-status-name" :class="taskT.class">
        <div class="tsn-name">{{ taskT.name }}</div>
        <div class="tsn-count">{{ taskT.list.length}}</div>
      </div>
      <draggable
        class="list-group"
        :list="taskT.list"
        group="people"
        :data-id="taskT.class"
        @end="onEnd"
      >
        <transition-group>
          <div
            class="list-item-card card mt-2 mb-2"
            v-for="el in taskT.list"
            :key="el.id"
            :data-id="el.id"
            :class="taskT.status"
          >
            <div class="row mb-1">
              <div class="col lgt-name">{{ el.name }}</div>
            </div>
            <div class="row mb-1">
              <div class="col">Постановщик: </div>
              <div class="col">
                <div class="tskManName" v-for="(res, index) in el.taskManagersNames" :key="`res-${index}`">{{res}}</div>
                </div>            
            </div>
            <div class="row mb-2">
              <div class="col">Исполнитель: </div>
              <div class="col">
                <div class="tskManName" v-for="(res, index) in el.responsibleNames" :key="`res-${index}`">{{res}}</div>
                </div>            
            </div>
            <div class="row">
              <div class="col lgt-date">
                <div class="col_date_name"><small>Дата начала</small></div>
                <div class="col_date_val"><small>{{ el.dateStart | date("date") }}</small></div>
              </div>
              <div class="col lgt-date">
                <div class="col_date_name"><small>Ожид. завершение</small></div>
                <div class="col_date_val"><small>{{ el.dateExpect | date("date") }}</small></div>
              </div>
              <div class="col lgt-date">
                <div class="col_date_name"><small>Крайний срок</small></div>
                <div class="col_date_val"><small>{{ el.dateDeadLine | date("date") }}</small></div>
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
import { DateTime } from "luxon";
export default {
  props: {
    taskList: {
      required: true,
      type: Array,
    },
  },
  data: () => ({
    taskTypes: [
      {
        name: "Out of date",
        class: "warning",
        id: "outOfDate",
        list: [],
      },
      {
        name: "For today",
        class: "today",
        id: "today",
        list: [],
      },
      {
        name: "This week",
        class: "thisWeek",
        id: "thisWeek",
        list: []
      },
      {
        name: "Next week",
        class: "nextWeek",
        id: "nextWeek",
        list: [],
      },
      {
        name: "More then 2 weeks",
        class: "farThenTwoWeeks",
        id: "farThenTwoWeeks",
        list: [],
      },
      {
        name: "Without date",
        class: "noDate",
        id: "noDate",
        list: [],
      },
    ],
  }),
  created() {},
  methods: {
    async onEnd(evt) {
      this.loading = true;
      const itemId = evt.item.getAttribute("data-id");
      const newStatus =
        evt.to.__vue__.$el.parentElement.getAttribute("data-id");
      const sales = await this.$store.dispatch("changeStatusById", {
        id: itemId,
        status: newStatus,
      });
      this.$emit("updated", sales);
      this.loading = false;
      this.$message("Статус продажи успешно изменен");
    },
  },
  async mounted() {
    const tl = this.taskList;
    for (let i = 0; i < tl.length; i++) {
      let expEnd = new DateTime.fromISO(tl[i].dateExpect);
      let deadEnd = new DateTime.fromISO(tl[i].dateDeadLine);
      let nowDate = DateTime.now();
      let diffExpect = expEnd
        .diff(nowDate, ["months", "weeks", "days"])
        .toObject();
      let diffDead = deadEnd
        .diff(nowDate, ["months", "weeks", "days"])
        .toObject();

      if (diffExpect.days < 0 || diffDead.days < 0 ) {
        this.taskTypes.filter((tt) => tt.id == "outOfDate")[0].list.push(tl[i]);
      }
      if (diffExpect.days == 0 || diffDead.days == 0) {
        this.taskTypes.filter((tt) => tt.id == "today")[0].list.push(tl[i]);
      }
      if ( (diffExpect.days > 0 && diffExpect.weeks == 0) || (diffDead.days > 0 && diffDead.weeks == 0)) {
        this.taskTypes.filter((tt) => tt.id == "thisWeek")[0].list.push(tl[i]);
      }
      if (diffExpect.weeks == 1 || diffDead.weeks == 1) {
        this.taskTypes.filter((tt) => tt.id == "nextWeek")[0].list.push(tl[i]);
      }
      if (diffExpect.weeks > 1 || diffDead.weeks > 1) {
        this.taskTypes
          .filter((tt) => tt.id == "farThenTwoWeeks")[0]
          .list.push(tl[i]);
      }
    }

    for (let i = 0; i < this.taskTypes.length; i++) {
      for (let z = 0; z < this.taskTypes[i].list.length; z++) {
        this.taskTypes[i].list[z].taskManagersNames = []
        this.taskTypes[i].list[z].responsibleNames = []
        for (let k = 0; k < this.taskTypes[i].list[z].taskManager.length; k++) {
          let info = await this.$store.dispatch("fetchInfoById", this.taskTypes[i].list[z].taskManager[k]);
          this.taskTypes[i].list[z].taskManagersNames.push( info.name + ' ' + info.surname )          
        }
        for (let k = 0; k < this.taskTypes[i].list[z].responsible.length; k++) {
          let info = await this.$store.dispatch("fetchInfoById", this.taskTypes[i].list[z].responsible[k]);
          this.taskTypes[i].list[z].responsibleNames.push( info.name + ' ' + info.surname )          
        }    
      }      
    }
  },
  watch: {},
  components: {
    draggable,
  },
};
</script>