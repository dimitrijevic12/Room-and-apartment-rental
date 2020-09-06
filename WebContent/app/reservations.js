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
					<button @click="showReservation(res)">Display</button>
				</div>	
				<reservation></reservation>
			</li>
			</ul>
		</div>
	</div>
</div>
	`,

	data: function(){
		return{
			reservations: null,
			mode: "HIDDEN"
		}
	},

	mounted: function(){
		axios
			.get('rest/reservations/')
			.then((response) => {
				this.reservations = response.data;
			})
	},
	
	methods: {
		showReservation(reservation){
			this.$root.$emit('show-reservation',reservation);
			this.mode="SHOW";
		}
	}
/*	beforeRouteUpdate (to, from, next) {
//    	if(this.App.$cookies.get('user').role === 'ANON') {
//		if(to.$cookies.get('user').role === 'ANON'){
		if(this.$cookies.get('user').role === 'ANON'){
			alert("Pristupanje reservations bez dozvole")
			next('#');
		}
  },*/
});

Vue.component('reservation',{
	template:
		`
			<div id="reservation-modal" class="modal" ref="showReservationModal">
				<form>
					<h1 class="naslov"></h1>
					<div class="row">
						<label>username: {{reservation.guestUsername}}</label>
					</div>
					<div>
						<label>Gost: </label>
					</div>
					<div class="row">
					<label>Pocetni datum: {{reservation.checkInDate}}</label>
					</div>
					<div class="row">
					<label>Broj nocenja: {{reservation.nightCount}}</label>
					</div>
					<div class="row">
						<label>Cena: {{reservation.total}} </label>
					</div>
					<div class="row">
						<label>Komentar:</label><br/>
						<textarea name="komentar" readonly maxlength="255">{{reservation.message}}</textarea>
					</div>
		
					<div class="row">				
						<div class="buttons">
							<button type="button">Prihvati</button>
							<button type="button">Odbij</button>
							<button type="button">Izadji</button>
						</div>
					</div>
				</form>
			</div>
		`,
		props:['info'],
		data: function(){
			return{
				reservation: null,
				user: null,
				apartment: null,
			}
		},
		
		mounted: function(){
			
			this.$root.$on('show-reservation',(reservation) => {this.reservation = reservation});
			
			axios.get('rest/apartments/'+reservation.apartmentId)
			.then((response)=>{
				this.apartment = response.data;
			})
			
			axios.get('rest/users/'+reservation.guestUsername)
			.then((response)=>{
				this.user = response.data
			})
			
			this.$refs.showReservationModal.style.display = "block";
	}
});

