<template>
  <q-layout view="hhh lpr lFf" style="height: 300px" class="shadow-2 rounded-borders">
    <q-header v-if="isElectron">
      <q-bar v-if="isMac" class="q-electron-drag">
        <q-btn dense flat round icon="lens" size="8.5px" color="red" />
        <q-btn dense flat round icon="lens" size="8.5px" color="yellow" />
        <q-btn dense flat round icon="lens" size="8.5px" color="green" />
        <div class="col text-center text-weight-bold">
          my app
        </div>
      </q-bar>
      <q-bar v-else class="q-electron-drag">
        <q-icon name="laptop_chromebook" />
        <div>my app</div>
        <q-space />
        <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
        <q-btn dense flat icon="close" @click="closeApp" />
      </q-bar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="200"
      :breakpoint="400"
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <Menu/>

      </q-scroll-area>
      <q-img class="absolute-top" src="src/assets/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="src/assets/boy-avatar.png" alt="avatar" />
          </q-avatar>
          <div class="text-weight-bold">杂乱无章</div>
          <div> <q-btn icon="rss_feed" size="sm" type="a" href="https://github.com/wllcyg" target="_blank"></q-btn> </div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import Menu from 'src/layouts/Menu.vue'
import { ref } from 'vue'
import { usePlatForem } from '../hooks/usePlatForem'
const { isMac,isElectron } = usePlatForem()
const drawer = ref(true)
function minimize() {
  window.myWindowAPI.minimize()
}

function toggleMaximize() {
  window.myWindowAPI.toggleMaximize()
}

function closeApp() {
  window.myWindowAPI.close()
}
</script>
