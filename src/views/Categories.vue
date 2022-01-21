<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <h3>Категории</h3>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="tile-holder" v-else>
        <CategoryCreate @created="addNewCategory" />
        <CategoryEdit
          v-if="categories.length"
          :categories="categories"
          :key="categories.length + updateCount"
          @updated="updateCategories"
        />
        <div v-else class="empty-results-holder">
          <div class="empty-result">
            Доступных категорий пока нет.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from "@/components/content/Categories/CategoryCreate";
import CategoryEdit from "@/components/content/Categories/CategoryEdit";
export default {
  name: "categories",
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0,
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;
  },
  components: {
    CategoryCreate,
    CategoryEdit,
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category);
    },
    updateCategories(caterory) {
      const idx = this.categories.findIndex((c) => c.id === caterory.id);
      this.categories[idx].title = caterory.title;
      this.categories[idx].limit = caterory.limit;
      this.updateCount++;
    },
  },
};
</script>