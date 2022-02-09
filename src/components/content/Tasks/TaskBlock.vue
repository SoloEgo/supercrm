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
    
  },
  data: () => ({

  }),
  created() {
  },
  methods: {
    
  },
  mounted() {

  },
  watch: {

  },
  components: {
    draggable,
  },
};
</script>