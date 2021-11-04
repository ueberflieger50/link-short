<template>
	<form
		class="flex flex-col mt-6 w-64"
		@submit.prevent="submitFunction(userInfo)"
	>
		<div class="relative">
			<input
				id="username"
				v-model="userInfo.username"
				name="username"
				type="text"
				class="peer"
				placeholder="username"
				required
			/>
			<label for="username">Username</label>
		</div>
		<div class="mt-10 relative">
			<input
				id="password"
				v-model="userInfo.password"
				name="password"
				type="password"
				class="peer"
				placeholder="password"
				required
			/>
			<label for="password">Password</label>
		</div>
		<div v-if="registerTrue" class="mt-10 relative">
			<input
				id="repPassword"
				v-model="userInfo.repPassword"
				name="repPassword"
				type="password"
				class="peer"
				placeholder="repeat password"
				required
			/>
			<label for="repPassword">Repeat Password</label>
		</div>
		<span v-if="!passwordMatch" class="text-red-600 absolute"
			>The passwords do not match.</span
		>
		<button
			type="submit"
			class="py-2 px-4 mt-10 bg-yellow-400 text-white font-medium rounded-md"
		>
			{{ buttonText }}
		</button>
	</form>
</template>

<script>
export default {
	props: {
		buttonText: {
			type: String,
			default: null,
		},
		submitFunction: {
			type: Function,
			default: null,
		},
		registerTrue: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			userInfo: {
				username: '',
				password: '',
				repPassword: '',
			},
		};
	},
	computed: {
		passwordMatch() {
			if (
				this.userInfo.password === this.userInfo.repPassword ||
				(this.userInfo.password === '' && this.userInfo.repPassword === '')
			) {
				return true;
			} else {
				return false;
			}
		},
	},
};
</script>

<style lang="postcss">
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
					peer-placeholder-shown:text-gray-400
					peer-placeholder-shown:top-2
					peer-placeholder-shown:text-lg
					peer-focus:text-gray-600 peer-focus:-top-2.5 peer-focus:text-sm;
}
</style>
