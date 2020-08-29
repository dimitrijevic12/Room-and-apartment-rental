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



var editProfileComponent = Vue.component('edit-profile-popup',{
	template: `
		<div id="edit-profile-modal" class="modal" ref="editProfileModal">

			<!-- Modal content -->
			<div id="edit-profile-modal-content" class="signUpModal-content">
				<span @click="closeEditProfilePopup" class="close">&times;</span><br/><br/>
				<label>Username:</label>
				<label>{{ user.username }}</label>
				<label>Password:</label>
				<input type="text" v-model="user.password"/><br/>
				<label>Confirm Password:</label>
				<input type="text" v-model="user.confirmPassword"/><br/>
				<label>Name:</label>
				<input type="text" v-model="user.name"/><br/>
				<label>Surname:</label>
				<input type="text" v-model="user.surname"/><br/>
				<label>Gender:</label>
				<input type="radio" id="genderMale" value="MALE" v-model="user.gender">
				<label for="genderMale" class="radioLabel">Male</label>
				<input type="radio" id="genderFemale" value="FEMALE" v-model="user.gender">
				<label for="genderFemale" class="radioLabel">Female</label><br/>
				<button v-if="editMode==='user'" @click="editUser(user)">Submit</button>
				<button v-if="editMode==='admin'" @click="editAdmin(user)">Submit</button>
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
			editMode: ''
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
		closeEditProfilePopup : function(){
			this.$refs.editProfileModal.classList.remove("modal-show");
		},
		editUser : function(user){
			let self = this;
			axios
				.put("rest/users", user)
				.then(function(response) 	{	if(response.data !== ''){
													this.$cookies.set('user', response.data, 30);
													this.App.$root.$emit('cookie-attached');
												}
											});
			self.user = {};
			this.$refs.editProfileModal.classList.remove("modal-show");
		},
		editAdmin : function(user){
			let self = this;
			axios
				.put("rest/users", user)
			self.user = {};
			this.$refs.editProfileModal.classList.remove("modal-show");
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
/*													self.user.username = '';
													self.user.password = '';
													self.user.confirmPassword = '';
													self.user.name = '';
													self.user.surname = '';
													
*/													self.$refs.signupModal.classList.remove("modal-show");
													self.closeSignUpPopup();
												}else{
													self.usernameExists = 'true'
													self.$refs.username.style.border = "solid #e50000";
													self.$refs.username.style.borderWidth = "2px";
												}
											});
			
//			self.user = {};
//			this.$refs.signupModal.classList.remove("modal-show");
		},
		createUser : function(user){
			let self = this;
			axios
				.post("rest/users", user);	
			this.$refs.signupModal.classList.remove("modal-show");
		}
	}
});

var signinComponent = Vue.component('signin-popup',{
	template: `
		<div id="signin-modal" class="modal" ref="signinModal">

			<!-- Modal content -->
			<div id="signinModal-content" class="signUpModal-content">
				<span @click="closeSignInPopup" class="close">&times;</span><br/><br/>
				<label>Username:</label>
				<input type="text" v-model="userLogin.username"/><br/>
				<label>Password:</label>
				<input type="text" v-model="userLogin.password"/><br/>
				<button @click="loginUser(userLogin)">Login</button>
			</div>

		</div>
	`,
	data : function(){
		return {
			userLogin : {
				username : '',
				password : ''
			}
		}
	},
	mounted: function(){
		this.$root.$on('open-signin-modal', () => this.$refs.signinModal.classList.add("modal-show"));
	},
	methods : {
		closeSignInPopup : function(){
			this.$refs.signinModal.classList.remove("modal-show");
			this._data.userLogin = {}
		},
		loginUser : function(userLogin){
			let self = this;
			axios
				.post("rest/users/login", userLogin)
				.then(function(response)	{ 	if(response.data !== ''){
													this.$cookies.set('user', response.data, "1h");
													console.log(this.$cookies.get('user'));
													this.App.$root.$emit('cookie-attached');
													if(response.data.role === 'ADMIN'){
														location.href="#/users";	
													}
	//												if(response.data !== '') this.App.$root.$emit('mode-changed', response.data.role);
												}
											});
			self.userLogin = {};						
			this.$refs.signinModal.classList.remove("modal-show");
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
