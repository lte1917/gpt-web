<template>
	<div class="buJnuC">
		<div class="fvfNpo">
			<div class="uXyMu">
				<BackToHomepage />
				<div class="fNAZQD">
					<div class="dgrFox">
						<div class="DaoRb">
							<h1 class="eSHwvX">Create an account</h1>
							<form >
								<ErrorAlert :error-msg="authError" @clearError="clearError" />
								<div class="jGQTZC">

									<label class="iJLvzO">
										<div class="fdCSlG">
											<input class="cmCuLh" type="text" placeholder="Email address" v-model="email" />
										</div>
									</label>

									<label class="iJLvzO">
										<div class="fdCSlG">
											<input class="cmCuLh" type="text" placeholder="Username" v-model="username" />
										</div>
									</label>

									<label class="iJLvzO">
										<div class="fdCSlG">
											<input class="cmCuLh" type="password" placeholder="Password" v-model="password" />
										</div>
									</label>

									<el-form-item prop="verificationCode">

										<div class="fdCSlG">
											<el-input v-model="verificationCode" class="cmCuLh" placeholder="Verification code">
												<template #suffix>
												<span id="suffix-span">
													<span>|</span>
														<span id="suffix-span-2" @click="sendMail()" ref="spanRef" :style="{color: '#1764FF'}">{{ isSendValidationCode }}</span>
												</span>
												</template>
											</el-input>
										</div>
									</el-form-item>
								</div>
								<div class="jGQTZC">
									<button class="gZMQdu" type="submit" :disabled="loading" @click.prevent="signUp()">
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
import {registerAPI,validateMailAPI} from '@/api';
import BackToHomepage from '@/components/common/BackToHomepage/AppBackToHomepage.vue';
import ErrorAlert from '@/components/common/ErrorAlert/ErrorAlert.vue';
const username = ref('');
const email = ref('');
const verificationCode = ref('');
const password = ref('');
const loading = ref(false);
const authError = ref('')
const spanRef = ref()
const isSendValidationCode = ref<string>('发送验证码')


const sendMail = async () => {
	if (!email.value) return authError.value = 'Email required'
	if (!email.value.match(/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/)) return authError.value = 'Invalid email format'
	clearError()
	validateMailAPI(email.value).then((res) => {
		isSendValidationCode.value = '60秒后重新发送'
		spanRef.value.style = 'color: gray;' // 颜色变灰
		const countDown = ref<number>(60) // 倒计时
		const temp = setInterval(() => {
			countDown.value--
			isSendValidationCode.value = countDown.value + '秒后重新发送'
			if (!countDown.value) {
				clearInterval(temp)
				spanRef.value.style = 'color: #1764FF;' // 颜色变蓝
				isSendValidationCode.value = '重新发送验证码'
				countDown.value = 60
			}
		}, 1000)

	}).catch((err) => {
		authError.value = err.message
	});
}

const signUp = async () => {
	if (!email.value) return authError.value = 'Email required'
	if (!username.value) return authError.value = 'Username required';
	if (!verificationCode.value) return authError.value = 'Verification code required';
	if (verificationCode.value.toString().length != 6) return authError.value = 'Verification code must be 6 numbers'
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
	registerAPI(email.value, verificationCode.value,username.value, password.value).then((res) => {
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
