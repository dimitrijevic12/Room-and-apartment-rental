axios.defaults.withCredentials = true

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});


// TODO: Koristi signup popup za edit i koristi v-if za username input
var editProfileComponent = Vue.component('edit-profile-popup',{
	template: `
		<div id="edit-profile-modal" class="modal" ref="editProfileModal">

			<!-- Modal content -->
			<div id="edit-profile-modal-content" class="signUpModal-content">
				<div v-if="editMode ==='user'">
					<span @click="closeEditProfilePopup" class="close">&times;</span><br/><br/>
				</div>
				<div v-if="editMode ==='admin'">
					<span @click="closeEditProfilePopupAdmin" class="close">&times;</span><br/><br/>			
				</div>
				<div class="label-input-signup first" ref="username">
					<label>Username (permanent) :</label>
					<label class="username-placeholder">{{ user.username }}</label>
				</div>
				<div v-if="editMode === 'user'" class="label-input-signup" ref="password">
					<div class='label-error'>
						<label>Password:</label>
						<label v-if="passwordError === 'true'"class="error-message" ref="passwordError">Please make sure you've entered password that is correct.</label>
					</div>
					<input type="password" v-model="password"/><br/>
				</div>
				<div v-if="editMode === 'user'" class="label-input-signup" ref="newPassword">
					<div class='label-error'>
						<label>New password:</label>
						<label v-if="newPasswordError === 'true'"class="error-message" ref="newPasswordError">Please make sure you've entered password that is correct size.</label>
						<label v-if="newPasswordExists === 'true'"class="error-message" ref="newPasswordExists">New password cannot be same as old password.</label>
					</div>
					<input type="password" v-model="newPassword"/><br/>
				</div>
				<div v-if="editMode === 'user'" class="label-input-signup" ref="confirmPassword">
					<div class='label-error'>
						<label>Confirm Password:</label>
						<label v-if="confirmPasswordError === 'true'"class="error-message" ref="confirmPasswordError">Please make sure your passwords match.</label>
					</div>
					<input type="password" v-model="confirmPassword"/><br/>
				</div>
				<div class="label-input-signup" ref="name">
					<div class='label-error'>
						<label>Name:</label>
						<label v-if="nameError === 'true'" class="error-message" ref="nameError">Please make sure you've entered your name.</label>
					</div>
					<input type="text" v-model="user.name"/><br/>
				</div>
				<div class="label-input-signup last" ref="surname">
					<div class='label-error'>
						<label>Surname:</label>
						<label v-if="surnameError === 'true'" class="error-message" ref="surnameError">Please make sure you've entered your surname.</label>
					</div>
					<input type="text" v-model="user.surname"/><br/>
				</div>
				<div class="radio-input-signup">
					<label class="radioLabel">Gender:</label>
					<input type="radio" id="genderMale" value="MALE" v-model="user.gender">
					<label for="genderMale">Male</label>
					<input type="radio" id="genderFemale" value="FEMALE" v-model="user.gender">
					<label for="genderFemale">Female</label><br/>
				</div>
				<div class="signup-button-containter">
					<button v-if="editMode==='user'" @click="editUser(user)">Submit</button>
					<button v-if="editMode==='admin'" @click="editAdmin(user)">Submit</button>
				</div>
			</div>

		</div>
	`,
	data : function(){
		return {
			user: {
				username : '',
				password : '',
				confirmPassword : '',
				name : '',
				surname : '',
				gender : '',
				role : 'GUEST'
			},
			password: '',
			confirmPassword: '',
			newPassword: '',
			editMode: '',
			passwordError: '',
			confirmPasswordError: '',
			nameError: '',
			surnameError: '',
			newPasswordError: '',
			newPasswordExists: ''
		}
	},
	mounted: function(){
		this.$root.$on('open-edit-profile-modal', (user) => {this.$refs.editProfileModal.classList.add("modal-show");
															 console.log(user);
															 this.user = user;
															 this.editMode = "user"});
		
		this.$root.$on('open-edit-profile-table', (user) => {this.$refs.editProfileModal.classList.add("modal-show");
															 console.log(this.$refs);
															 this.user = user;
															 this.editMode = "admin"});
		// TODO: Proveri zasto pravi gresku iako radi, greska je this.$refs.editProfileModal is undefined
	},
	methods : {
		closeEditProfilePopupAdmin: function(){
			this.nameError = '';
			this.$refs.name.style.border = "solid grey";
			this.$refs.name.style.borderWidth = "0.5px";
			this.$refs.name.style.borderBottom = "0";

			this.surnameError = '';
			this.$refs.surname.style.border = "solid grey";
			this.$refs.surname.style.marginTop = "0";
			this.$refs.surname.style.borderWidth = "0.5px";

			this.$refs.editProfileModal.classList.remove("modal-show");
		},
		closeEditProfilePopup : function(){
			this.passwordError = '';
			this.$refs.password.style.border = "solid grey";
			this.$refs.password.style.borderWidth = "0.5px";
			this.$refs.password.style.borderBottom = "0";

			this.newPassword = '';
			this.newPasswordError = '';
			this.newPasswordExists = '';
			this.$refs.newPassword.style.border = "solid grey";
			this.$refs.newPassword.style.marginTop = "0";
			this.$refs.newPassword.style.borderWidth = "0.5px";
			this.$refs.newPassword.style.borderBottom = "0";

			this.confirmPassword = '';
			this.confirmPasswordError = '';
			this.$refs.confirmPassword.style.border = "solid grey";
			this.$refs.confirmPassword.style.marginTop = "0";
			this.$refs.confirmPassword.style.borderWidth = "0.5px";
			this.$refs.confirmPassword.style.borderBottom = "0";

			this.nameError = '';
			this.user.name = '';
			this.$refs.name.style.border = "solid grey";
			this.$refs.name.style.borderWidth = "0.5px";
			this.$refs.name.style.borderBottom = "0";

			this.surnameError = '';
			this.user.surname = '';
			this.$refs.surname.style.border = "solid grey";
			this.$refs.surname.style.marginTop = "0";
			this.$refs.surname.style.borderWidth = "0.5px";

			this.$refs.editProfileModal.classList.remove("modal-show");
		},
		editUser : function(user){
			let validation = true;
			if(this.password === '' || this.password !== this.user.password){
				this.$refs.password.style.border = "solid #e50000";
				this.$refs.password.style.borderWidth = "2px";
				this.passwordError = 'true';
				validation = false;
			}else{
				this.passwordError = '';
				this.$refs.password.style.border = "solid grey";
				this.$refs.password.style.borderWidth = "0.5px";
				this.$refs.password.style.borderBottom = "0";
			}

			if(this.newPassword === this.user.password){
				this.$refs.newPassword.style.border = "solid #e50000";
				this.$refs.newPassword.style.marginTop = "-2px";
				this.$refs.newPassword.style.borderWidth = "2px";
				this.newPasswordExists = 'true';
				this.newPasswordError = '';
				validation = false;
			}else{
				this.$refs.newPassword.style.border = "solid grey";
				this.$refs.newPassword.style.marginTop = "0";
				this.$refs.newPassword.style.borderWidth = "0.5px";
				this.$refs.newPassword.style.borderBottom = "0";
				this.newPasswordError = '';
				this.newPasswordExists = '';
			}

			if(this.confirmPassword !== this.newPassword){
				this.$refs.confirmPassword.style.border = "solid #e50000";
				this.$refs.confirmPassword.style.marginTop = "-2px";
				this.$refs.confirmPassword.style.borderWidth = "2px";
				this.confirmPasswordError = 'true';
				validation = false;
			}else{
				this.$refs.confirmPassword.style.border = "solid grey";
				this.$refs.confirmPassword.style.marginTop = "0";
				this.$refs.confirmPassword.style.borderWidth = "0.5px";
				this.$refs.confirmPassword.style.borderBottom = "0";
				this.confirmPasswordError = '';
			}

			if(this.user.name === ''){
				this.$refs.name.style.border = "solid #e50000";
				this.$refs.name.style.marginTop = "-2px";
				this.$refs.name.style.borderWidth = "2px";
				this.nameError = 'true';
				validation = false;
			}else{
				this.$refs.name.style.border = "solid grey";
				this.$refs.name.style.marginTop = "0";
				this.$refs.name.style.borderWidth = "0.5px";
				this.$refs.name.style.borderBottom = "0";
				this.nameError = '';
			}

			if(this.user.surname === ''){
				this.$refs.surname.style.border = "solid #e50000";
				this.$refs.surname.style.marginTop = "-2px";
				this.$refs.surname.style.borderWidth = "2px";
				this.$refs.surname.style.borderRadius = "0 0 8px 8px";
				this.$refs.surname.classList.remove('last');
				this.surnameError = 'true';
				validation = false;
			}else{
				this.$refs.surname.style.border = "solid grey";
				this.$refs.surname.style.marginTop = "0";
				this.$refs.surname.style.borderWidth = "0.5px";
				this.$refs.surname.classList.add('last');
				this.surnameError = '';
			}
			

			if(validation === false){
				return;
			}
			
			if(this.newPassword !== ''){
				this.user.password = this.newPassword;
			}
			
			let self = this;
			axios
				.put("rest/users", user)
				.then(function(response) 	{	if(response.data !== ''){
													this.$cookies.set('user', response.data, 30);
													this.App.$root.$emit('cookie-attached');
													new Toast({
														  message: 'You have successfully edited personal information!',
														  type: 'success'
														});
													self.closeEditProfilePopup();
												}
											});

		},
		editAdmin : function(user){
			let validation = true;

			if(this.user.name === ''){
				this.$refs.name.style.border = "solid #e50000";
				this.$refs.name.style.marginTop = "-2px";
				this.$refs.name.style.borderWidth = "2px";
				this.nameError = 'true';
				validation = false;
			}else{
				this.$refs.name.style.border = "solid grey";
				this.$refs.name.style.marginTop = "0";
				this.$refs.name.style.borderWidth = "0.5px";
				this.$refs.name.style.borderBottom = "0";
				this.nameError = '';
			}

			if(this.user.surname === ''){
				this.$refs.surname.style.border = "solid #e50000";
				this.$refs.surname.style.marginTop = "-2px";
				this.$refs.surname.style.borderWidth = "2px";
				this.$refs.surname.style.borderRadius = "0 0 8px 8px";
				this.$refs.surname.classList.remove('last');
				this.surnameError = 'true';
				validation = false;
			}else{
				this.$refs.surname.style.border = "solid grey";
				this.$refs.surname.style.marginTop = "0";
				this.$refs.surname.style.borderWidth = "0.5px";
				this.$refs.surname.classList.add('last');
				this.surnameError = '';
			}
			

			if(validation === false){
				return;
			}
			
			if(this.newPassword !== ''){
				this.user.password = this.newPassword;
			}
			
			let self = this;
			axios
				.put("rest/users", user)
				.then(function(response) 	{	if(response.data !== ''){
													self.$refs.editProfileModal.classList.remove("modal-show");
													self.$parent.tableKey += 1;
												}
											});
		}
	}
});

