<template>
  <div class="homepage">
    <div class="top">
      <!-- <div class="icon"  @click="exit"> -->
      <!-- <el-icon ><SwitchButton /></el-icon>
        <span style="font-size：20px" >退出</span> -->
      <button class="icon" @click="exit">
        <el-icon
          :size="20"
          color="rgb(135, 94, 78)"
          style="vertical-align: -25%"
          ><SwitchButton /></el-icon
        >退出
      </button>
      <button class="connection" @click="connection">连一连</button>
      <!-- </div> -->
    </div>
    <h1 style="font-size: 100px">欢迎来到首页！</h1>
    <div class="footer">Designed By @ RJKFxiangmuzu</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      token: '',
      timer: null // 存储定时器的 ID
    }
  },
  created () {
    // 调用接口刷新 token 的方法
    // this.refreshToken()
    // 设置定时器，每隔一定的时间调用一次刷新 token 的方法
    this.timer = setInterval(() => {
      this.refreshToken()
      console.log('刷新token')
    }, 50000)
  },
  beforeUnmount () {
    // 清除定时器
    clearInterval(this.timer)
  },
  methods: {
    async exit () {
      // 清除定时器
      clearInterval(this.timer)
      // this.$http.post('/api/test/logout').then(response => {
      //   // 清除本地存储的 token
      sessionStorage.removeItem('token')
      //   // 重定向到登录页面
      this.$router.push('/LogIn')
      // }).catch(error => {
      // // 处理错误情况
      //   console.error('退出失败', error)
      // })
    },
    connection () {
      this.$router.push('/ConnectionPage')
    },
    refreshToken () {
      // console.log(sessionStorage.getItem('token'))
      // 调用刷新 token 的接口
      // 例如使用 axios 进行网络请求
      this.$http
        .post('/api/test/refresh', { token: sessionStorage.getItem('token') })
        .then((response) => {
          // console.log(response)
          // 在成功获取到新的 token 后，可以根据自己的业务逻辑进行相应的处理
          sessionStorage.setItem('token', response.data.data)
        })
        .catch((error) => {
          console.error('登录已过期', error)
          this.$message({
            message: '登录已过期,请重新登录',
            type: 'warning'
          })
          this.exit()
        })
    }
  }
}
</script>
<style scoped>
.homepage {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url("../../assets/background.jpg") center center no-repeat;
  background-size: 100% 100%;
  position: fixed;
  text-align: center;
}

/* .homepage::before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  height: 100%;
} */
/* 在这个例子中，.homepage 使用了 Flex 布局，
使用了 justify-content: center 和 align-items: center 属性来水平和垂直居中子元素。
通过 ::before 伪元素和垂直居中的技巧对齐 h1 元素。 */
h1 {
  display: inline-block;
  vertical-align: middle;
  color: rgb(135, 94, 78);
}
.icon {
  position: absolute;
  width: 80px;
  padding: 5px;
  top: 10px;
  right: 50px;
  background-color: aliceblue;
  color: rgb(135, 94, 78);
  font-weight: 900;
  font-size: 15px;
  border-radius: 20px;
}
.connection{
  position: absolute;
  width: 80px;
  padding: 5px;
  top: 10px;
  right: 140px;
  background-color: aliceblue;
  color: rgb(135, 94, 78);
  font-weight: 900;
  font-size: 15px;
  border-radius: 20px;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: rgb(135, 94, 78);
  color: aliceblue;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: rgb(135, 94, 78);
  color: aliceblue;
  font-size: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
}
</style>
