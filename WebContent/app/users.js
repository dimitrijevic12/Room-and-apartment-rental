Vue.component('users',{
	template:`
		<table>
			<tr v-for="u in users">
				<td>{{u.username}}</td>
				<td>{{u.name}}</td>
				<td>{{u.surname}}</td>
				<td>{{u.gender}}</td>
				<td v-if="mode === 'admin'">{{u.role}}</td>
			</tr>
		</table>
	`,
	data : function(){
		return {
			mode: '',
			users: null
		}
	},
	mounted : function(){
		if(this.$cookies.get('user').role === 'HOST'){
			this.mode = 'HOST';
		}else{
			this.mode = 'ADMIN';
			axios
				.get('rest/users')
				.then((response) => this.users = response.data)
		}
	}
})