var signupComponent = Vue.component('signup-popup',{
	template: `
		<div id="signup-modal" class="modal" ref="signupModal">

			<!-- Modal content -->
			<div id="signUpModal-content" class="signUpModal-content">
				<span @click="closeSignUpPopup" class="close">&times;</span><br/><br/>
				<div class="label-input-signup first" ref="username">
					<div class='label-error'>
						<label>Username:</label>
						<label v-if="usernameError === 'true'"class="error-message" ref="usernameError">Please make sure you've entered username that is correct size.</label>
						<label v-if="usernameExists === 'true'"class="error-message" ref="usernameExists">Username already exists. Please enter different username.</label>
					</div>
					<input type="text" v-model="user.username"/><br/>
				</div>
				<div class="label-input-signup" ref="password">
					<div class='label-error'>
						<label>Password:</label>
						<label v-if="passwordError === 'true'"class="error-message" ref="passwordError">Please make sure you've entered password that is correct size.</label>
					</div>
					<input type="password" v-model="user.password"/><br/>
				</div>
				<div class="label-input-signup" ref="confirmPassword">
					<div class='label-error'>
						<label>Confirm Password:</label>
						<label v-if="confirmPasswordError === 'true'"class="error-message" ref="confirmPasswordError">Please make sure your passwords match.</label>
					</div>
					<input type="password" v-model="confirmPassword"/><br/>
				</div>
				<div class="label-input-signup" ref="name">
					<div class='label-error'>
						<label>Name:</label>
						<label v-if="nameError === 'true'" class="error-message" ref="nameError">Please make sure you've entered your name.</label>
					</div>
					<input type="text" v-model="user.name"/><br/>
				</div>
				<div class="label-input-signup last" ref="surname">
					<div class='label-error'>
						<label>Surname:</label>
						<label v-if="surnameError === 'true'" class="error-message" ref="surnameError">Please make sure you've entered your surname.</label>
					</div>
					<input type="text" v-model="user.surname"/><br/>
				</div>
				<div class="radio-input-signup">
					<label class="radioLabel">Gender:</label>
					<input type="radio" id="genderMale" value="MALE" v-model="user.gender">
					<label for="genderMale">Male</label>
					<input type="radio" id="genderFemale" value="FEMALE" v-model="user.gender">
					<label for="genderFemale">Female</label><br/>
				</div>
				<div v-if="createMode==='admin'" class="radio-input-signup">
					<label class="radioLabel">Role:</label>
					<input type="radio" id="roleGuest" value="GUEST" v-model="user.role">
					<label for="roleGuest">Guest</label>
					<input type="radio" id="roleHost" value="HOST" v-model="user.role">
					<label for="roleHost">Host</label><br/>
				</div>
				<div class="signup-button-containter">
					<button v-if="createMode==='user'" @click="signUpUser(user)">Submit</button>
					<button v-if="createMode==='admin'" @click="createUser(user)">Submit</button>
				</div>
			</div>

		</div>
	`,
	data : function(){
		return {
			user: {
				username : '',
				password : '',
				name : '',
				surname : '',
				gender : 'MALE',
				role : 'GUEST'
			},
			confirmPassword : '',
			createMode: '',
			usernameError: '',
			usernameExists: '',
			passwordError: '',
			confirmPasswordError: '',
			nameError: '',
			surnameError: ''
		}
	},
	mounted: function(){
		this.$root.$on('open-signup-modal', () => {this.$refs.signupModal.classList.add("modal-show");
													this.createMode = 'user'});
		this.$root.$on('open-create-user', () => {this.$refs.signupModal.classList.add("modal-show");
													console.log(this.$refs);
													this.createMode = 'admin'});
	},
	methods : {
		closeSignUpPopup : function(){
			this.user.username = '';
			this.usernameError = '';
			this.$refs.username.style.border = "solid grey";
			this.$refs.username.style.borderWidth = "0.5px";
			this.$refs.username.style.borderBottom = "0";

			this.user.password = '';
			this.passwordError = '';
			this.$refs.password.style.border = "solid grey";
			this.$refs.password.style.marginTop = "0";
			this.$refs.password.style.borderWidth = "0.5px";
			this.$refs.password.style.borderBottom = "0";

			this.confirmPassword = '';
			this.confirmPasswordError = '';
			this.$refs.confirmPassword.style.border = "solid grey";
			this.$refs.confirmPassword.style.marginTop = "0";
			this.$refs.confirmPassword.style.borderWidth = "0.5px";
			this.$refs.confirmPassword.style.borderBottom = "0";

			this.nameError = '';
			this.user.name = '';
			this.$refs.name.style.border = "solid grey";
			this.$refs.name.style.borderWidth = "0.5px";
			this.$refs.name.style.borderBottom = "0";

			this.surnameError = '';
			this.user.surname = '';
			this.$refs.surname.style.border = "solid grey";
			this.$refs.surname.style.marginTop = "0";
			this.$refs.surname.style.borderWidth = "0.5px";

			this.usernameExists= '';
			this.$refs.signupModal.classList.remove("modal-show");
		},
		signUpUser : function(user){
			let validation = true;
			this.usernameExists = '';
			if(this.user.username === ''){
				this.$refs.username.style.border = "solid #e50000";
				this.$refs.username.style.borderWidth = "2px";
				this.usernameError = 'true';
				validation = false;
			}else{
				this.usernameError = '';
				this.$refs.username.style.border = "solid grey";
				this.$refs.username.style.borderWidth = "0.5px";
				this.$refs.username.style.borderBottom = "0";
			}

			if(this.user.password === ''){
				this.$refs.password.style.border = "solid #e50000";
				this.$refs.password.style.marginTop = "-2px";
				this.$refs.password.style.borderWidth = "2px";
				this.passwordError = 'true';
				validation = false;
			}else{
				this.$refs.password.style.border = "solid grey";
				this.$refs.password.style.marginTop = "0";
				this.$refs.password.style.borderWidth = "0.5px";
				this.$refs.password.style.borderBottom = "0";
				this.passwordError = '';
			}

			if(this.confirmPassword !== this.user.password){
				this.$refs.confirmPassword.style.border = "solid #e50000";
				this.$refs.confirmPassword.style.marginTop = "-2px";
				this.$refs.confirmPassword.style.borderWidth = "2px";
				this.confirmPasswordError = 'true';
				validation = false;
			}else{
				this.$refs.confirmPassword.style.border = "solid grey";
				this.$refs.confirmPassword.style.marginTop = "0";
				this.$refs.confirmPassword.style.borderWidth = "0.5px";
				this.$refs.confirmPassword.style.borderBottom = "0";
				this.confirmPasswordError = '';
			}

			if(this.user.name === ''){
				this.$refs.name.style.border = "solid #e50000";
				this.$refs.name.style.marginTop = "-2px";
				this.$refs.name.style.borderWidth = "2px";
				this.nameError = 'true';
				validation = false;
			}else{
				this.$refs.name.style.border = "solid grey";
				this.$refs.name.style.marginTop = "0";
				this.$refs.name.style.borderWidth = "0.5px";
				this.$refs.name.style.borderBottom = "0";
				this.nameError = '';
			}

			if(this.user.surname === ''){
				this.$refs.surname.style.border = "solid #e50000";
				this.$refs.surname.style.marginTop = "-2px";
				this.$refs.surname.style.borderWidth = "2px";
				this.$refs.surname.style.borderRadius = "0 0 8px 8px";
				this.$refs.surname.classList.remove('last');
				this.surnameError = 'true';
				validation = false;
			}else{
				this.$refs.surname.style.border = "solid grey";
				this.$refs.surname.style.marginTop = "0";
				this.$refs.surname.style.borderWidth = "0.5px";
				this.$refs.surname.classList.add('last');
				this.surnameError = '';
			}
			

			if(validation === false){
				return;
			}
			let self = this;
			axios
				.post("rest/users", user)
				.then(function(response) 	{	if(response.data !== ''){
													this.$cookies.set('user', response.data, 30);
													this.App.$root.$emit('cookie-attached');
													self.$refs.signupModal.classList.remove("modal-show");
													self.closeSignUpPopup();
												}else{
													self.usernameExists = 'true'
													self.$refs.username.style.border = "solid #e50000";
													self.$refs.username.style.borderWidth = "2px";
												}
											});
			
		},
		createUser : function(user){
			let validation = true;
			this.usernameExists = '';
			if(this.user.username === ''){
				this.$refs.username.style.border = "solid #e50000";
				this.$refs.username.style.borderWidth = "2px";
				this.usernameError = 'true';
				validation = false;
			}else{
				this.usernameError = '';
				this.$refs.username.style.border = "solid grey";
				this.$refs.username.style.borderWidth = "0.5px";
				this.$refs.username.style.borderBottom = "0";
			}

			if(this.user.password === ''){
				this.$refs.password.style.border = "solid #e50000";
				this.$refs.password.style.marginTop = "-2px";
				this.$refs.password.style.borderWidth = "2px";
				this.passwordError = 'true';
				validation = false;
			}else{
				this.$refs.password.style.border = "solid grey";
				this.$refs.password.style.marginTop = "0";
				this.$refs.password.style.borderWidth = "0.5px";
				this.$refs.password.style.borderBottom = "0";
				this.passwordError = '';
			}

			if(this.confirmPassword !== this.user.password){
				this.$refs.confirmPassword.style.border = "solid #e50000";
				this.$refs.confirmPassword.style.marginTop = "-2px";
				this.$refs.confirmPassword.style.borderWidth = "2px";
				this.confirmPasswordError = 'true';
				validation = false;
			}else{
				this.$refs.confirmPassword.style.border = "solid grey";
				this.$refs.confirmPassword.style.marginTop = "0";
				this.$refs.confirmPassword.style.borderWidth = "0.5px";
				this.$refs.confirmPassword.style.borderBottom = "0";
				this.confirmPasswordError = '';
			}

			if(this.user.name === ''){
				this.$refs.name.style.border = "solid #e50000";
				this.$refs.name.style.marginTop = "-2px";
				this.$refs.name.style.borderWidth = "2px";
				this.nameError = 'true';
				validation = false;
			}else{
				this.$refs.name.style.border = "solid grey";
				this.$refs.name.style.marginTop = "0";
				this.$refs.name.style.borderWidth = "0.5px";
				this.$refs.name.style.borderBottom = "0";
				this.nameError = '';
			}

			if(this.user.surname === ''){
				this.$refs.surname.style.border = "solid #e50000";
				this.$refs.surname.style.marginTop = "-2px";
				this.$refs.surname.style.borderWidth = "2px";
				this.$refs.surname.style.borderRadius = "0 0 8px 8px";
				this.$refs.surname.classList.remove('last');
				this.surnameError = 'true';
				validation = false;
			}else{
				this.$refs.surname.style.border = "solid grey";
				this.$refs.surname.style.marginTop = "0";
				this.$refs.surname.style.borderWidth = "0.5px";
				this.$refs.surname.classList.add('last');
				this.surnameError = '';
			}
			

			if(validation === false){
				return;
			}
			let self = this;
			axios
				.post("rest/users", user)
				.then(function(response) 	{	if(response.data !== ''){
													self.$refs.signupModal.classList.remove("modal-show");
													self.closeSignUpPopup();
													self.$parent.filteredUsers.push(response.data);
//													self.$parent.forceRerender();
												}else{
													self.usernameExists = 'true'
													self.$refs.username.style.border = "solid #e50000";
													self.$refs.username.style.borderWidth = "2px";
												}
											});
		}
	}
});

