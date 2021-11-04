<template>
  <main class="flex flex-col items-center">
    <h1 class="text-4xl">Login</h1>
    <Form button-text="Login" :submit-function="userLogin"/>
  </main>
</template>

<script>
export default {
  middleware: 'auth',
  auth: 'guest',
  methods: {
    userLogin(userInfo) {
      this.$auth.loginWith('local', { data: userInfo})
    }
  }
}
</script>