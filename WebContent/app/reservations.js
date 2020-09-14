Vue.component('reservations',{
	template: `
<div class="reservations">
	<div class="wrapper">
		<div class="search-reservation">
			
				<h1>Search</h1>
				<label>Apartment type</label><br>
				<select v-model="filter.type" class="input" name="type">
					<option value="">ALL</option>
					<option value="ROOM">ROOMS</option>
					<option value="APARTMENT">APARTMENTS</option>
				</select> <br/>
				<label>Apartment's name</label><br>
				<input class="input" list="apartments" v-model="filter.name" name="name"><br>
				<datalist id="apartments">
					<template v-for="apart in apartments">
					<option>{{apart.name}}</option>
					</template>
				</datalist>
				<template v-if="mode==='HOST' || mode==='ADMIN'">
				<label>Apartment's status</label><br>
				<select v-model="filter.apStatus" class="input" >
					<option></option>
					<option>ACTIVE</option>
					<option>INACTIVE</option>
				</select> <br/>
				</template>
				<label>Date</label><br>
				<input v-model="filter.date" class="input" type="date" name=""><br>
				<label>Reservation status</label><br/>
				<select v-model="filter.resStatus" class="input">
					<option></option>
					<option>CREATED</option>
					<option>DENIED</option>
					<option>CANCELED</option>
					<option>ACCEPTED</option> 
					<option>COMPLETED</option>
				</select>
				<template v-if="mode==='HOST' || mode==='ADMIN'">
				<label>Username</label><br>
				<input class="input"  v-model="filter.username" type="" name=""><br>
				</template>
				<div class="buttons">
					<button @click="searchClick()">Submit</button>
				</div>
		</div>
		<div class="reservations-list-label">
		<div class="topMenu">
			<label>Sort: <button ref="sortPriceButton" @click="sortByValue('total')">Price {{sort.total}}</button></label>
		</div>
			<ul class="">
				<li v-for="res in filteredReservations" class="reservation">
					<label>{{res.apartment.name}}</label>
					<label v-if="mode !== 'GUEST'">{{res.guestUsername}}</label>
					<label>from: {{res.checkInDate | dateFormat('DD/MM/YYYY')}}</label>
					<label>nights: {{res.nightCount}}</label>
					<label>status: {{res.status}}</label>
					<label>total: {{res.total}} </label>
					<div class="display-button">
						<button @click="show_reservation(res)">Display</button>
					</div>	
				</li>
			</ul>
		</div>
	</div>
	<reservation-modal ></reservation-modal>
</div>
	`,

	data: function(){
		return{
			reservations: {},
			apartments: {},
			mode: 'GUEST',
			filter: {
				type: '',
				apStatus: '',
				name: '',
				date: '',
				username: '',
				resStatus: '',
			},
			filteredReservations: {},
			sort:{
				total: 'desc',
			},
		}
	},
	
	filters:{
		dateFormat: function(value,format){
			var parsed = moment(value);
			return parsed.format(format);
		}
	},

	mounted: function(){
		if(this.$cookies.get('user').role === 'HOST'){
			this.mode = 'HOST';
			axios
				.get('rest/reservations/host/'+this.$cookies.get('user').username)
				.then((response) => {
					this.reservations = response.data;
					this.filteredReservations = response.data;
				});
			
			axios
			.get('rest/apartments/host/'+this.$cookies.get('user').username)
			.then((response) => {
				this.apartments = response.data;
			});
			
		}else if(this.$cookies.get('user').role === 'ADMIN'){
			this.mode = 'ADMIN';
			
			axios
				.get('rest/reservations/withApartment')
				.then((response) => {
					this.reservations = response.data;
					this.filteredReservations = response.data;
				})
				
				axios
				.get('rest/apartments/')
				.then((response) => {
					this.apartments = response.data;
				});
		}else{
			this.mode = 'GUEST';
			
			axios
			.get('rest/reservations/guest/'+this.$cookies.get('user').username)
			.then((response) => {
				this.reservations = response.data;
				this.filteredReservations = response.data;
			})
			
			axios
			.get('rest/apartments/')
			.then((response) => {
				this.apartments = response.data;
			});
		}
		
		console.log("zavrsio");
		
	},
	
	methods: {
		show_reservation(reservation){
			console.log(reservation);
			this.$root.$emit('show-reservation', reservation);
		},
		
		sortByValue(propname){
			if(this.sort[propname] == 'desc'){
				this.sort[propname] = 'asc'
				this.filteredReservations = this.filteredReservations.sort((a,b)=> a[propname] > b[propname] ? 1: -1);
			}else{
				this.sort[propname] = 'desc'
				this.filteredReservations = this.filteredReservations.sort((a,b)=> a[propname] < b[propname] ? 1: -1);					
			}
		},
		searchClick(){
			if(this.filter.name === '' && this.filter.type === '' && this.filter.apStatus === '' && this.filter.username==='' && this.filter.date === '' && this.filter.resStatus==='' ) 
				this.filteredReservations = this.reservations;
			else{
				this.filteredReservations = this.reservations.filter((item) => {
					return 	item.apartment.name.toLowerCase().includes(this.filter.name.toLowerCase()) &&
							item.apartment.type.startsWith(this.filter.type) &&
							item.apartment.status.startsWith(this.filter.apStatus) &&
							item.status.startsWith(this.filter.resStatus) &&
							item.guestUsername.toLowerCase().includes(this.filter.username.toLowerCase());
				});
			}
		}
	}
});