var signinComponent = Vue.component('signin-popup',{
	template: `
		<div id="signin-modal" class="modal" ref="signinModal">

			<!-- Modal content -->
			<div id="signinModal-content" class="signUpModal-content">
				<span @click="closeSignInPopup" class="close">&times;</span><br/><br/>
				<div class="label-input-signup first" ref="usernameLogin">
					<div class='label-error'>
						<label>Username:</label>
						<label v-if="usernameError === 'true'"class="error-message" ref="usernameError">Please make sure you've entered username.</label>
					</div>
					<input type="text" v-model="userLogin.username"/><br/>
				</div>
				<div class="label-input-signup last" ref="passwordLogin">
					<div class='label-error'>
						<label>Password:</label>
						<label v-if="passwordError === 'true'"class="error-message" ref="passwordError">Please make sure you've entered password.</label>
					</div>
					<input type="password" v-model="userLogin.password"/><br/>
				</div>
				<div class="bottom-error">
					<label v-if="loginError === 'true'"class="error-message bottom" ref="usernameError">Invalid username and/or password.</label>
				</div>
				<div class="signup-button-containter">
					<button @click="loginUser(userLogin)">Login</button>
				</div>
			</div>

		</div>
	`,
	data : function(){
		return {
			userLogin : {
				username : '',
				password : ''
			},
			usernameError: '',
			passwordError: '',
			loginError: ''
		}
	},
	mounted: function(){
		this.$root.$on('open-signin-modal', () => this.$refs.signinModal.classList.add("modal-show"));
	},
	methods : {
		closeSignInPopup : function(){
			this.usernameError = '';
			this.userLogin.username = ''
			this.$refs.usernameLogin.style.border = "solid grey";
			this.$refs.usernameLogin.style.borderWidth = "0.5px";
			this.$refs.usernameLogin.style.borderBottom = "0";

			this.passwordError = '';
			this.userLogin.password = '';
			this.$refs.passwordLogin.style.border = "solid grey";
			this.$refs.passwordLogin.style.marginTop = "0";
			this.$refs.passwordLogin.style.borderWidth = "0.5px";
			this.$refs.passwordLogin.classList.add('last');

			this.loginError = '';
			this.$refs.signinModal.classList.remove("modal-show");
		},
		loginUser : function(userLogin){
			let validation = true;
			this.loginError = '';
			if(this.userLogin.username === ''){
				this.$refs.usernameLogin.style.border = "solid #e50000";
				this.$refs.usernameLogin.style.borderWidth = "2px";
				this.usernameError = 'true';
				validation = false;
			}else{
				this.usernameError = '';
				this.$refs.usernameLogin.style.border = "solid grey";
				this.$refs.usernameLogin.style.borderWidth = "0.5px";
				this.$refs.usernameLogin.style.borderBottom = "0";
			}

			if(this.userLogin.password === ''){
				this.$refs.passwordLogin.style.border = "solid #e50000";
				this.$refs.passwordLogin.style.marginTop = "-2px";
				this.$refs.passwordLogin.style.borderWidth = "2px";
				this.$refs.passwordLogin.style.borderRadius = "0 0 8px 8px";
				this.$refs.passwordLogin.classList.remove('last');
				this.passwordError = 'true';
				validation = false;
			}else{
				this.$refs.passwordLogin.style.border = "solid grey";
				this.$refs.passwordLogin.style.marginTop = "0";
				this.$refs.passwordLogin.style.borderWidth = "0.5px";
				this.$refs.passwordLogin.classList.add('last');
				this.passwordError = '';
			}
			
			if(validation === false){
				return;
			}
			let self = this;
			axios
				.post("rest/users/login", userLogin)
				.then(function(response)	{ 	if(response.data !== ''){
													this.$cookies.set('user', response.data, "1h");
													console.log(this.$cookies.get('user'));
													this.App.$root.$emit('cookie-attached');
													if(response.data.role === 'ADMIN'){
														location.href="#/users";	
													}else{
														location.href="#/";
													}
													self.closeSignInPopup();
	//												if(response.data !== '') this.App.$root.$emit('mode-changed', response.data.role);
													}
												else{
													self.loginError = 'true';
												}
											});
		}
	}
});

