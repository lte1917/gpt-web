<template>
	<div class="buJnuC">
		<div class="fvfNpo">
			<div class="uXyMu">
				<BackToHomepage />
				<div class="fNAZQD">
					<div class="dgrFox">
						<div class="DaoRb">
							<h1 class="eSHwvX">Create an account</h1>
							<form @submit.prevent="signUp">
								<ErrorAlert :error-msg="authError" @clearError="clearError" />
								<div class="jGQTZC">

									<label class="iJLvzO">
										<div class="fdCSlG">
											<input class="cmCuLh" type="text" placeholder="Email address" v-model="email" />
										</div>
									</label>
									<label class="iJLvzO">
										<div class="fdCSlG">
											<input class="cmCuLh" type="text" placeholder="username" v-model="username" />
										</div>
									</label>

									<label class="iJLvzO">
										<div class="fdCSlG">
											<input class="cmCuLh" type="password" placeholder="Password" v-model="password" />
										</div>
									</label>
								</div>
								<div class="jGQTZC">
									<button class="gZMQdu" type="submit" :disabled="loading">
										<div class="bjhGPG" :class="{loading: loading}">Sign up</div>
										<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="jjoFVh" :class="{loading: loading}">
											<g fill="none" stroke-width="1.5" stroke-linecap="round" class="faEWLr" style="stroke: var(--icon-color);">
												<circle stroke-opacity=".2" cx="8" cy="8" r="6"></circle>
												<circle cx="8" cy="8" r="6" class="VFMrX"></circle>
											</g>
										</svg>
									</button>
									<div class="xxEKN">
										By signing up you agree to our
										<a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" class="bkFclS">
											<span>API Terms of Service</span>
										</a>
										and
										<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="bkFclS">
											<span>Privacy Policy</span>
										</a>.
									</div>
								</div>
							</form>
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
import {registerAPI} from '@/api';
import BackToHomepage from '@/components/common/BackToHomepage/AppBackToHomepage.vue';
import ErrorAlert from '@/components/common/ErrorAlert/ErrorAlert.vue';
const username = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const authError = ref('')


const signUp = async () => {
	if (!email.value) return authError.value = 'Email required'
	if (!username.value) return authError.value = 'Username required';
	if (username.value.length < 3) return authError.value = 'Username must be at least 3 characters'
	if (!password.value) return authError.value = 'Password required';
	if (password.value.length < 6) return authError.value = 'Password must be at least 6 characters'
	if (password.value.length > 64) return authError.value = 'Password must be at most 64 characters'
	if (email.value.length > 64) return authError.value = 'Email must be at most 64 characters'
	if (username.value.length > 64) return authError.value = 'Username must be at most 64 characters'
	//检查邮箱格式,用表达式匹配
	if (!email.value.match(/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/)) return authError.value = 'Invalid email format'

	clearError()
	loading.value = true
	registerAPI(email.value, username.value, password.value).then((res) => {
		loading.value = false;
		alert(res.message)
		router.push('/login/')

	}).catch((err) => {
		loading.value = false;
		authError.value = err.message
	});
}

const clearError = () => {
  authError.value = ''
}

</script>
