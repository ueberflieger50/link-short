<template>
	<main>
		<h1 class="text-4xl">Hello World</h1>
		<span
			>Data at
			<code class="bg-gray-700 text-gray-200 p-1 rounded">JSON</code>
			endpoint:
			<code v-show="jsonData" class="bg-gray-700 text-gray-200 p-1 rounded">{{ jsonData }}</code>
		</span>
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