<template>
	<main>
		<LinkForm />
		<ListMy v-if="$auth.loggedIn" />
	</main>
</template>

<script>
export default {
	data() {
		return {
			jsonData: null,
		}
	},
	mounted() {
		// fetch('/api/JSON')
		// 	.then((res) => res.text())
		// 	.then((res) => {
		// 		this.jsonData = res
		// 	})
	},
}
</script>