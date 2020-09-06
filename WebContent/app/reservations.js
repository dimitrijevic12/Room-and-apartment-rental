Vue.component('reservations',{
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
					<button @click="show_reservation(res)">Display</button>
				</div>	
				<reservation-modal></reservation-modal>
			</li>
			</ul>
		</div>
	</div>
</div>
	`,

	data: function(){
		return{
			reservations: null,
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
		show_reservation(reservation){
			this.$root.$emit('show-reservation', reservation);
		}
	}
});

Vue.component('reservation-modal',{
	template:
		`
			<div id="reservation-modal" class="modal" ref="showReservationModal">
				<form>
					<h1 class="naslov">{{apartment.name}}</h1>
					<div class="row">
						<label>username: {{oneReservation.guestUsername}}</label>
					</div>
					<div>
						<label>Gost: {{user.name}} {{user.surname}}</label>
					</div>
					<div class="row">
					<label>Pocetni datum: {{oneReservation.checkInDate}}</label>
					</div>
					<div class="row">
					<label>Broj nocenja: {{oneReservation.nightCount}}</label>
					</div>
					<div class="row">
						<label>Cena: {{oneReservation.total}} </label>
					</div>
					<div class="row">
						<label>Komentar:</label><br/>
						<textarea name="komentar" readonly maxlength="255">{{oneReservation.message}}</textarea>
					</div>
		
					<div class="row">				
						<div class="buttons">
							<button type="button">Prihvati</button>
							<button type="button">Odbij</button>
							<button type="button" @click="close_modal_dialog()">Izadji</button>
						</div>
					</div>
				</form>
			</div>
		`,
		data: function(){
			return{
				oneReservation: {},
				user: {},
				apartment: {},
			}
		},
		
		mounted: function(){
			this.$root.$on('show-reservation',(reservation) => {
				this.oneReservation = reservation;
				
				axios.get('rest/apartments/'+this.oneReservation.apartmentId)
					.then((response)=>{
					this.apartment = response.data;})
				axios.get('rest/users/'+this.oneReservation.guestUsername)
					.then((response)=>{
					this.user = response.data;})
					this.$refs.showReservationModal.classList.add("modal-show");
					this.$refs.showReservationModal.style.display = "block";
			});
			
		},
		methods: {
			close_modal_dialog(){
				console.log("usao sam da ga odradim");
				//this.$refs.showReservationModal.classList.remove("modal-show");
			}
		}
		
		
	
});

