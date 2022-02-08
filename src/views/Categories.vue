<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <h3>Категории</h3>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="tile-holder" v-else>
        <div class="tile-card tile-0">
          <div class="card white-card minh-100">
            <div class="text-center section">
              <vc-calendar
                class="custom-calendar max-w-full"
                :masks="masks"
                :attributes="attributes"
                disable-page-swipe
                is-expanded
              >
                <template v-slot:day-content="{ day, attributes }">
                  <div class="flex flex-col h-full z-10 overflow-hidden">
                    <span class="day-label text-sm text-gray-900">{{
                      day.day
                    }}</span>
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
              </vc-calendar>
            </div>
          </div>
        </div>

        <!-- <CategoryCreate @created="addNewCategory" />
        <CategoryEdit
          v-if="categories.length"
          :categories="categories"
          :key="categories.length + updateCount"
          @updated="updateCategories"
        />
        <div v-else class="empty-results-holder">
          <div class="empty-result">Доступных категорий пока нет.</div>
        </div> -->
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from "@/components/content/Categories/CategoryCreate";
import CategoryEdit from "@/components/content/Categories/CategoryEdit";
import "@/assets/calendar.css";
export default {
  name: "categories",
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0,
    masks: {
      weekdays: "WWW",
    },
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
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    console.log(this.attributes);
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