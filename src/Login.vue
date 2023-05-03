<template>
  <div class="box">
    <el-carousel :interval="2000" type="card" height="400px">
      <el-carousel-item v-for="img of imgs" :key="img">
        <img :src="img">
      </el-carousel-item>
    </el-carousel>
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">面向流程工业系统的安全度量系统</span>
        </div>
      </template>
      <el-form :model="form" label-width="60px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" show-password/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="login">登录</el-button>
        <el-button type="success" plain @click="form.username = ''; form.password = ''">清空</el-button>
      </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div class="footer">
    <span>Powered by</span>
    <el-tooltip effect="dark" content="Vue3" placement="top" :hide-after="0">
      <img src="https://upyun.wuuconix.link/image-vue-logo.svg">
    </el-tooltip>
    <el-tooltip effect="dark" content="Vite" placement="top" :hide-after="0">
      <img src="https://upyun.wuuconix.link/image-vite-log.svg">
    </el-tooltip>
    <el-tooltip effect="dark" content="TypeScript" placement="top" :hide-after="0">
      <img src="https://upyun.wuuconix.link/image-typescript-original.svg">
    </el-tooltip>
    <el-tooltip effect="dark" content="ElementPlus" placement="top" :hide-after="0">
      <img src="https://upyun.wuuconix.link/image-element-plus-logo-small.svg">
    </el-tooltip>
    <el-tooltip effect="dark" content="GoJs" placement="top" :hide-after="0">
      <img src="https://upyun.wuuconix.link/image-gojs.ico">
    </el-tooltip>
    <el-tooltip effect="dark" content="Dagre" placement="top" :hide-after="0">
      <img src="https://upyun.wuuconix.link/image-dagre-logo.png">
    </el-tooltip>
    <el-tooltip effect="dark" content="Echarts" placement="top" :hide-after="0">
      <img src="https://upyun.wuuconix.link/image-echarts-logo.png">
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const form = reactive({
  username: "",
  password: ""
})
const imgs = [
  "https://sina.wuuconix.link/large/007YVyKcly1hdjywtzo1yj31c00u0e6r.jpg",
  "https://sina.wuuconix.link/large/007YVyKcly1hdjyz0ls7cj30rj0dwgwb.jpg",
  "https://sina.wuuconix.link/large/007YVyKcly1hdjyzlurj9j30xc0j0naa.jpg",
  "https://sina.wuuconix.link/large/007YVyKcly1hdjz0398dqj31hc0zk1l0.jpg",
  "https://sina.wuuconix.link/large/007YVyKcly1hdjz0psv8kj31hc0zke84.jpg",
  "https://sina.wuuconix.link/large/007YVyKcly1hdjz16k36uj30m80bu0w0.jpg"
]
const router = useRouter()

function login() {
  if (form.username == "" || form.password == "") {
    return ElMessage({
      message: '账号或者密码不能为空!',
      type: 'error',
    })
  }
  if (form.username == "root" && form.password == "root") {
    console.log(router)
    localStorage.setItem("isLogin", "1")
    router.push('/')
  } else {
    ElMessage({
      message: '账号或者密码错误!',
      type: 'error',
    })
  }
}
</script>

<style scoped>
div.box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: calc(100vh - 64px);
}
img {
  height: 100%;
}
.el-carousel {
  width: 50%;
}
.el-carousel img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
span.title {
  background: -webkit-linear-gradient(315deg,#42d392 25%,#647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  letter-spacing: -.5px;
  font-weight: 900;
}
div.footer {
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
}

div.footer img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  margin: 0 6px;
}

div.footer span {
  line-height: 32px;
  font-size: 18px;
  font-weight: bold;
}
</style>  