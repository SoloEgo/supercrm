<template>
  <table class="table table-striped mb-5 table-hover">
    <thead>
      <tr>
        <th>#</th>
        <th>Дата добавления</th>
        <th>Дата измененения</th>
        <th>Наименование</th>
        <th>Почта</th>
        <th>Телефон</th>
        <th>Описание</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(contractor, idx) of contractors"
        :key="contractor.id"
        :data-id="contractor.id"
        @click.prevent="openModalEditContr"
      >
        <td>{{ idx + 1 }}</td>
        <td>{{ contractor.date | date("date") }}</td>
        <td>{{contractor.changeDate | date("datetime")}}</td>
        <td>{{ contractor.name }}</td>
        <td>{{ contractor.email }}</td>
        <td>{{ contractor.phone }}</td>
        <td>{{ contractor.description }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    contractors: {
      required: true,
      type: Array,
    },
    contractorId: {
      type: String
    }
  },
  methods: {
    openModalEditContr(ev) {
      const id = ev.path[1].attributes["data-id"].value
      this.$emit("contrTargetId", id);
    },
  },
};
</script>