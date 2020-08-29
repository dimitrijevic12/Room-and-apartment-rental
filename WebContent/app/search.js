Vue.component("search", {
	template:`
<div class="search-page-container">
	<div class="column">
		<div class="search-bar">
			<div class='label-input'>
				<label>
					Address:
				</label>
				<input type="text"/>
			</div>
		</div>
		<br>
		<table class="users-table">
			<tr v-for="a in apartments">
				<td>{{a.location.address}}</td>
				<td>{{a.status}}</td>
				<td>{{a.type}}</td>
				<td>{{a.hostUsername}}</td>
			</tr>
		</table>
	</div>
	<div class="column">
		Desna strana
	</div>
</div>
	`,
	data(){
		return{
			apartments: null,
			mode: 'ANON'
		}
	},
	mounted(){
		if((this.$cookies.get('user') === null) || (this.$cookies.get('user').role === 'GUEST')){
			axios
				.get('rest/apartments/guest')
				.then((response) => {this.apartments = response.data});
		}else if(this.$cookies.get('user').role === 'HOST'){
			axios
				.get('rest/apartments/host/' + this.$cookies.get('user').username)
				.then((response) => {this.apartments = response.data})
		}else{
			axios
				.get('rest/apartments/')
				.then((response) => {this.apartments = response.data})
		}
	}
})