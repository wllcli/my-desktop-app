<template>
  <q-layout view="hhh lpr lFf" class="layout-container rounded-borders">
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
    <div class="content">
      <div class="slider-container">
        <q-img  src="src/assets/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="src/assets/boy-avatar.png" alt="avatar" />
          </q-avatar>
          <div class="text-weight-bold">杂乱无章</div>
          <div> <q-btn icon="rss_feed" size="sm" type="a" href="https://github.com/wllcyg" target="_blank"></q-btn> </div>
        </div>
      </q-img>
        <Menu />
      </div>
      <div class="content-container">
        <router-view />
      </div>
    </div>

  </q-layout>
</template>

<script setup>
import Menu from 'src/layouts/Menu.vue'
import { usePlatForem } from '../hooks/usePlatForem'
const { isMac, isElectron } = usePlatForem()
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
<style scoped lang="scss">
$height:calc(100vh - 32px);
.layout-container {
  overflow: hidden;
}

.content {
  margin-top: 32px;
  display: grid;
  grid-template-columns: 200px 1fr;
  .slider-container {
    border-right: 1px solid #ddd;
    height: $height;
    overflow-y: auto;
  }
  .content-container {
    background-color: #FAFAFA;
    padding: 20px;
    height: $height;
    overflow-y: auto;
  }
}

.q-page-container {
  background-color: #FAFAFA;

}
</style>
