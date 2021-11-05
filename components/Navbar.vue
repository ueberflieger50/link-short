<template>
	<nav
		class="
			flex
			items-center
			justify-between
			border-b border-gray-400
			p-4
			sticky
			bg-white
			transition-all
			mb-4
			z-50
		"
	>
		<NuxtLink id="header-link" class="text-4xl font-semibold" to="/">
			Link Shortener
		</NuxtLink>
		<div v-if="!$auth.loggedIn">
			<NuxtLink
				to="register"
				class="py-2 px-3 bg-yellow-400 rounded mr-2 font-medium"
				>Register</NuxtLink
			>
			<NuxtLink to="login" class="py-2 px-3 bg-yellow-400 rounded font-medium"
				>Login</NuxtLink
			>
		</div>
		<button
			v-else
			class="bg-blue-900 text-white font-semibold px-4 py-2 rounded"
			@click="logout()"
		>
			Logout
		</button>
	</nav>
</template>

<script>
export default {
	mounted() {
		const nav = document.querySelector('nav');
		window.addEventListener('scroll', () => {
			if (window.pageYOffset > 70) {
				nav.classList.add('top-4', 'rounded', 'shadow-lg', 'mx-4');
				nav.classList.remove('top-0', 'border-b', 'border-gray-200');
			} else if (window.pageYOffset < 70) {
				nav.classList.remove('top-4', 'rounded', 'shadow-lg', 'mx-4');
				nav.classList.add('top-0', 'border-b', 'border-gray-200');
			}
		});
	},
	methods: {
		// logout user
		async logout() {
			await this.$axios.delete('/auth/logout');
			this.$auth.reset();
		},
	},
};
</script>

<style></style>
