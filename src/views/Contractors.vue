<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <div class="pahe-header"><h3>Контрагенты</h3></div>
      <div class="page-controls">
        <button class="btn btn-sm btn-primary" @click="openModalCreateContr">
          <i class="bi btn-sm bi-plus-square"></i> Новый контрагент</button>
      </div>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="empty-results-holder" v-else-if="!contractors.length">
        <div class="empty-result">
          Контрагентов пока нет.
          <button class="btn btn-sm primary-btn">Добавить нового контрагента</button>
        </div>
      </div>
      <div class="tile-holder" v-else>
        <div class="tile-card tile-0">
          <div class="card white-card">
            <ContractorsTable :contractors="contractors" :contractorId="id" @contrTargetId="selectedContractor"  :key="updatedCotractor"/>

            <nav aria-label="Page navigation example">
              <Paginate
                v-model="page"
                :page-count="pageCount"
                :click-handler="pageChangeHandler"
                :prev-text="'Назад'"
                :next-text="'Вперед'"
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
        <ContractorsCreateModal @createdContractor="createdContractor" />
        <ContractorEditModal @updatedContractor="updateContrTable" :contractor="contractorObj" :key="updateCount"/>
      </div>
    </section>
  </div>
</template>

<script>

import ContractorsCreateModal from "@/components/content/Contractors/ContractorsCreateModal";
import ContractorsTable from "@/components/content/Contractors/ContractorsTable";
import ContractorEditModal from "@/components/content/Contractors/ContractorEditModal";
import paginationMixin from "@/mixins/pagination.mixin";

export default {
  name: "contractors",
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    contractors: [],
    contractorObj: {},
    updateCount: 0,
    updatedCotractor: 0,
    id: ''
  }),
  async mounted() {
    this.contractors = await this.$store.dispatch("fetchContractors");
    this.setupPagination(
      this.contractors.map((contractor) => {
        return {
          ...contractor,
        };
      })
    );
    this.loading = false;
  },
  methods: {
    openModalCreateContr() {
      document.querySelector(".create-new-contractor-card").classList.toggle("active");
    },
    createdContractor(contractor){
      this.contractors.push(contractor);
    },
    async selectedContractor(id){      
      this.contractorObj = await this.$store.dispatch('fetchContractorById', {id})
      this.updateCount = this.updateCount + 1
    },
    updateContrTable(contr){
      this.contractors.forEach( el=>{
        if(el.id == contr.id){
          el.name = contr.name
          el.email = contr.email
          el.phone = contr.phone
          el.description = contr.description
          el.changeDate = contr.changeDate
        }
      })
      this.updatedCotractor = this.updatedCotractor + 1
      
    }
  },
  components: {
    ContractorsTable,
    ContractorsCreateModal,
    ContractorEditModal
  },
};
</script>