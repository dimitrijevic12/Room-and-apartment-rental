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
				<label>Name:</label>
				<input type="text" v-model="user.name"/><br/>
				<label>Surname:</label>
				<input type="text" v-model="user.surname"/><br/>
				<label>Gender:</label>
				<input type="radio" id="genderMale" value="MALE" v-model="user.gender">
				<label for="genderMale" class="radioLabel">Male</label>
				<input type="radio" id="genderFemale" value="FEMALE" v-model="user.gender">
				<label for="genderFemale" class="radioLabel">Female</label><br/>
				<button @click="editUser(user)">Submit</button>
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
				gender : '',
				role : 'GUEST'
			}
		}
	},
	mounted: function(){
		this.$root.$on('open-edit-profile-modal', (user) => {this.$refs.editProfileModal.classList.add("modal-show");
															 console.log(user);
															 this.user = user});
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
		}
	}
});

var signupComponent = Vue.component('signup-popup',{
	template: `
		<div id="signup-modal" class="modal" ref="signupModal">

			<!-- Modal content -->
			<div id="signUpModal-content" class="signUpModal-content">
				<span @click="closeSignUpPopup" class="close">&times;</span><br/><br/>
				<label>Username:</label>
				<input type="text" v-model="user.username"/><br/>
				<label>Password:</label>
				<input type="text" v-model="user.password"/><br/>
				<label>Name:</label>
				<input type="text" v-model="user.name"/><br/>
				<label>Surname:</label>
				<input type="text" v-model="user.surname"/><br/>
				<label>Gender:</label>
				<input type="radio" id="genderMale" value="MALE" v-model="user.gender">
				<label for="genderMale" class="radioLabel">Male</label>
				<input type="radio" id="genderFemale" value="FEMALE" v-model="user.gender">
				<label for="genderFemale" class="radioLabel">Female</label><br/>
				<button @click="createUser(user)">Submit</button>
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
				gender : '',
				role : 'GUEST'
			}
		}
	},
	mounted: function(){
		this.$root.$on('open-signup-modal', () => this.$refs.signupModal.classList.add("modal-show"));
	},
	methods : {
		closeSignUpPopup : function(){
			this.$refs.signupModal.classList.remove("modal-show");
		},
		createUser : function(user){
			let self = this;
			axios
				.post("rest/users", user)
				.then(function(response) 	{	if(response.data !== ''){
													this.$cookies.set('user', response.data, 30);
													this.App.$root.$emit('cookie-attached');
												}	
											});
			self.user = {};
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
													this.$cookies.set('user', response.data, 30);
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
	components : {
		'signinComponent' : signinComponent,
		'signupComponent' : signupComponent
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
