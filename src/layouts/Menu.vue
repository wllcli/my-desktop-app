<script setup>
import {useRouter} from 'vue-router'
import {onMounted, ref} from "vue";

const router = useRouter()
const activePath = ref(router.currentRoute.value.path)
const menuList = ref()

function getMenuList() {
  menuList.value = router.getRoutes().filter(r => {
    return !r.redirect && !r.path.includes('*')  // [!code focus]
  })
}
function setPath(path) {
  activePath.value = path
  router.push(path)
}
onMounted(() => {
  getMenuList()
  console.log('menuList',process.env)
})

</script>

<template>
  <div>
    <q-list padding>
      <q-item :active="activePath === item.path" clickable v-ripple v-for="item in menuList" @click="setPath(item.path)">
        <q-item-section avatar>
          <q-icon :name="item.meta.icon"/>
        </q-item-section>
        <q-item-section>
          {{ item.meta.title }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style scoped>

</style>
