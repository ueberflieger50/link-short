<template>
	<div>
		<Navbar class="mb-4" />
		<Nuxt class="max-w-screen-2xl m-auto pl-4 pr-4" />
	</div>
</template>

<script>
export default {

}
</script>

<style>
.page-enter-active,
.page-leave-active {
	transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}
.page-enter,
.page-leave-to {
	opacity: 0;
	transform: translateY(-8px)

}
</style>