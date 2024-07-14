<template>
	<main>
		<section class="pt-20 pb-28 min-h-screen flex flex-col justify-center">
			<div class="px-6 w-full mx-auto max-w-6xl">
				<div class="relative z-10 max-w-screen-sm">
					<p v-if="user" class="fVeafc in">Hi {{ user }}</p>
					<p v-else class="fVeafc">unauthenticated</p>
					<h1 class="kKxhrq ">
						Sustech Chat
						<br>
						Your AI Assistant
					</h1>
					<p class="kRTmDC">
						Sustech AI Chat is a chatbot that can help you with your questions and provide you answers.
					</p>
					<div class="uQxNj" v-if="user">
						<button @click="logout" class="ieMfVH" :disabled="loading">
        <span class="fKlELC" :class="{loading: loading}">
          Log out
        </span>
							<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="jjoFVh" :class="{loading: loading}">
								<g fill="none" stroke-width="1.5" stroke-linecap="round" class="faEWLr" style="stroke: var(--icon-color);">
									<circle stroke-opacity=".2" cx="8" cy="8" r="6"></circle>
									<circle cx="8" cy="8" r="6" class="VFMrX"></circle>
								</g>
							</svg>
						</button>
					</div>
					<div class="uQxNj" v-else>
						<router-link to="/login" class="bQRHNT" >
        <div class="fKlELC" >
          Login
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="taKtSf">
            <path class="chevron" d="M8 13L13 8L8 3" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
            <path class="stem" d="M12 8L2 8" stroke-width="1.5"></path>
          </svg>

   				</div>
						</router-link>

						<router-link to="/register" >
							<button class="ieMfVH">
            Sign up
							</button>
						</router-link>

					</div>
				</div>
				<div class="absolute inset-0">
					<div class="background-gradient">
						<div class="background-gradient-pattern"></div>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup lang="ts">

import {ref} from "vue";

const user = ref('')
const loading = ref(false)

const logout = async () => {
	loading.value = true
	console.log('logout')
}
// const client = useSupabaseAuthClient()
//   const user = 'LTE'
// const loading = ref(false)
//
// const logout = async () => {
//   loading.value = true
//   const { error } = await client.auth.signOut()
//   if (error) {
//     loading.value = false
//     return alert('Something went wrong !')
//   }
// }
//
// useHead({
//   title: 'supaAuth',
//   meta: [
//     { name: 'description', content: 'Authentication template with email and password, using Supabase. If you want to a quick start to your next Nuxt3 app, please feel free to use this template.' }
//   ]
// })
</script>
