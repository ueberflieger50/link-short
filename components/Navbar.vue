<template>
	<nav class="flex items-center justify-between border-b border-gray-400 p-4">
		<NuxtLink id="header-link" class="text-4xl font-semibold" to="/">
			Link Shortener
		</NuxtLink>
		<div>
			<NuxtLink to="register" class="py-2 px-3 bg-yellow-400 rounded mr-2 font-medium"
				>Register</NuxtLink
			>
			<NuxtLink to="login" class="py-2 px-3 bg-yellow-400 rounded font-medium"
				>Login</NuxtLink
			>
		</div>
	</nav>
</template>

<script>
export default {};
</script>

<style></style>