Vue.component('reservation-modal',{
	template:
		`
			<div id="reservation-modal" class="modal reservation-modal" ref="showReservationModal">
				<form>
					<h1 class="naslov">{{apartment.name}}</h1>
					<div class="row">
						<label>username: {{oneReservation.guestUsername}}</label>
					</div>
					<div>
						<label>Gost: {{user.name}} {{user.surname}}</label>
					</div>
					<div class="row">
					<label>Pocetni datum: {{oneReservation.checkInDate | dateFormat('DD/MM/YYYY')}}</label>
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
							<template v-if="role==='GUEST' && (status==='CREATED' || status==='ACCEPTED')">
								<button type="button" @click="cancel_reservation()">Odustani</button>
							</template>
							<template v-if="role==='HOST'">
								<button type="button" @click="accept_reservation()" v-if="status==='CREATED'">Prihvati</button>
								<button type="button" v-if="expired === true && status === 'ACCEPTED'" @click="complete_reservation()" >Zavrsi</button>
								<button type="button" @click="decline_reservation()" v-if="status==='CREATED' || status ==='ACCEPTED'">Odbij</button>
							</template>
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
				status: '',
				role: '',
				expired: false,
			}
		},
		
		filters:{
			dateFormat: function(value,format){
				var parsed = moment(value);
				return parsed.format(format);
			}
		},
		
		mounted: function(){
			this.$root.$on('show-reservation',(reservation) => {
				this.oneReservation = reservation;
				this.status = reservation.status;
				let reservationEndDate = new Date(reservation.checkInDate);
					reservationEndDate.setDate(reservationEndDate.getDate() + reservation.nightCount);
				
				this.expired = reservationEndDate<Date.now(); 
				
				axios.get('rest/apartments/'+this.oneReservation.apartmentId)
					.then((response)=>{
					this.apartment = response.data;});
				axios.get('rest/users/'+this.oneReservation.guestUsername)
					.then((response)=>{
					this.user = response.data;
					
					});
					this.role = this.$cookies.get('user').role;
					this.$refs.showReservationModal.classList.add("modal-show");
					this.$refs.showReservationModal.style.display = "block";			
			});
		},
		methods: {
			close_modal_dialog(){
				this.$refs.showReservationModal.style.display = "none";
				this.$refs.showReservationModal.classList.remove("modal-show");
			},
			accept_reservation(){
				console.log(this.oneReservation.id);
				axios.put('rest/reservations/'+this.oneReservation.id+"/ACCEPTED")
					.then((response) => {
						alert(response.data.status);
					});
			},
			decline_reservation(){
				axios.put('rest/reservations/'+this.oneReservation.id+"/DENIED")
				.then((response) => {
					console.log(response.data);
				});
			},
			
			complete_reservation(){
				axios.put('rest/reservations/'+this.oneReservation.id+"/COMPLETED")
				.then((response) => {
					console.log(response.data);
				});
			},
			
			cancel_reservation(){
				axios.put('rest/reservations/'+this.oneReservation.id+"/CANCELED")
				.then((response) => {
					console.log(response.data);
				});
			}
			
		}
		
		
	
});

