Vue.component('vue-ctk-date-time-picker', window['vue-ctk-date-time-picker']);

Vue.component('apartments',{
	template: `
	<div class="apartments">
		<div class="wrapper">
		<div class="search-form">
			<form class="f">
				<h1 class="search">Search</h1>
				<ul class="form-ul">
					<li><input list="cities" id="searchLocation" class="search-field" v-model="filter.city"  placeholder="Where would you like to go..."><br></li>
					<datalist id="cities">
						<template v-for="city in cities"> 
							<option>{{city}}</option>
						</template>
					</datalist>
					<li v-if="role === 'ADMIN' || role === 'HOST'">
						<select v-model="filter.type" class="search-field">
							<option value="">ALL</option>
							<option value="ROOM">ROOMS</option>
							<option value="APARTMENT">APARTMENTS</option>
						</select>
					</li>
					<li v-if="role === 'ADMIN' || role === 'HOST'">
						<select v-model="filter.status"  class="search-field">
							<option value="">ALL</option>
							<option>ACTIVE</option>
							<option>INACTIVE</option>
						</select>
					</li>
					<li><vue-ctk-date-time-picker class="search-field" v-model="filter.date" :label="'Choose dates'" :format="'DD/MM/YYYY'" :formatted="'DD/MM/YYYY'" :range="true" v-bind:disabledDates="['2020-09-11','2020-09-12','2020-09-13']"></vue-ctk-date-time-picker></li>
					<li>
						<input type="number" class="minMaxField" v-model="filter.minPrice" min="0"  placeholder="min price"><span>&nbsp;-</span>
						<input type="number" class="minMaxField"  v-model="filter.maxPrice" min="0"  placeholder="max price">
					</li>
					<li>
						<input type="number" class="minMaxField" v-model="filter.minRoom" min="1" placeholder="min room"><span>&nbsp;-</span>
						<input type="number" class="minMaxField"  v-model="filter.maxRoom" min="1"placeholder="max room">
					</li>
					<li>
						<input type="number" class="minMaxField" v-model="filter.guestNum" min="1" name="guestNum" placeholder="number of guests">
						<button type="button" class="minMaxField" @click="filterAmenities()">Amenities</button>
					</li>
					<li><button type="button" @click="searchClick()">Search</button></li>
				</ul>
			</form>
		</div>
		
		<div class="modal" ref="showAmenitiesForSelectModal">
			<form>
				<div id="amenities-modal">
					<h1>Amenities</h1>
					<div v-if="role === 'ADMIN'">
						<input v-model="newAmenity.name" type="text">
						<button type="button" @click="addAmenity()">Add</button>
					</div>
					<div v-if="role === 'ADMIN'">
						<select v-model="selectedAmenity">
							<option value="" selected>-</option>
						<template v-for="a in amenities" >
							<option :value="a.id">{{a.name}}</option>
						</template>
						</select>
						<input v-model="newAmenityName" type="text">
						<button type="button" @click="editAmenity()">Edit</button>
					</div>
					<div id="amenities-list">
						<div v-for="a in amenities" :key="a.name">
							<input type="checkbox" :value="a.id" name="cb"><label>{{a.name}}</label>
						</div>
		            </div>
					<button type="button" @click="closeSelectAmenitieDialog()">Potvrdi</button>
					<button type="button" v-if="role === 'ADMIN'" @click="deleteSelectedAmenities()">Delete</button>
	            </div>
			</form>
		</div>

		<div class="apartments-label">
			<div class="topMenu">
				<button v-if="role==='HOST'" @click="openAddApartmentModal">Add apartment</button>
				<div>
				<label>Sort: </label>
					<button ref="sortPriceButton" @click="sortByValue('price')">Price {{sort.price}}</button>
					<button ref="sortPriceButton" @click="sortByValue('type')">Type {{sort.type}}</button>
					<button v-if="role === 'ADMIN' || role==='HOST'" ref="sortPriceButton" @click="sortByValue('status')">Status {{sort.status}}</button>
					<button ref="sortPriceButton" @click="sortByValue('name')">Name {{sort.name}}</button>
					<button ref="sortPriceButton" @click="sortByValue('roomCount')">Rooms {{sort.roomCount}}</button>
					<button ref="sortPriceButton" @click="sortByValue('guestCount')">Guests {{sort.guestCount}}</button>
				</div>
			</div>
			<ul class="ap-ul" :key="apKey">
				<li v-for="a in filteredApartments" class="apartment" :key="a.id">
					<div class="image-holder">
						<img v-bind:src="a.images[0]" class="">
					</div>
					<router-link class="hotel-name" :to="{ name: 'one-apartment', params: { id: a.id }}"><h3 class="hotel-name">{{a.name}}</h3></router-link>
					<label class="activity">status: {{a.status}}</label>
					<div class="host-data">
						<h4 class="host-username">username: {{a.hostUsername}}</h4>
					</div>
					<h4 class="sobe">room count:{{a.roomCount}}</h4>
					<h4 class="gosti">guest count: {{a.guestCount}}</h4>
					<button type="button" class="amenities" @click="showAmenities(a)">Sadrzaj</button> 
					<h3 class="price">{{a.price}}e</h3>
					<button type="button" v-if="role==='GUEST' " class="reserve" @click="openReserveDialog(a)">rezervisi</button>
				</li>
			</ul>
		</div>
		</div>
		<add-apartment-modal @refresh-apartments="refreshApartments" ></add-apartment-modal>
		<reservate-apartment-modal></reservate-apartment-modal>
		<show-apartment-amenities></show-apartment-amenities>
	</div>
	`,
		
	data: function() {
		return{
			apartments: [],
			role: 'ANON',
			filteredApartments: [],
			filter: {
				city: '',
				guestNum:'',
				minPrice:'',
				maxPrice:'',
				minRoom: '',
				maxRoom: '',
				date: {
					start: '',
					end: ''
				},
				type: '',
				status: '',
				amenitiesIds: [],
			},
			cities: [],
			amenities: {},
			sort:{
				price: 'desc',
				type: 'desc',
				status: 'desc',
				name: 'desc',
				roomCount: 'desc',
				guestCount: 'desc',
			},

			apKey : 0,
			newAmenity: {
				id: -1,
				name: '',
			},
			selectedAmenity: {},
			newAmenityName: '',
		}
	},
	
	mounted : function(){
		
		let user = this.$cookies.get('user');
		if(user) this.role = user.role;
		
		//Refresh kada se doda apartment
/*		this.$root.$on('refresh-apartments', () => {axios
			.get('rest/apartments/host/'+this.$cookies.get('user').username)
			.then((response) => {
				this.apartments = response.data;
				let allCities = [];
				for(let apartment of this.apartments){
					allCities.push(apartment.location.address.city) ;
				}
				this.cities = allCities.filter((value,index,self)=> self.indexOf(value) === index)
				this.filteredApartments = this.apartments;
				this.apKey += 1;
			})})
*/		
		if(this.role === 'ADMIN'){
			axios
			.get('rest/apartments/')
			.then((response) => {
				this.apartments = response.data;
				let allCities = [];
				for(let apartment of this.apartments){
					allCities.push(apartment.location.address.city) ;
				}
				this.cities = allCities.filter((value,index,self)=> self.indexOf(value) === index)
				this.filteredApartments = this.apartments;
			});
			
		}
		else if(this.role === 'HOST'){
			axios
				.get('rest/apartments/host/'+this.$cookies.get('user').username)
				.then((response) => {
					this.apartments = response.data;
					let allCities = [];
					for(let apartment of this.apartments){
						allCities.push(apartment.location.address.city) ;
					}
					this.cities = allCities.filter((value,index,self)=> self.indexOf(value) === index)
					this.filteredApartments = this.apartments;
				})
		}else{
			axios
				.get('rest/apartments/active')
				.then((response) => {
					this.apartments = response.data;
					let allCities = [];
					for(let apartment of this.apartments){
						allCities.push(apartment.location.address.city) ;
					}
					this.cities = allCities.filter((value,index,self)=> self.indexOf(value) === index)
					this.filteredApartments = this.apartments;
				})
		}
		
		axios.get('rest/amenities/').then((response) =>{
			this.amenities = response.data;

		});
		
	},
	methods: {
		
		openAddApartmentModal: function(){
			this.$root.$emit('open-add-apartment-modal');
		},
		openReserveDialog(apartment){
			this.$root.$emit('reserve-dialog',apartment);
		},
		showAmenities(apartment){
			this.$root.$emit('apartment-amenities-dialog',apartment.amenitiesIds);
		},
		filterAmenities(){
			this.$refs.showAmenitiesForSelectModal.classList.add("modal-show");
			this.$refs.showAmenitiesForSelectModal.style.display = "block";
		},
		
		sortByValue(propname){
			if(this.sort[propname] == 'desc'){
				this.sort[propname] = 'asc'
				this.filteredApartments = this.filteredApartments.sort((a,b)=> a[propname] >= b[propname] ? 1: -1);
			}else{
				this.sort[propname] = 'desc'
				this.filteredApartments = this.filteredApartments.sort((a,b)=> a[propname] <= b[propname] ? 1: -1);					
			}
		},
		
		IsApartmentAvailable(apartment){
			let filterCheckInDay;
			let filterCheckOutDay;
			
			if(!this.filter.date) return true;
 			
			if(this.filter.date.start) {
				filterCheckInDay = new Date(this.filter.date.start);
				filterCheckInDay.setHours(0,0,0,0);
			}
				
			if(this.filter.date.end ) {
				filterCheckOutDay = new Date(this.filter.date.end);
				filterCheckOutDay.setHours(0,0,0,0);
			}
				
			if(!this.filter.date.start && !this.filter.date.end) return true;
			else if(!this.filter.date.start || !this.filter.date.end){
				let availableDate = (this.filter.date.start)? filterCheckInDay : filterCheckOutDay
				for(let day of apartment.availableDates){
					let parsedDay = new Date(day);
					parsedDay.setHours(0,0,0,0);
					if(parsedDay.getTime() === availableDate.getTime()) return true;
				}
				return false;
			}else{
				let isAvailable = false;
				let currentDay = filterCheckInDay;
				for(let day of apartment.availableDates){
					let parsedDay = new Date(day);
					parsedDay.setHours(0,0,0,0);
					if(parsedDay.getTime() > currentDay.getTime()) return false; //u slucaju da nismo naisli na trazeni dan, a naisli smo na veci od njega
					else if(parsedDay.getTime() === currentDay.getTime()) {
						isAvailable = true;
						if( currentDay.getTime() === filterCheckOutDay.getTime()) return isAvailable;
						currentDay.setDate(currentDay.getDate() + 1);
					}
				}
			}

			
		},
		
		getAllSelectedCheckBoxs(){
			let allCheckBoxs = document.getElementsByName('cb');
			let allSelectedIds = [];
			
			for(let checkbox of allCheckBoxs){
				if(checkbox.checked){
					allSelectedIds.push(checkbox.value);
				}
			}
			return allSelectedIds;
		},
		
		deleteSelectedAmenities(){
			for(let amenityId of this.getAllSelectedCheckBoxs()){
				axios.delete('rest/amenities/'+amenityId).
					then((response)=>{
						if(response) {
							let index = this.findIndex(amenityId);
							this.amenities.splice(index,1);
							alert('Uspesno uklonjen '+response.data.name);
						}
						else alert('Neuspesno uklonjen '+response.data.name);
					});
				
				
				
			}
		},
		addAmenity(){
			axios.post('rest/amenities',this.newAmenity)
				.then(response =>{
					this.amenities.push(response.data);
					console.log('Usepsno kreiranje: '+response.data);
				})
		},
		
		editAmenity(){
			let index = this.findIndex(this.selectedAmenity);
			let amenityToEdit = this.amenities[index];
			amenityToEdit.name = this.newAmenityName;
			axios.put('rest/amenities',amenityToEdit)
				.then(response => {
					if(response) {
						alert('Uspesno izmenjen sadrzaj!');
					}else alert('Neuspesno izmenjen sadrzaj!');
				})
		},
		
		findIndex(amenityId){
			for(let i=0;i<this.amenities.length;i++){
				if(amenityId == this.amenities[i].id) return i;
			}
			return -1;
		},
		
		
		closeSelectAmenitieDialog(){
			this.filter.amenitiesIds = this.getAllSelectedCheckBoxs();
			this.$refs.showAmenitiesForSelectModal.classList.remove("modal-show");
			this.$refs.showAmenitiesForSelectModal.style.display = "none";
		},
		
		IsApartmentContainsAmenities(apartment){
			for(let amenityId of this.filter.amenitiesIds){
				let intAmenityId = parseInt(amenityId,10);
				if(!apartment.amenitiesIds.includes(intAmenityId)) return false; 
			}
			return true;
		},
		
		searchClick(){
			if(this.dialogOpened){
				this.$root.$on('selected-amenities',(response)=>{
					this.filter.amenitiesIds = response;
				})
			}
			if(this.filter.city === '' && this.filter.guestNum === '' && this.filter.minPrice === '' && 
					this.filter.maxPrice === '' && this.filter.minRoom === '' && this.filter.maxRoom === '' && 
					(this.filter.date == null || this.filter.date.start === '' )&& (this.filter.date == null || this.filter.date.end === '') && this.filter.type === '' && this.filter.status === '' && this.filter.amenitiesIds.length === 0)
				this.filteredApartments = this.apartments;
			else{
				this.filteredApartments = this.apartments.filter((item) => {		
					
					
					return item.location.address.city.toLowerCase().includes(this.filter.city.toLowerCase()) &&
							(this.filter.guestNum === '' || item.guestCount>= this.filter.guestNum) &&
							(this.filter.minPrice ==='' || item.price>=this.filter.minPrice) &&
							(this.filter.maxPrice ==='' || item.price<=this.filter.maxPrice) &&
							(this.filter.minRoom === '' || item.roomCount>=this.filter.minRoom)&&
							(this.filter.maxRoom === '' || item.roomCount<=this.filter.maxRoom)&&
							(this.filter.type === '' || item.type === this.filter.type)&&
							(this.filter.status === '' || item.status === this.filter.status) && 
							this.IsApartmentAvailable(item) && this.IsApartmentContainsAmenities(item);	
				});
			}
		},
		
		refreshApartments(){
			console.log('Promenjen je kljuc!')
			axios
			.get('rest/apartments/host/'+this.$cookies.get('user').username)
			.then((response) => {
				this.apartments = response.data;
				let allCities = [];
				for(let apartment of this.apartments){
					allCities.push(apartment.location.address.city) ;
				}
				this.cities = allCities.filter((value,index,self)=> self.indexOf(value) === index)
				this.filteredApartments = this.apartments;
				this.apKey += 1;
			})
			this.apKey += 1;
		},
	}

})

