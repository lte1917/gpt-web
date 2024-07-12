<template>
	<div class="buJnuC">
		<div class="fvfNpo">
			<div class="uXyMu">
				<BackToHomepage />
				<div class="fNAZQD">
					<div class="dgrFox">

						<div class="DaoRb">
							<h1 class="eSHwvX">Log in</h1>
							<ErrorAlert :error-msg="authError" @clearError="clearError" />
							<form @submit.prevent="login">
								<div class="jGQTZC">
									<label class="iJLvzO">
										<div class="fdCSlG">
											<input class="cmCuLh" type="text" placeholder="Username" v-model="username"/>
										</div>
									</label>
<!--									<label class="iJLvzO" >-->
<!--										<div class="fdCSlG">-->
<!--											<input class="cmCuLh" type="text" placeholder="Verification Code" v-model="VerificationCode"/>-->
<!--										</div>-->
<!--									</label>-->
									<label class="iJLvzO">
										<div class="fdCSlG">
											<input class="cmCuLh" type="password" placeholder="Password" v-model="password" />
										</div>
									</label>
								</div>
								<div class="jGQTZC">
									<button class="gZMQdu" type="submit" :disabled="loading">
										<div class="bjhGPG" :class="{loading: loading}">Log in</div>
										<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="jjoFVh" :class="{loading: loading}">
											<g fill="none" stroke-width="1.5" stroke-linecap="round" class="faEWLr" style="stroke: var(--icon-color);">
												<circle stroke-opacity=".2" cx="8" cy="8" r="6"></circle>
												<circle cx="8" cy="8" r="6" class="VFMrX"></circle>
											</g>
										</svg>

									</button>
									<router-link to="forgetPassword" class="fTZPOV">Forgot your password?</router-link>
								</div>
							</form>
							<div class="jGQTZC">
								<p class="dEDhcH">Don’t have Sustech Chat account?</p>
								<router-link to="/register">
									<button class="lcqpaS">
										<div class="bjhGPG">Create new account</div>
									</button>
								</router-link>
							</div>
						</div>

					</div>
				</div>
				<p class="cyDNyc">
					This site is authenticate by supabase.com and the Supabase
					<a target="_blank" href="https://supabase.com/privacy" rel="noreferrer"> Privacy Policy </a>
					and <a target="_blank" href="https://supabase.com/terms" rel="noreferrer"> Terms of Service </a>
					apply.
				</p>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import {router} from "@/router";
import { ref } from 'vue';
import BackToHomepage from '@/components/common/BackToHomepage/AppBackToHomepage.vue';
import ErrorAlert from "@/components/common/ErrorAlert/ErrorAlert.vue";
import {loginAPI} from '@/api';
const username = ref('');
// const VerificationCode = ref('');
const password = ref('');
const loading = ref(false);
const authError = ref('')


const login = () => {
	if (!username.value) return authError.value = 'Username required';
	if (username.value.length < 3) return authError.value = 'Username must be at least 3 characters'
	if (username.value.length > 64) return authError.value = 'Username must be at most 64 characters'
	if (!password.value) return authError.value = 'Password required';
	if (password.value.length < 6) return authError.value = 'Password must be at least 6 characters'
	if (password.value.length > 64) return authError.value = 'Password must be at most 64 characters'

	loading.value = true;
	loginAPI(username.value, password.value).then((res) => {
		loading.value = false;
		alert('Login success')
		// 登录成功 push to /chat
		router.push('/chat')
	}).catch((err) => {
		loading.value = false;
		alert(err.message)
		authError.value = err.message
	})
	// 添加登录逻辑
}


const clearError = () => {
	authError.value = ''
}
</script>
