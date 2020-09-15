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
					<div v-if="mode==='CREATE'" class="label-input-signup" ref="locationError">
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
					<div v-if="mode==='CREATE'" v-for="file in files"><img class="image-preview" v-bind:src="readImage(file)"></img></div>
					<div v-if="mode==='EDIT'" v-for="file in files"><img v-if="typeof(file.name) === 'undefined'"  class="image-preview" v-bind:src="file"><img class="image-preview" v-else v-bind:src="readImage(file)"></img><span @click="removeImage(file)" class="close">&times;</span></div>
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
				<button v-if="mode === 'CREATE'" class="create-button" @click="addApartment">Create</button>
				<button v-if="mode === 'EDIT'" class="create-button" @click="editApartment">Edit</button>
			</div>
			</div>
		</div>
	`,
	data: function(){
		return{
			mode: '',
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
					status:"INACTIVE",
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
			filesOnLoad: [],
			imagesToUpload: [],
		}
	},
	mounted(){
		this.$root.$on('open-add-apartment-modal', () => {this.$refs.addApartmentModal.style.display = "block";
															axios	
																.get('rest/amenities')
																.then((response) =>{this.amenities = response.data;
																				this.mode = "CREATE"})});
		
			
			
		this.$root.$on('open-edit-apartment-modal', () => {this.$refs.addApartmentModal.style.display = "block";
															axios	
															.get('rest/amenities')
															.then((response) =>{this.amenities = response.data;
																				this.mode = "EDIT";
																				axios
																					.get('rest/apartments/' + this.$route.params.id)
																					.then((response) => {this.apartment = response.data;
																										 var checkInTimeMoment = moment(this.apartment.checkInTime)
																										 var checkOutTimeMoment = moment(this.apartment.checkOutTime);
																										 console.log(checkInTimeMoment)
																										 console.log(checkOutTimeMoment)
																										 this.checkInTime = checkInTimeMoment.format('HH:mm');
																										 this.checkOutTime = checkOutTimeMoment.format('HH:mm');
																										 this.approvedDates = this.apartment.approvedDates;
																										 this.addDisabledDates();
																										 this.files = this.apartment.images.slice();
																										 this.filesOnLoad = this.apartment.images.slice();
																										 console.log(this.files);
																										 axios
																											 .get('rest/amenities/byApartment/' + this.apartment.id)
																											 .then((response) => {this.addedAmenities = response.data;
																											 					  this.removeAmenities()});})
															})});
		
			
			
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
			
			if(this.mode === 'CREATE'){
				this.$refs.locationError.classList.remove('error-border')
				this.locationError = false;
			}
			
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
		
		editApartment(){
			var imagesToDelete = []
			for(i = 0; i < this.apartment.images.length; ++i){
				if(this.files.includes(this.apartment.images[i]) === false){
					imagesToDelete.push(this.apartment.images[i]);
				}
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
			
			for(i = 0; i < this.files.length; ++i){
				if(this.apartment.images.includes(this.files[i]) === false){
					this.imagesToUpload.push(this.files[i]);
				}
			}
			
			for(i = 0; i < imagesToDelete.length; ++i){
				for(j = 0; j < this.apartment.images.length; ++j){
					if(imagesToDelete[i] === this.apartment.images[j]){
						this.apartment.images.splice(j, 1)
					}
				}
			}
			
			console.log(this.imagesToUpload)
			console.log(imagesToDelete)
			console.log(this.apartment.images)
			axios
				.delete('rest/apartments/deleteImages',{ data:  imagesToDelete })
				.then((response) => {
										if(this.imagesToUpload.length > 0){
											fd = new FormData();
											fd.append('image', this.imagesToUpload[0])
											axios
												.post('rest/apartments/images', fd)
												.then((response) => {this.apartment.images.push(response.data); 
																	if(this.imagesToUpload.length > 1){
																		this.uploadImageEdit(1);
																	}else{
																		axios
																		.put('rest/apartments/editApartment', this.apartment)
																		.then((response) => {console.log(response.data)
																		this.$refs.addApartmentModal.style.display="none";
																		this.$emit('refresh-apartments')})
																	} })
									}else{
										axios
										.put('rest/apartments/editApartment', this.apartment)
										.then((response) => {console.log(response.data)
										this.$refs.addApartmentModal.style.display="none";
										this.$emit('refresh-apartments')})
									}
														})
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
			
			if(this.apartment.approvedDates.length === 0){
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
		
		uploadImageEdit(index){
			fd = new FormData();
			fd.append('image', this.imagesToUpload[index])
			axios
				.post('rest/apartments/images', fd)
				.then((response) => {this.apartment.images.push(response.data); 
									 if(++index < this.imagesToUpload.length){ 
										 this.uploadImageEdit(index);
									 }else{
										 console.log(this.apartment);
										 axios
											.put('rest/apartments/editApartment', this.apartment)
											.then((response) => {console.log(response.data);
											this.$refs.addApartmentModal.style.display="none";
											this.$emit('refresh-apartments')})
									 }
									 })
		},
		
		imageAdded(event){
			if(this.mode === 'CREATE'){
				this.files = event.target.files;
				this.listKey += 1;
			}else{
				for(i = 0; i < event.target.files.length; ++i){
					this.files.push(event.target.files[i]);
				}
				this.listKey += 1;
			}
			console.log(this.files);
		},
		
		readImage(file){
			console.log(file)
//			var file = e.target.files[0]
			return URL.createObjectURL(file);
		},
		
		removeImage(file){
			for(i = 0; i < this.files.length; ++i){
				if(file === this.files[i]){
					this.files.splice(i, 1);
				}
			}
			console.log(this.files);
		},
		
		addDisabledDates(){
			console.log(this.approvedDates[0]);
			for(i = 0; i < this.approvedDates.length; ++i){
				var date = this.approvedDates[i];
				console.log(date);
				var startDate = moment(date.l)
				var endDate = moment(date.r)
				
				while(startDate <= endDate){
					var dateToRemove = startDate.format("YYYY-MM-DD");
					console.log(dateToRemove)
					this.disabledDates.push(dateToRemove)
					startDate = startDate.add(1,'d')
				}
			}
		},
		
		refreshDates(){
			if(this.approvedDates.length === 0){
				this.apartment.availableDates = [];
				this.disabledDates = [];
				return;
			}
			for(i = 0; i < this.approvedDates.length; ++i){
				var startDate = moment(this.approvedDates[i].l, 'DD/MM/YYYY')
				var endDate = moment(this.approvedDates[i].r, 'DD/MM/YYYY')
				console.log(this.approvedDates)
				
				var availableDates = []
				while(startDate <= endDate){
					var dateToAdd = startDate.clone();
					var dateToRemove = startDate.format("YYYY-MM-DD");
					console.log(dateToRemove)
					availableDates.push(dateToAdd);
//					this.apartment.availableDates.push(dateToAdd)
					this.disabledDates.push(dateToRemove)
					startDate = startDate.add(1,'d')
				}
				
				console.log(this.apartment.availableDates);
				var availableDatesSet = new Set(availableDates);
				this.apartment.availableDates = Array.from(availableDatesSet);
				console.log('Available dates u apartmanu array' + this.apartment.availableDates);
			}
		},
		
		addApprovedDate(){
			var startDate = moment(this.approvedDate.start, 'DD/MM/YYYY')
			var endDate = moment(this.approvedDate.end, 'DD/MM/YYYY')
			
			var datesToAdd = this.apartment.availableDates.slice();
			while(startDate <= endDate){
				var dateToAdd = startDate.clone();
				var dateToRemove = startDate.format("YYYY-MM-DD");
				datesToAdd.push(dateToAdd);
//				this.apartment.availableDates.push(dateToAdd)
				this.disabledDates.push(dateToRemove)
				startDate = startDate.add(1,'d')
			}
			
			var datesToAddString = [];
			for(i = 0; i < datesToAdd.length; ++i){
				var dateString = moment(datesToAdd[i]).format('DD/MM/YYYY');
				datesToAddString.push(dateString);
			}
			console.log(datesToAddString)
			datesToAddString = Array.from(new Set(datesToAddString));
			console.log(datesToAddString)
			
			this.apartment.availableDates = []
			for(i = 0; i < datesToAddString.length; ++i){
				var date = moment(datesToAddString[i], 'DD/MM/YYYY');
				this.apartment.availableDates.push(date);
			}
			
//			console.log(this.apartment.availableDates);
//			var availableDatesSet = new Set(this.apartment.availableDates);
//			this.apartment.availableDates = Array.from(availableDatesSet);
			console.log('Available dates u apartmanu array' + this.apartment.availableDates);
			
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
			this.approvedDates = this.apartment.approvedDates.slice();
			console.log(this.apartment.approvedDates)
			
			var startDate = moment(date.l, 'DD/MM/YYYY')
			var endDate = moment(date.r, 'DD/MM/YYYY')
			
			while(startDate <= endDate){
				for(j = 0; j < this.disabledDates.length; ++j){
					var disToRemove = moment(this.disabledDates[j], "YYYY-MM-DD")
					if(disToRemove.isSame(startDate)){
						this.disabledDates.splice(j,1);
						this.apartment.availableDates.splice(j,1);
					}
				}
				startDate = startDate.add(1,'d')
			}
			console.log(this.apartment.availableDates)
			this.refreshDates()
			
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
		},
		
		removeAmenities(){
			for(i = 0; i < this.addedAmenities.length; ++i){
				for(j = 0; j < this.amenities.length; ++j){
					console.log(this.addedAmenities[i])
					console.log(this.amenities[j])
					if(this.addedAmenities[i].id === this.amenities[j].id){
						this.amenities.splice(j,1);
						break;
					}
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