Vue.component('show-apartment-amenities',{
	template: 
		`
		<div class="modal" ref="showAmenitiesModal">
			<form>
				<div id="amenities-modal">
					<h1>Amenities</h1>
					<div id="amenities-list">
						<ul>
							<li v-for="a in amenities">{{a.name}}</li>
						</ul>
		            </div>
					<button type="button" @click="closeDialog">Izadji</button>
	            </div>
			</form>
		</div>
		`,
	data: function() {
		return {
			amenities: [],
		}
	},
	
	mounted: function(){
		this.$root.$on('apartment-amenities-dialog',(amenitiesIds)=>{
			axios.get('rest/amenities')
				.then((response)=> {
					let allAmenities = response.data;
					this.amenities = allAmenities.filter((item)=>{
						for(let id of amenitiesIds){
							if(id===item.id) return true;
						}
						return false;
					})
					this.$refs.showAmenitiesModal.classList.add("modal-show");
					this.$refs.showAmenitiesModal.style.display = "block";
				})
		});	
	},
	
	methods: {
		closeDialog(){
			this.$refs.showAmenitiesModal.classList.remove("modal-show");
			this.$refs.showAmenitiesModal.style.display = "none";

		}
	}
})

Vue.component('reservate-apartment-modal',{
	template: 
		`
		<div id="reserve-modal" class="modal reservation-modal"  ref="reservateApartmentModal">
			<form>
				<h1 class="naslov">{{apartment.name}}</h1>
				<div class="row">
				<label>Pocetni datum:</label>
				<input v-model="reservation.checkInDate" type="date" name="" placeholder="">
				</div>
				<div class="row">
				<label>Broj nocenja:</label>
				<input v-model="reservation.nightCount" type="number" min="1" max="99" name="" size="4" placeholder="1">
				</div>
				<div class="row">
					<label>Cena:{{reservation.nightCount*apartment.price}}</label>
					
				</div>
				<div class="row">
					<label>Komentar:</label><br/>
					<textarea v-model="reservation.message" name="komentar" maxlength="255"></textarea>
				</div>
	
				<div class="row">				
					<div class="buttons">
						<button type="submit">Reserve</button>
						<button type="button" @click="closeDialog()">Cancel</button>
					</div>
				</div>
			</form>
	</div>
	`,
	
	data: function(){
		return{
			apartment: {},
			reservation: {},
		}
	},
	
	mounted: function(){
		this.$root.$on('reserve-dialog',(apartment) => {
			this.apartment = apartment;
			this.reservation.apartmentId = apartment.id;
			this.$refs.reservateApartmentModal.classList.add("modal-show");
			this.$refs.reservateApartmentModal.style.display="block";
			this.reservation.nightCount=1;
		});
	},
	
	methods: {
		closeDialog(){
			this.$refs.reservateApartmentModal.style.display = "none";
			this.$refs.reservateApartmentModal.classList.remove("modal-show");
		}
	}
})
