<template>
	<div class="buJnuC">
		<div class="fvfNpo">
			<div class="uXyMu">
				<BackToHomepage />
				<div class="fNAZQD">
					<div class="dgrFox">
						<div class="DaoRb">
							<h1 class="eSHwvX">Forgot password</h1>
							<form @submit.prevent="resetPassword">
								<ErrorAlert :error-msg="authError" @clearError="clearError" />
								<SuccessAlert :success-msg="authSuccess" @clearSuccess="clearSuccess" />
								<div class="jGQTZC">
									<label class="iJLvzO">
										<div class="fdCSlG">xzc
											<input class="cmCuLh" type="text" placeholder="Email address" v-model="email">
										</div>
									</label>
								</div>
								<button class="gZMQdu" type="submit" :disabled="loading">
									<div class="bjhGPG" :class="{loading: loading}">Request</div>
									<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="jjoFVh" :class="{loading: loading}">
										<g fill="none" stroke-width="1.5" stroke-linecap="round" class="faEWLr" style="stroke: var(--icon-color);">
											<circle stroke-opacity=".2" cx="8" cy="8" r="6"></circle>
											<circle cx="8" cy="8" r="6" class="VFMrX"></circle>
										</g>
									</svg>
								</button>
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
import { ref } from 'vue';
import BackToHomepage from '@/components/common/BackToHomepage/AppBackToHomepage.vue';
import ErrorAlert from '@/components/common/ErrorAlert/ErrorAlert.vue';
import SuccessAlert from '@/components/common/SuccessAlert/SuccessAlert.vue';
const authError = ref('')
const authSuccess = ref('')
const loading = ref(false)
const email = ref('')
const resetPassword = async () =>{
	loading.value = true
}
const clearError = () => {
	authError.value = ''
}
const clearSuccess = () => {
  authSuccess.value = '';
};
</script>
