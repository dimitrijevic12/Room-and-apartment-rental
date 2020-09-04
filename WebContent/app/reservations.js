Vue.component("reservations",{
	template: `
<div class="reservations">
	<div class="wrapper">
		<div class="search-reservation">
			<form>
				<h1>Search</h1>
				<label>Apartment type</label><br>
				<select class="input" name="type">
					<option selected>-</option>
					<option>ROOM</option>
					<option>APARTMENT</option>
				</select> <br/>
				<label>Apartment's name</label><br>
				<input class="input" list="apartments" name="name"><br>
				<datalist id="apartments">
					<option value="Pupinova palata"></option>
					<option value="Hotel zlatiborska noc"></option>
					<option value="Hotel Grande"></option>
				</datalist>
				<label>Apartment's status</label><br>
				<select class="input" name="status">
					<option selected>-</option>
					<option>ACTIVE</option>
					<option>INACTIVE</option>
				</select> <br/>
				<label>Date</label><br>
				<input class="input" type="date" name=""><br>
				<label>Username</label><br>
				<input class="input" type="" name=""><br>
				<div class="buttons">
					<button>Submit</button>
				</div>
			</form>
		</div>
		<div class="reservations-list-label">
		<ul class="">
			<li v-for="res in reservations" class="reservation">
				<label>{{res.apartmentId}}</label>
				<label>{{res.guestUsername}}</label>
				<label>from: {{res.checkInDate}}</label>
				<label>nights: {{res.nightCount}}</label>
				<div class="display-button">
					<button>Display</button>
				</div>
			</li>
		</div>
	</div>
</div>
	`,

	data: function(){
		return{
			reservations: null
		}
	},

	mounted: function(){
		axios
			.get('rest/reservations/')
			.then((response) => {
				this.reservations = response.data;
			})
	}
/*	beforeRouteUpdate (to, from, next) {
//    	if(this.App.$cookies.get('user').role === 'ANON') {
//		if(to.$cookies.get('user').role === 'ANON'){
		if(this.$cookies.get('user').role === 'ANON'){
			alert("Pristupanje reservations bez dozvole")
			next('#');
		}
  },*/
})