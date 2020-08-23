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

Vue.component('signup-popup',{
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
				<label>Role:</label>
				<input type="radio" id="roleGuest" value="GUEST" v-model="user.role">
				<label for="roleGuest" class="radioLabel">Guest</label>
				<input type="radio" id="roleHost" value="HOST" v-model="user.role">
				<label for="roleHost" class="radioLabel">Host</label><br/>
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
				role : ''
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
			axios
				.post("rest/users", user)
				.then(function(response) 	{	this.$cookies.set('user', response.data, 30);
												this.App.$root.$emit('cookie-attached');
											});

			this.$refs.signupModal.classList.remove("modal-show");
		}
	}
});

Vue.component('signin-popup',{
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
		},
		loginUser : function(userLogin){
//			console.log(userLogin);
			axios
				.post("rest/users/login", userLogin)
				.then(function(response)	{ 	this.$cookies.set('user', response.data, 30);
												this.App.$root.$emit('cookie-attached');
											});
			this.$refs.signinModal.classList.remove("modal-show");
		}
	}
});

var App = new Vue({
	el: '#topnav',
	data : {
		isActive : '',
		dropdownActive : false,
		profile : ''
	},
	mounted : function(){
		this.isActive = 'home';
		var temp = this.$cookies.get('user');
		if(temp === null){
			this.profile = 'Profile';
		}else{
			this.profile = temp.username;
		}
		this.$root.$on('cookie-attached', function(){
			var temp = this.$cookies.get('user');
		if(temp === null){
			this.profile = 'Profile';
		}else{
			this.profile = temp.username;
		}
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
		logout : function(){
			this.$cookies.remove('user');
			this.$root.$emit('cookie-attached');
		}
	}
});