var App = new Vue({
	el: '#topnav',
	data : {
		isActive : '',
		mode : 'ANON',
		dropdownActive : false,
		profile : '',
		history : window.history.length
	},
	mounted : function(){
		this.isActive = 'home';

		if(this.$cookies.get('user') === null){
			this.profile = 'Profile';
		}else{
			this.profile = this.$cookies.get('user').username;
			this.mode = this.$cookies.get('user').role;
		}
		this.$root.$on('cookie-attached', function(){
		if(this.$cookies.get('user') === null){
			this.profile = 'Profile';
		}else{
			this.profile = this.$cookies.get('user').username;
			this.mode = this.$cookies.get('user').role;
		}

		this.$root.$on('mode-changed', (role) => this.mode = role);
		});
	},
	methods : {
		openDropdown : function() {
			if(this.$refs.myDropdown.classList.contains("dropdown-content-show")){
				this.$refs.myDropdown.classList.remove("dropdown-content-show");
			}
			else{
				this.$refs.myDropdown.classList.add("dropdown-content-show");	
			}		
		},
		closeDropdown : function(){
			this.$refs.myDropdown.classList.remove("dropdown-content-show");
		},
		openSignUpPopup : function(){
//			this.$refs.signupModal.classList.add("modal-show");
			this.$root.$emit('open-signup-modal');
		},
		openSignInPopup : function(){
			this.$root.$emit('open-signin-modal');
		},
		openEditProfile : function () {
			let user = this.$cookies.get('user')
			this.$root.$emit('open-edit-profile-modal', user)
		},
		logout : function(){
			this.$cookies.remove('user');
			this.$root.$emit('cookie-attached');
			this.$root.$emit('mode-changed', 'ANON');
			this.isActive = 'home';
			location.href="#/";	
//			this.$router.go(-(window.history. - 2));
		}
	}
});
