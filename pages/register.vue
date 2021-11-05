<template>
	<main class="flex flex-col items-center">
		<h1 class="text-4xl">Register</h1>
		<Form button-text="Register" :submit-function="userRegistration" :register-true="true" />
	</main>
</template>

<script>
export default {
  middleware: 'auth',
  auth: 'guest',
	methods: {
		async userRegistration(userInfo) {
			await this.$axios.post('/auth/register', userInfo);
			await this.$auth.loginWith('local', { data: userInfo });
		},
	},
};
</script>
