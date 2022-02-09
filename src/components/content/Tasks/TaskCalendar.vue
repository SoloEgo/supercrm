<template>
  <div class="text-center section">
    <v-calendar
      class="custom-calendar max-w-full"
      :masks="masks"
      :attributes="attributes"
      disable-page-swipe
      is-expanded
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="flex flex-col h-full z-10 overflow-hidden">
          <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
          <div class="flex-grow overflow-y-auto overflow-x-auto">
            <p
              v-for="attr in attributes"
              :key="attr.key"
              class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
              :class="attr.customData.class"
            >
              {{ attr.customData.title }}
            </p>
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
import "@/assets/calendar.css";
export default {
  data: () => ({
    title: "",
    masks: {
      weekdays: "WWW",
    },
    showModalAddTask: false,
    attributes: [
      {
        key: 1,
        customData: {
          title: "Lunch with mom.",
          class: "bg-success text-white",
        },
        dates: new Date(2022, 2, 1),
      },
    ],
  }),
  validations: {
    title: { required },
    limit: { minValue: minValue(1) },
  },
  methods: {
    onDayClick(day) {
      // this.attributes.push({
      //   key: this.attributes.length + 1,
      //   customData: {
      //     title: "Задача",
      //     class: "bg-success text-white",
      //   },
      //   dates: new Date(day.date),
      // });
    },
  },
};
</script>