Vue.component('add-apartment-modal',{
	template: `
		<div class="modal" ref="addApartmentModal">
			<div class="add-apartment-content">
				<div class="close-container">
					<span @click="closeAddApartmentModal" class="close">&times;</span><br/><br/>
				</div>
				<div class="apartment-form-container">
					<div class="add-apartment-column">
					<div class="label-input-signup first" ref="nameError">
						<div class='label-error'>
							<label>Name:</label>
							<label v-if="nameError == true" class="error-message">You cant leave this field empty!</label>
						</div>
						<input type="text" v-model="apartment.name"/><br/>
					</div>
					<div class="label-input-signup" ref="locationError">
						<div class='label-error'>
							<label>Location:</label>
							<label v-if="locationError == true" class="error-message">You cant leave this field empty!</label>
						</div>
						<input v-model="location" type="text" @keypress="geocode" ref="autocompleteInput" v-click-outside="closeAutocomplete"/>
						<ul class="autocomplete-results" ref="autocompleteResults">
					      	<li @click="setLocation(result)" v-for="result in results" class="autocomplete-result">{{result.properties.formatted}}</li>
					    </ul>
					</div>
					<div class="label-input-signup">
						<div class='label-error'>
							<label>Type:</label>
						</div>
						<div class="apartment-type-radio-container">
							<input class="typeRadio" type="radio" id="typeRoom" value="ROOM" v-model="apartment.type">
							<label class="typeLabel" for="typeRoom">Room</label>
							<input class="typeRadio" type="radio" id="typeApartment" value="APARTMENT" v-model="apartment.type">
							<label class="typeLabel" for="typeApartment">Apartment</label>
						</div>
					</div>
					<div class="label-input-signup">
						<div class='label-error'>
							<label>Room count:</label>
						</div>
						<input type="number" v-model="apartment.roomCount"/>
					</div>
					<div class="label-input-signup">
						<div class='label-error'>
							<label>Guest count:</label>
						</div>
						<input type="number" v-model="apartment.guestCount"/>
					</div>
					<div class="label-input-signup last bigger">
						<div class='label-error'>
							<label>Price per night:</label>
						</div>
						<div class="price-container">
							<input type="number" v-model="apartment.price"/>
							<select>
								<option>$</option>
								<option>€</option>
								<option>£</option>
								<option>RSD</option>
								<option>¥</option>
							</select>
						</div>
					</div>
				</div>
				<div class="add-apartment-column" :key="listKey">
					<div class="label-input-signup bigger" ref="imagesError">
					<div class='label-error'>
						<label>Images:</label>
						<label v-if="imagesError == true" class="error-message">Value must be a number!</label>
					</div>
					<input style="display:none" type="file" chips ref="browseImages" accept=".jpg,.png" @change="imageAdded($event)" multiple/>
					<button class="browse-images-button" @click="$refs.browseImages.click()">Browse images</button>
					<div v-for="file in files"><label class="images-list">{{file.name}}</label></div>
				</div>
				<div class="label-input-signup date-time-picker-container" ref="checkInOutError">
					<div class='label-error'>
						<label>Check in - Check out time:</label>
						<label v-if="checkInOutError == true" class="error-message">You need to pick both! (check in and check out time)</label>
					</div>
					<div>
						<vue-ctk-date-time-picker class="timepicker" v-model="checkInTime" :label="'Check in'" :format="'HH:mm'" :formatted="'HH:mm'" :inputSize="'sm'" :onlyTime="true"></vue-ctk-date-time-picker>
						<vue-ctk-date-time-picker class="timepicker" v-model="checkOutTime" :label="'Check out'" :format="'HH:mm'" :formatted="'HH:mm'" :inputSize="'sm'" :onlyTime="true"></vue-ctk-date-time-picker>
					</div>
				</div>
				<div class="label-input-signup date-time-picker-container bigger" ref="approvedDatesError">
					<div class='label-error'>
						<label>Approved dates</label>
						<label v-if="approvedDatesError == true" class="error-message">You need to approve dates for reservations!</label>
					</div>
					<vue-ctk-date-time-picker :key="disabledDates[0]" v-model="approvedDate" :label="'Choose dates'" :format="'DD/MM/YYYY'" :formatted="'DD/MM/YYYY'" :range="true" v-bind:disabledDates="disabledDates" v-bind:minDate="today" @validate="addApprovedDate"></vue-ctk-date-time-picker><br>
					<ul>
						<li :key="date.l" v-for="date in this.apartment.approvedDates">{{date.l | dateFormat('DD/MM/YYYY')}} - {{date.r | dateFormat('DD/MM/YYYY')}} <span class="close" @click="removeApprovedDate(date)">&times;</span></li>
					</ul>
					
				</div>
				<div class="label-input-signup bigger last">
					<div class='label-error'>
						<label>Amenities:</label><br>
					</div>
						<div class="amenities-containter">
							<table class="amenity-table">
								<tr><th><div>All</div></th></tr>
								<tr v-for="amenity in amenities" @click="selectedAmenity = amenity" :class="amenity.id === selectedAmenity.id ? 'selected-amenity' : ''">{{amenity.name}}</tr>
							</table>
							<div class="amenity-button-container">
								<button class="arrow-button" @click="addAmenity">&#8250;</button>
								<button class="arrow-button" @click="removeAmenity">&#8249;</button>
							</div>
							<table class="amenity-table">
								<tr><th><div>In apartment</div></th></tr>
								<tr v-for="amenity in addedAmenities" @click="selectedAmenity = amenity" :class="amenity.id === selectedAmenity.id ? 'selected-amenity' : ''">{{amenity.name}}</tr>
							</table>
						</div
					</div>
				</div>
				</div>
				<br>
			</div>
			<div class="create-button-container">
				<button class="create-button" @click="addApartment">Create</button>
			</div>
			</div>
		</div>
	`,
	data: function(){
		return{
			apartment : {
					type:"ROOM",
					name:"",
					roomCount:0,
					guestCount:0,
					location:{
						latitude:0.0,
						longitude:0.0,
						address:{
							street:"",
							city:"",
							postalCode:0
						}
					},
					approvedDates:[],
					availableDates:[],
					hostUsername:"",
					images: [],
					price:0.0,
					checkInTime: 0,
					checkOutTime: 0,
					status:"ACTIVE",
					amenitiesIds:[],
					id:0,
			},
			checkInTime: null,
			checkOutTime: null,
			approvedDate: {
				start: '',
				end: ''
			},
			today: '',
			amenities: null,
			files: [],
			image: null,
			listKey: 0,
			selectedAmenity : {},
			addedAmenities : [],
			location : "",
			results: [],
			disabledDates: [],
			approvedDates: [],
			nameError: false,
			locationError: false,
			imagesError: false,
			checkInOutError: false,
			approvedDatesError: false,
			
		}
	},
	mounted(){
		this.$root.$on('open-add-apartment-modal', () => {this.$refs.addApartmentModal.style.display = "block";});
		axios	
			.get('rest/amenities')
			.then((response) =>{this.amenities = response.data})
		
		this.today = new Date().toISOString().slice(0, 10)
		console.log(this.today)
			
			var map = new ol.Map({
			    target: 'map',
			    layers: [
			      new ol.layer.Tile({
			        source: new ol.source.OSM()
			      })
			    ],
			    view: new ol.View({
			      center: ol.proj.fromLonLat([37.41, 8.82]),
			      zoom: 4
			    })
			  });
	},
	methods: {
		closeAddApartmentModal(){
			this.$refs.addApartmentModal.style.display="none";
			
			this.apartment.name = "";
			this.$refs.nameError.classList.remove('error-border')
			this.nameError = false;
			
			this.apartment.location = {
					latitude:0.0,
					longitude:0.0,
					address:{
						street:"",
						city:"",
						postalCode:0
					}
				};
			this.$refs.locationError.classList.remove('error-border')
			this.locationError = false;
			
			this.apartment.roomCount = 0;
			this.apartment.guestCount = 0;
			this.apartment.price = 0;
			
			this.files = []
			this.$refs.imagesError.classList.remove('error-border')
			this.imagesError = false;
			
			this.checkInTime = null
			this.checkOutTime = null
			this.$refs.checkInOutError.classList.remove('error-border')
			this.checkInOutError = false;
			
			this.approvedDate = {
				start: '',
				end: ''
			},
			this.$refs.approvedDatesError.classList.remove('error-border')
			this.approvedDatesError = false;
			
			this.apartment.amenitiesIds = [];
			this.addedAmenities = [];
			axios	
			.get('rest/amenities')
			.then((response) =>{this.amenities = response.data})
		},
		
		geocode(){
			axios.defaults.withCredentials = false;
			axios
//				.get("https://app.geocodeapi.io/api/v1/autocomplete?apikey=b9897470-f4a6-11ea-aca1-459b89b18dba&text=" + this.location + "&size=5")
//				.get("https://app.geocodeapi.io/api/v1/autocomplete?apikey=b9897470-f4a6-11ea-aca1-459b89b18dba&text=666%20Fifth%20Ave&size=5")
				.get("https://api.geoapify.com/v1/geocode/autocomplete?text=" + this.location + "&limit=5&apiKey=7a05874016ad4a03b94ee8be997eb3e5&type=street")
				.then((response) => {console.log(response.data);
									 this.results = response.data.features;
									 this.$refs.autocompleteResults.style.display="block";
									 console.log(this.results)})
		},
		
		setLocation(result){
			this.apartment.location.latitude = result.properties.lat;
			this.apartment.location.longitude = result.properties.lon;
			this.apartment.location.address.street = result.properties.street;
			this.apartment.location.address.city = result.properties.city;
			this.apartment.location.address.postalCode = result.properties.postcode;
			
			this.$refs.autocompleteInput.value = result.properties.formatted;
			this.$refs.autocompleteResults.style.display = "none"
			console.log(this.apartment.location);
		},
		
		addApartment(){
			var validation = true;
			if(this.apartment.name === ''){
				this.$refs.nameError.classList.add('error-border');
				this.nameError = true;
				validation = false;
			}else{
				this.$refs.nameError.classList.remove('error-border')
				this.nameError = false;
			}
			
			if(this.apartment.location.address.postalCode === 0){
				this.$refs.locationError.classList.add('error-border');
				this.locationError = true;
				validation = false;
			}else{
				this.$refs.locationError.classList.remove('error-border')
				this.locationError = false;
			}
			
			if(this.files.length === 0){
				this.$refs.imagesError.classList.add('error-border');
				this.imagesError = true;
				validation = false;
			}else{
				this.$refs.imagesError.classList.remove('error-border')
				this.imagesError = false;
			}
			
			if(this.checkInTime === null || this.checkOutTime === null){
				this.$refs.checkInOutError.classList.add('error-border');
				this.checkInOutError = true;
				validation = false;
			}else{
				this.$refs.checkInOutError.classList.remove('error-border')
				this.checkInOutError = false;
			}
			
			if(this.approvedDate.start === "" || this.approvedDate.end === ""){
				this.$refs.approvedDatesError.classList.add('error-border');
				this.approvedDatesError = true;
				validation = false;
			}else{
				this.$refs.approvedDatesError.classList.remove('error-border')
				this.approvedDatesError = false;
			}
			
			if(validation === false){
				return;
			}
			
			this.apartment.checkInTime = moment(this.checkInTime, 'HH:mm')
			this.apartment.checkOutTime = moment(this.checkOutTime, 'HH:mm')
			
			//Pravljenje niza available dates
			var startDate = moment(this.approvedDate.start, 'DD/MM/YYYY')
			var endDate = moment(this.approvedDate.end, 'DD/MM/YYYY')
			
			while(startDate <= endDate){
				var dateToAdd = startDate.clone();
				this.apartment.availableDates.push(dateToAdd)
				console.log(dateToAdd)
				startDate = startDate.add(1,'d')
			}
			console.log(this.apartment.availableDates)
			
			this.apartment.hostUsername = this.$cookies.get('user').username;
			console.log(this.apartment.hostUsername);
			
			fd = new FormData();
			fd.append('image', this.files[0])
			axios
				.post('rest/apartments/images', fd)
				.then((response) => {this.apartment.images.push(response.data); 
									if(this.files.length > 1){
										this.uploadImage(1);
									}else{
										axios
										.post('rest/apartments', this.apartment)
										.then((response) => {console.log(response.data)
										this.$refs.addApartmentModal.style.display="none";
										this.$emit('refresh-apartments')})
									} })
		},
		
		closeAutocomplete(){
			this.$refs.autocompleteResults.style.display = "none";
		},
		
		uploadImage(index){
			
				fd = new FormData();
				fd.append('image', this.files[index])
				axios
					.post('rest/apartments/images', fd)
					.then((response) => {this.apartment.images.push(response.data); 
										 if(++index < this.files.length){ 
											 this.uploadImage(index);
										 }else{
											 console.log(this.apartment);
											 axios
												.post('rest/apartments', this.apartment)
												.then((response) => {console.log(response.data);
												this.$refs.addApartmentModal.style.display="none";
												this.$emit('refresh-apartments')})
										 }
										 })
		},
		
		imageAdded(event){
			this.files = event.target.files;
			this.listKey += 1;
		},
		
		removeImage(file){
			for(i = 0, j = 0; i < this.files.length; ++i){
				if(file.name !== this.files[i].name){
					this.files[j++] = this.files[i];
				}
			}
		},
		
		addApprovedDate(){
			var startDate = moment(this.approvedDate.start, 'DD/MM/YYYY')
			var endDate = moment(this.approvedDate.end, 'DD/MM/YYYY')
			
			while(startDate <= endDate){
				var dateToRemove = startDate.format("YYYY-MM-DD");
				console.log(dateToRemove)
				this.disabledDates.push(dateToRemove)
				startDate = startDate.add(1,'d')
			}
			
			var apDateStart = this.approvedDate.start;
			var apDateEnd = this.approvedDate.end;
			this.approvedDates.push({apDateStart, apDateEnd});
			console.log(this.approvedDates)
			
			var l = moment(this.approvedDate.start, 'DD/MM/YYYY');
			var r = moment(this.approvedDate.end, 'DD/MM/YYYY');
			this.apartment.approvedDates.push({l, r});
			console.log(this.apartment.approvedDates)
		},
		
		removeApprovedDate(date){
			var l = moment(date.l, 'DD/MM/YYYY');
			var r = moment(date.r, 'DD/MM/YYYY');
			console.log(date)
			
			console.log(this.apartment.approvedDates)
			for(i = 0; i < this.apartment.approvedDates.length; ++i){
				if(l.isSame(this.apartment.approvedDates[i].l)){
					this.apartment.approvedDates.splice(i,1)
				}
			}
			
			console.log(this.approvedDate.start);
			console.log(this.approvedDate.end);
			var startDate = moment(date.l, 'DD/MM/YYYY')
			var endDate = moment(date.r, 'DD/MM/YYYY')
			
			while(startDate <= endDate){
				for(j = 0; j < this.disabledDates.length; ++j){
					var temp = moment(this.disabledDates[j], "YYYY-MM-DD")
					if(temp.isSame(startDate)){
						this.disabledDates.splice(j,1)
					}
				}
				startDate = startDate.add(1,'d')
			}
			console.log(this.apartment.approvedDates)
		},
		
		addAmenity(){
			for(i = 0; i < this.apartment.amenitiesIds.length; ++i){
				if(this.addedAmenities[i].id === this.selectedAmenity.id){
					return;
				}
			}
			this.addedAmenities.push(this.selectedAmenity);
			this.apartment.amenitiesIds.push(this.selectedAmenity.id)
			for(i = 0; i < this.amenities.length; ++i){
				if(this.amenities[i].id === this.selectedAmenity.id){
					this.amenities.splice(i,1);
				}
			}
		},
		
		removeAmenity(){
			for(i = 0; i < this.amenities.length; ++i){
				if(this.amenities[i].id === this.selectedAmenity.id){
					return;
				}
			}
			this.amenities.push(this.selectedAmenity);
			for(i = 0; i < this.addedAmenities.length; ++i){
				if(this.addedAmenities[i].id === this.selectedAmenity.id){
					this.addedAmenities.splice(i,1);
					this.apartment.amenitiesIds.splice(i,1);
				}
			}
		}
	},
	filters: {
    	dateFormat: function (value, format) {
    		var parsed = moment(value);
    		return parsed.format(format);
    	}
	}
})