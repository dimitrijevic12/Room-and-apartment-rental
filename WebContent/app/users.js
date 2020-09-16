Vue.component('users',{
	template:`
		<div class="page-background">
			<div class="page">
				<div class="page-content">
					<div class="search-bar">
						<div class="label-input">
							<label>Username:</label>
							<input v-model="filters.username" type="text"/>
						</div>
						<div class="label-input">
							<label>Name:</label>
							<input v-model="filters.name" type="text"/>
						</div>
						<div class="label-input">
							<label>Surname:</label>
							<input v-model="filters.surname" type="text"/>
						</div>
						<div class="label-input">
							<label class="select-label">Gender:</label>
							<select v-model="filters.gender" name="genders" id="genders">
								<option value=""></option>
								<option value="MALE">Male</option>
								<option value="FEMALE">Female</option>
							</select>
						</div>
						<div v-if="mode='ADMIN'" class="label-input">
							<label class="select-label">Role:</label>
							<select v-model="filters.role" name="roles" id="roles">
								<option value=""></option>
								<option value="GUEST">Guest</option>
								<option value="HOST">Host</option>
								<option value="ADMIN">Admin</option>
							</select>
						</div>
						<button @click="filter()" class="filter-btn">
							<img src="images/output-onlinepngtools (6).png" width="45" height="45">
						</button>
						<button @click="createUser" v-if="mode==='ADMIN'" class="create-btn">Create user</button>
					</div>
				<br/>
				<table class="users-table">
					<tr>
						<th class="clickable-th" v-if="toggleUsername === false" @click="sortUsernameAsc">Username</th>
						<th class="clickable-th" v-if="toggleUsername === true" @click="sortUsernameDsc">Username</th>
						<th class="clickable-th" v-if="toggleName === false" @click="sortNameAsc">Name</th>
						<th class="clickable-th" v-if="toggleName === true" @click="sortNameDsc">Name</th>
						<th class="clickable-th" v-if="toggleSurname === false" @click="sortSurnameAsc">Surname</th>
						<th class="clickable-th" v-if="toggleSurname === true" @click="sortSurnameDsc">Surname</th>
						<th>Gender</th>
						<th v-if="mode === 'ADMIN'">Role</th>
					</tr>
					<tr v-for="u in filteredUsers" v-on:dblclick="editProfile(u)" v-bind:key="u.username">
						<td>{{u.username}}</td>
						<td>{{u.name}}</td>
						<td>{{u.surname}}</td>
						<td>{{u.gender}}</td>
						<td v-if="mode === 'ADMIN'">{{u.role}}</td>
					</tr>
				</table>
				<signup-popup></signup-popup>
				<edit-profile-popup></edit-profile-popup>
				</div>
			</div>
		</div>
	`,
	data : function(){
		return {
			mode: '',
			filters: {
				username: '',
				name: '',
				surname: '',
				gender: '',
				role: '',
			},
			users: null,
			filteredUsers: {},
			tableKey: 0,
			toggleUsername: false,
			toggleName: false,
			toggleSurname: false,
		}
	},
	created(){
		this.mode = this.$cookies.get('user').role;
	},
	mounted : function(){
		if(this.$cookies.get('user').role === 'HOST'){
			axios
				.get('rest/users/guests/' + this.$cookies.get('user').username)
				.then((response) => {this.users = response.data;
									 this.filteredUsers = response.data})
		}else{
			axios
				.get('rest/users')
				.then((response) => {this.users = response.data;
									 this.filteredUsers = response.data})
		}
		console.log(this.mode);
		console.log(this.mode === 'ADMIN')
	},
	methods: {
		filter(){
			if(this.filters.username === '' && this.filters.name === '' && this.filters.surname === '' && this.filters.gender === '' && this.filters.role === ''){
				this.filteredUsers = this.users;
			}else{
				this.filteredUsers = this.users.filter((item) => {
					console.log(item.gender.trim()  + ' ' + this.filters.gender.trim() )
					if(item.gender.trim()  === (this.filters.gender.trim())){
						console.log('true');
					}else{
						console.log('false');
					}
					return item.username.toLowerCase().includes(this.filters.username.toLowerCase()) &&
						   item.name.toLowerCase().includes(this.filters.name.toLowerCase()) &&
						   item.surname.toLowerCase().includes(this.filters.surname.toLowerCase()) &&
						   item.gender.startsWith(this.filters.gender) &&
						   item.role.toLowerCase().includes(this.filters.role.toLowerCase());
				})
				console.log(this.filteredUsers);
			}
		},

		editProfile(user){
			if(this.$cookies.get('user').role === 'HOST'){
				return;
			}else{
				this.$root.$emit('open-edit-profile-table', user);
			}
		},

		createUser(){
			this.$root.$emit('open-create-user');
		},
		
		sortUsernameAsc(){
			console.log(this.users)
			function compare(a, b) {
				if (a.username < b.username)
					return -1;
				if (a.username > b.username)
					return 1;
				return 0;
		   }
		
			this.users =  this.users.sort(compare);
			console.log(this.users)
			this.toggleUsername = true;
		},
		
		sortUsernameDsc(){
			console.log(this.users)
			function compare(a, b) {
				if (a.username > b.username)
					return -1;
				if (a.username < b.username)
					return 1;
				return 0;
		   }
		
			this.users =  this.users.sort(compare);
			console.log(this.users)
			this.toggleUsername = false;
		},
		
		sortNameAsc(){
			console.log(this.users)
			function compare(a, b) {
				if (a.name < b.name)
					return -1;
				if (a.name > b.name)
					return 1;
				return 0;
		   }
		
			this.users =  this.users.sort(compare);
			console.log(this.users)
			this.toggleName = true;
		},
		
		sortNameDsc(){
			console.log(this.users)
			function compare(a, b) {
				if (a.name > b.name)
					return -1;
				if (a.name < b.name)
					return 1;
				return 0;
		   }
		
			this.users =  this.users.sort(compare);
			console.log(this.users)
			this.toggleName = false;
		},
		
		sortSurnameAsc(){
			console.log(this.users)
			function compare(a, b) {
				if (a.surname < b.surname)
					return -1;
				if (a.surname > b.surname)
					return 1;
				return 0;
		   }
		
			this.users =  this.users.sort(compare);
			console.log(this.users)
			this.toggleSurname = true;
		},
		
		sortSurnameDsc(){
			console.log(this.users)
			function compare(a, b) {
				if (a.surname > b.surname)
					return -1;
				if (a.surname < b.surname)
					return 1;
				return 0;
		   }
		
			this.users =  this.users.sort(compare);
			console.log(this.users)
			this.toggleSurname = false;
		},
	},
})