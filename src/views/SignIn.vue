<template>
  <div class="sign" v-loading="loading">
<div class="main" >
<el-form
          :model="signForm"
          :rules="rules"
          ref="signForm"
          label-position="left"
          label-width="80px"
          class="signForm"
          :hide-required-asterisk=true>
          <!-- size用于控制该表单内组件的尺寸 -->
          <div>
              <el-form-item label="账 号" class="items" prop="uname">
              <el-input  style="border-radius: 20px" v-model="signForm.uname" placeholder="请输入"/>
              </el-form-item>
          </div>
          <div>
            <el-form-item label="密 码" class="items" prop="upwd">
              <el-input class="input" v-model="signForm.upwd" type="password" placeholder="请输入" show-password />
              </el-form-item>
          </div>
          <div>
            <el-form-item label="确认密码" class="items" prop="upwd1">
              <el-input class="input" v-model="signForm.upwd1" type="password" placeholder="请输入" show-password/>
              </el-form-item>
          </div>
          <div>
            <el-form-item label="邮 箱" class="items" prop="email">
            <el-input class="input" v-model="signForm.email" type="email" placeholder="请输入" ></el-input>
            <el-button
            class="sendCode"
            @click="sendVerificationCode('signForm')"
            :disabled="isSending" :style="{fontWeight: 'bold'}">发送验证码</el-button>
              </el-form-item>
          </div>
          <div>
            <el-form-item label="验证码" class="items" prop="code">
              <el-input class="input" v-model="signForm.code" type="text" placeholder="请输入" />
              </el-form-item>
          </div>
          </el-form>
          <div>
                <el-button  @click="ToLogin" class="btn" style="background-color: rgb(135, 94, 78); color:white">返回</el-button>
                <el-button  @click="submitForm('signForm')" class="btn" style="background-color: rgb(135, 94, 78); color:white" >注册</el-button>
                <el-button  @click="resetForm('signForm')" class="btn" style="background-color: rgb(135, 94, 78); color:white">重试</el-button>
          </div>
<div class="footer">
      Designed By @ RJKFxiangmuzu
    </div>
</div>
  </div>
</template>

<script scoped>
export default {
  data () {
    //     在校验函数中，可以通过访问 rule 对象来获取当前字段的验证规则，可以使用 value 参数来获取当前字段的值进行校验。
    // 最后，根据校验结果，通过调用 callback() 函数来通知验证机制当前字段的校验结果。
    // 总而言之，(rule, value, callback) 是自定义校验函数的标准参数，用于接收和处理当前字段的校验信息，
    // 并通过调用 callback() 函数返回校验结果给表单验证机制。
    const validateUpwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码!!'))
      } else {
        // if (this.signForm.checkPass !== '') {
        //   this.$refs.signForm.validateField('checkPass')
        // }
        callback()
      }
    }
    const validateUpwd1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码!!'))
      } else if (value !== this.signForm.upwd) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    // const validateCode = async (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入验证码!!'))
    //   // } else if (value !== this.signForm.code) {
    //   //   callback(new Error('两次输入的密码不一致'))
    //   } else {
    //     callback(new Error('发生了错误'))
    //   }
    // }

    return {
      signForm: {
        uname: '',
        upwd: '',
        upwd1: '',
        email: '',
        code: ''
      },
      rules: {
        uname: [{ required: true, message: '账号不能为空!!', trigger: 'blur' }],
        upwd: [{ required: true, validator: validateUpwd, trigger: 'blur' }],
        upwd1: [{ required: true, validator: validateUpwd1, trigger: 'blur' }],
        code: [{ required: true, message: '验证码不能为空！！', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱不能为空！！', trigger: 'blur' }]

      },
      loading: false,
      isSending: false,
      isVerificationCodeCorrect: false,
      hascode: ''
    }
  },
  methods: {
    ToLogin () {
      this.$router.push('/LogIn')
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        this.loading = true
        this.$http.post('/api/decrypt', {
          code: this.signForm.code,
          hascode: this.hascode
        }).then((res) => {
          if (res.data.code === 200) {
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
          console.log(res)
        })
        if (valid) {
          this.$http({
            url: '/api/register',
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              account: this.signForm.uname,
              password: this.signForm.upwd
            }
          }).then((res) => {
            if (res.data.code === 200) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })

              this.$refs[formName].resetFields()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
            this.loading = false
            console.log(res)
          })
        } else {
          console.log('error submit!!')
          this.loading = false
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    async sendVerificationCode (formName) {
      try {
        // 首先验证邮箱是否为空
        if (!this.signForm.email) {
          // 邮箱为空，提示错误
          console.error('邮箱不能为空')
          this.$message({
            message: '邮箱不能为空!',
            type: 'warning'
          })
          return // 停止继续执行
        }
        this.isSending = true

        const response = await this.$http.post('/api/SendEmail', {
          email: this.signForm.email
        })

        console.log('验证码已发送')
        console.log(response)
        console.log(response.data)
        console.log(response.data.data)
        this.hascode = response.data.data
        // 在这个表达式中，我们创建了一个延迟 2 秒钟后解决的 Promise 对象。
        // setTimeout 函数用于设置一个定时器，在指定的时间后调用 resolve 函数，将 Promise 解决为成功状态。
        // 使用 await 关键字可以等待这个 Promise 对象的解决。
        // 当 await 表达式执行时，它会暂停所在的函数的执行，等待 Promise 对象解决为成功状态。一旦 Promise 解决为成功，
        // await 表达式会返回解决的结果，然后继续执行后续的代码。
        await new Promise(resolve => setTimeout(resolve, 2000))

        // 发送成功
        // this.isVerificationCodeCorrect = !this.isVerificationCodeCorrect
      } catch (error) {
        console.error('发送验证码失败', error)
        this.$message({
          message: '发送验证码失败!请检查您的邮箱格式是否正确！',
          type: 'warning'
        })
      } finally {
        this.isSending = false
      }
    }
  }
}
</script>
<style scoped>
.sign{
  min-height: 100vh;
  min-width: 100vw;
  background-image: url("../assets/background.jpg");
  background-size: 100% 100%;
  text-align:center;
}
.main{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  /* gap: 20px; */
  width: 600px;
  height: 650px;
  /* height: auto; 法一：可以实现高度自适应*/
  /* min-height: 700px;法二：可以实现高度自适应 */
  /* overflow:hidden; 法三：可以实现高度自适应*/
  position:absolute;
  left: 0;
  top: 0;
  right: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border-radius: 20px;
  background-image: linear-gradient(rgba(223, 208, 203, 0), rgb(155, 114, 97));
  box-shadow: 0 0 30px 3px;
}

.items{
  position: relative;
  width: 420px;
  background-color: rgb(136, 88, 68);
  border-radius: 15px;
  margin: 40px;
  padding: 20px;
}
.sendCode{
  position: absolute;
  top: 0;
  right: 0;
}
:deep .signForm .el-form-item__label {/*给 <el-form> 组件添加一个自定义的类名，并在对应的 CSS 文件中进行修改。 */
  color: white;
  font-weight: bold;
    font-size:17px;
}
.btn{
  display: inline-block;
  margin: 5px 50px;/*行内元素无法设置宽度和高度. 块级元素可以设置宽度、高度、内边距和外边距。*/
  background-color: rgb(136, 88, 68);
  border: none; /* 去除按钮的边框线 */
  width: 80px;
  height: 40px;
  font-weight: bold
}
.input{
  border-radius: 20px;
}
.footer{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  color: aliceblue;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
