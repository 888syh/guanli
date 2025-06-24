<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>工单管理系统</h2>
      <el-form 
        :model="loginForm" 
        :rules="rules" 
        ref="loginFormRef"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            native-type="submit" 
            class="login-btn"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <p class="login-tip">admin用户拥有删除权限</p >
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { setUserRole } from '@/utils/auth'

const router = useRouter()
const loginForm = ref({
  username: '',
  password: ''
})
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = () => {
  const role = setUserRole(loginForm.value.username)
  console.log('Setting user role:', role); // 调试用
  
  if (role) {
    localStorage.setItem('userRole', role);
    router.push('/dashboard');
  } else {
    ElMessage.error('登录失败，请重试');
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 30px;
  text-align: center;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
}

.login-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 20px;
}
</style>