<template>
	<div>
		<Navbar />
		<Nuxt class="max-w-screen-2xl m-auto pl-4 pr-4" />
	</div>
</template>

<script>
export default {};
</script>

<style lang="postcss">
.page-enter-active,
.page-leave-active {
	transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}
.page-enter,
.page-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}
input {
	@apply focus:outline-none
					border-gray-400 border-b-2
					placeholder-transparent
					h-10
					w-full;
}
label {
	@apply text-gray-600
					-top-2.5
					left-0
					absolute
					transition-all
					text-sm
					cursor-text
					peer-placeholder-shown:text-gray-400
					peer-placeholder-shown:top-2
					peer-placeholder-shown:text-lg
					peer-focus:text-gray-600 peer-focus:-top-2.5 peer-focus:text-sm;
}
</style>
