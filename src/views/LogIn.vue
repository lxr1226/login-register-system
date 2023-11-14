<template>
  <div class="login" v-loading="loading">
    <div class="main">
 <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          label-position="left"
          label-width="60px"
          class="loginForm"
          :hide-required-asterisk="true">
          <div>
            <el-form-item label="账 号" class="item" prop="uname">
              <el-input  style="border-radius: 20px" v-model="loginForm.uname" type="text" placeholder="请输入"/>
              </el-form-item>
          </div>
          <div>
            <el-form-item label="密 码" class="item" prop="upwd">
              <el-input class="input" v-model="loginForm.upwd" type="password" placeholder="请输入" show-password/></el-form-item>
          </div>
          <div>
                <el-button
                @click.prevent="submitForm('loginForm')"
                class="btn"
                style="background-color: rgb(135, 94, 78); color:white"
                >
                登录</el-button>
                <el-button @click="ToSign" class="btn" style="background-color: rgb(135, 94, 78); color:white">注册</el-button>
              </div>
        </el-form>
    <div class="footer">
      Designed By @ RJKFxiangmuzu
    </div>
    </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        uname: '',
        upwd: ''
      },
      rules: {
        uname: [{ required: true, message: '账号不能为空!', trigger: 'blur' }],
        upwd: [{ required: true, message: '密码不能为空!', trigger: 'blur' }]
        // prop 属性用于指定表单项的校验字段名称，而验证规则 (rules) 用于定义对应字段的校验规则。它们之间的关系是通过 prop 属性的值来建立的。
        // 当表单项传入具体的值后，验证规则会根据 prop 对应的字段进行校验，在验证规则中，通过设置字段名称来找到对应的属性进行校验。
      },
      loading: false // 是否显示加载动画
    }
  },
  methods: {
    ToSign () {
      this.$router.push('/SignIn')
    },
    submitForm (formName) {
      // (valid) => { ... } 是校验方法的回调函数，valid 参数表示表单校验的结果
      // 为 true 表示通过校验，为 false 表示未通过校验。
      this.$refs[formName].validate((valid) => {
        this.loading = true
        // 点击登录后，让登录按钮开始转圈圈（展示加载动画）
        if (valid) {
          this.$http({
            url: '/api/login',
            method: 'post',
            params: { // 请求参数
              account: this.loginForm.uname,
              password: this.loginForm.upwd
            }
          }).then((res) => {
            if (res.data.code === 200) {
              // const token = res.data.data
              sessionStorage.setItem('token', res.data.data)
              // 这行代码是将登录成功后返回的用户信息存储在sessionStorage中。
              // window.sessionStorage.setItem('token', token)
              this.$router.push('/HomePage')
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
            this.loading = false
            // console.log(res)
          })
        } else {
          console.log('error submit!!')
          this.loading = false
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.login{
  /* width: 100%;
  height: 100%; */
  background-image: url("../assets/background.jpg");
  background-size: 100% 100%;
  min-height: 100vh;
  min-width: 100vw;
  text-align:center;
}
.main{
  width: 612px;
  height: 387px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position:absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto; /*是一种用于水平居中元素的简便方式，通常用于块级元素的水平居中布局。*/
  border-radius: 20px;
  background-image: linear-gradient(rgba(135, 94, 78,0), rgba(135, 94, 78,1));
  box-shadow: 0 0 30px 3px;
}
/**
.loginForm{
  position: absolute;
  margin: auto;
  top: 0;left: 0;bottom: 0;right: 0;
  width: 80%;
  height: 80%;
  text-align: center;*/
  /* display: flex; */
  /* 设置容器为flex布局 */
   /* justify-content: center; */
    /* 水平居中 */
   /* align-items: center;     */
    /* 垂直居中 */
  /* flex-direction: column;  */
  /* 设置子元素排列方向为纵向 */
/* } */
.item{
  width: 420px;
  background-color: rgb(135, 94, 78);
  border-radius: 15px;
  margin: 40px;
  padding: 20px;
}
.btn{
  margin: 10px 60px;/*行内元素无法设置宽度和高度. 块级元素可以设置宽度、高度、内边距和外边距。*/
  border-color:5px solid rgb(135, 94, 78);
  border: none; /* 去除按钮的边框线 */
  width: 80px;
  height: 40px;
  font-weight: bold
}
:deep .loginForm .el-form-item__label{
  /* 使用deep穿透修改组件内的样式 */
    color: white;
    font-weight: bold;
    font-size:17px;
  }
/* .input{
  border-radius: 20px;
} */
.footer{
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  color: aliceblue;
  font-size: 15px;
  /* display: flex;
  justify-content: center;
  align-items: center; */
}
</style>
