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
        <th></th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(contractor, idx) of contractors"
        :key="contractor.id"
        :data-id="contractor.id"
       
      >
        <td>{{ idx + 1 }}</td>
        <td>{{ contractor.date | date("date") }}</td>
        <td>{{contractor.changeDate | date("datetime")}}</td>
        <td>{{ contractor.name }}</td>
        <td>{{ contractor.email }}</td>
        <td>{{ contractor.phone }}</td>
        <td>{{ contractor.description }}</td>
        <td>
          <!-- <button class="btn btn-light btn-sm" :data-id="contractor.id" @click="openModalEditContr2"> -->
            <i @click="openModalEditContr2" :data-id="contractor.id" class="btn btn-light btn-sm bi bi-pencil-square"></i>
          <!-- </button> -->
        </td>
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
    openModalEditContr2(ev){
      const id = ev.target.attributes["data-id"].value
      this.$emit("contrTargetId", id);
    }
  },
};
</script>