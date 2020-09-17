

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
					<button @click="reset()">Reset</button>
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
						<button @click="show_comment(res)" :disabled="!(mode==='GUEST' && (res.status==='DENIED' || res.status === 'COMPLETED'))">Comment</button>
					</div>	
				</li>
			</ul>
		</div>
	</div>
	<reservation-modal @refresh-reservations="refreshReservations"></reservation-modal>
	<comment-modal></comment-modal>
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
		
		reset(){
			this.filter={
				type: '',
				apStatus: '',
				name: '',
				date: '',
				username: '',
				resStatus: '',
			}
		},
		show_reservation(reservation){
			console.log(reservation);
			this.$root.$emit('show-reservation', reservation);
		},
		
		show_comment(reservation){
			this.$root.$emit('comment_modal',reservation);
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
		
		getDateFromString(date,token){
			let splitedDate = date.split(token);
			let result = new Date(parseInt(splitedDate[0],10),parseInt(splitedDate[1],10)-1,parseInt(splitedDate[2],10),0,0,0);
			return result;
		},
		
		refreshReservations(){
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
		
		searchClick(){
			if(this.filter.name === '' && this.filter.type === '' && this.filter.apStatus === '' && this.filter.username==='' && this.filter.date === '' && this.filter.resStatus==='' ) 
				this.filteredReservations = this.reservations;
			else{
				this.filteredReservations = this.reservations.filter((item) => {
					let isEqual = false;
					if(!this.filter.date || this.filter.date == '') isEqual = true;
					else{
						let searchDate = this.getDateFromString(this.filter.date,'-');
						let date = new Date(item.checkInDate);
						isEqual = (date.getFullYear() == searchDate.getFullYear() && date.getDate() == searchDate.getDate() && date.getMonth() == searchDate.getMonth());
					}
					
					return 	item.apartment.name.toLowerCase().includes(this.filter.name.toLowerCase()) &&
							item.apartment.type.startsWith(this.filter.type) &&
							item.apartment.status.startsWith(this.filter.apStatus) &&
							item.status.startsWith(this.filter.resStatus) &&
							item.guestUsername.toLowerCase().includes(this.filter.username.toLowerCase())
							&& isEqual;
				});
			}
		}
	}
});

Vue.component('reservation-modal',{
	template:
		`
			<div id="reservation-modal" class="modal" ref="showReservationModal">
				<div class="reservation-modal">
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
						<label>Comment for reservation :</label><br/>
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
					</div>
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
						if(response.data){
						toast("Uspesno promenjen status na "+response.data.status);
						this.$refs.showReservationModal.style.display="none";
						this.$emit('refresh-reservations');
						}else{
							alert("Neuspesna promena stautsa!")
						}
					});
			},
			decline_reservation(){
				axios.put('rest/reservations/'+this.oneReservation.id+"/DENIED")
				.then((response) => {
					if(response.data){
					toast("Uspesno promenjen status na "+response.data.status);
					this.$refs.showReservationModal.style.display="none";
					this.$emit('refresh-reservations');
					}else{
						alert("Neuspesna promena stautsa!")
					}
				});
			},
			
			complete_reservation(){
				axios.put('rest/reservations/'+this.oneReservation.id+"/COMPLETED")
				.then((response) => {
					if(response.data){
						toast("Uspesno promenjen status na "+response.data.status);
						this.$refs.showReservationModal.style.display="none";
						this.$emit('refresh-reservations');
						}else{
							alert("Neuspesna promena stautsa!")
						}
				});
			},
			
			cancel_reservation(){
				axios.put('rest/reservations/'+this.oneReservation.id+"/CANCELED")
				.then((response) => {
					if(response.data){
						toast("Uspesno promenjen status na "+response.data.status);
						this.$refs.showReservationModal.style.display="none";
						this.$emit('refresh-reservations');
						}else{
							alert("Neuspesna promena stautsa!")
						}
				});
			}
			
		}
		
		
	
});

Vue.component('comment-modal',{
	template:
		`
			<div id="reservation-modal" class="modal " ref="showCommentModal">
				<div class="reservation-modal">
					<h1 class="naslov">{{apartment.name}}</h1>
					<div class="row">
						<label>Host username: {{host.username}}</label>
					</div>
					<div>
						<label>Host: {{host.name}} {{host.surname}}</label>
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
						<label>Grade:</label>
						<select v-model="comment.grade">
							<option selected value=""></option>
							<option>1</option>
							<option>2</option>
							<option>3</option>
							<option>4</option>
							<option>5</option>
						</select>
						<label>stars</label>
					</div>
					<div class="row">
						<label>Comment:</label><br/>
						<textarea name="komentar" maxlength="255" v-model="comment.text"></textarea>
					</div>
		
					<div class="row">				
						<div class="buttons">
							<button @click="submitComment()">Submit</button>
							<button @click="close_modal_dialog()">Cancel</button>
						</div>
					</div>
					</div>
			</div>
		`,
	
		data: function(){
			return{
				oneReservation: {},
				host: {},
				apartment: {},
				status: '',
				comment:{
					text: '',
					grade: '',
				}
			}
		},
		
		filters:{
			dateFormat: function(value,format){
				var parsed = moment(value);
				return parsed.format(format);
			}
		},
		
		
		mounted: function(){
			this.$root.$on('comment_modal',(reservation) => {
				this.oneReservation = reservation;
				this.status = reservation.status;
				
				axios.get('rest/apartments/'+this.oneReservation.apartmentId)
					.then((response)=>{
					this.apartment = response.data;
					axios.get('rest/users/'+this.apartment.hostUsername)
					.then((response)=>{
					this.host = response.data;
					
					});
					this.$refs.showCommentModal.classList.add("modal-show");
					this.$refs.showCommentModal.style.display = "block";		
					
					});
					
			});
		},
		
		methods: {
			close_modal_dialog(){
				this.$refs.showCommentModal.style.display = "none";
				this.$refs.showCommentModal.classList.remove("modal-show");
			},
			submitComment(){
				if(this.comment.grade===''){
					alert("Morate uneti ocenu apartmanu!");
					return;
				}
				let com={
					guestUsername: this.oneReservation.guestUsername,
					apartmentId: this.oneReservation.apartmentId,
					text: this.comment.text,
					grade: parseInt(this.comment.grade,10),
				}
				
				axios.post('rest/comments',com).then(response=>{
					if(response.data) {
						toast("Komentar je poslat!");
						console.log(response.data);
					}else{
						alert("Neuspesno slanje komentara!");
					}
				})
			}
		}
	
	
})

