Vue.component('add-apartment-modal',{
	template: `
		<div class="modal" ref="addApartmentModal">
			<div class="add-apartment-content">
				<div class="close-container">
					<span @click="closeAddApartmentModal" class="close">&times;</span><br/><br/>
				</div>
				<div class="apartment-form-container">
					<div class="add-apartment-column">
					<div class="label-input-signup first">
						<div class='label-error'>
							<label>Name:</label>
						</div>
						<input type="text"/><br/>
					</div>
					<div class="label-input-signup">
						<div class='label-error'>
							<label>Location:</label>
						</div>
						<input type="text"/><br/>
					</div>
					<div class="label-input-signup">
						<div class='label-error'>
							<label>Type:</label>
						</div>
						<select>
							<option value="ROOM">Room</option>
							<option value="APARTMENT">Apartment</option>
						</select><br/>
					</div>
					<div class="label-input-signup">
						<div class='label-error'>
							<label>Room count:</label>
						</div>
						<input type="number"/>
					</div>
					<div class="label-input-signup last">
						<div class='label-error'>
							<label>Guest count:</label>
						</div>
						<input type="number"/>
					</div>
				</div>
				<div class="add-apartment-column" :key="listKey">
					<div class="label-input-signup bigger">
					<div class='label-error'>
						<label>Images:</label>
					</div>
					<input type="file" chips ref="browseImages" accept=".jpg,.png" @change="imageAdded($event)" multiple/><br/>
					<div v-for="file in files"><label>{{file.name}}</label></div>
				</div>
				<div class="label-input-signup date-time-picker-contain">
					<div class='label-error'>
						<label>Check in - Check out time:</label>
					</div>
					<vue-ctk-date-time-picker class="timepicker" v-model="checkInTime" :label="'Check in'" :format="'HH:mm'" :formatted="'HH:mm'" :inputSize="'sm'" :onlyTime="true"></vue-ctk-date-time-picker>
					<vue-ctk-date-time-picker class="timepicker" v-model="checkOutTime" :label="'Check out'" :format="'HH:mm'" :formatted="'HH:mm'" :inputSize="'sm'" :onlyTime="true"></vue-ctk-date-time-picker>
				</div>
				<div class="label-input-signup date-time-picker-container bigger">
					<div class='label-error'>
						<label>Approve 
s</label>
					</div>
					<vue-ctk-date-time-picker v-model="approvedDate" :label="'Choose dates'" :format="'DD/MM/YYYY'" :formatted="'DD/MM/YYYY'" :range="true" v-bind:disabledDates="['2020-09-11','2020-09-12','2020-09-13']" @validate="addApprovedDate"></vue-ctk-date-time-picker><br>
					<ul>
						<li v-for="date in apartment.approvedDates">{{date.dateStart | dateFormat('DD/MM/YYYY')}} - {{date.dateEnd | dateFormat('DD/MM/YYYY')}}</li>
					</ul>
					
				</div>
				<div class="label-input-signup bigger last">
					<div class='label-error'>
						<label>Amenities:</label><br>
					</div>
						<div class="amenities-containter">
							<table class="amenity-table">
								<tr><th><div>All</div></th></tr>
								<tr v-for="amenity in amenities" @click="selectedAmenity = amenity">{{amenity.name}}</tr>
							</table>
							<div class="amenity-button-container">
								<button class="arrow-button" @click="addAmenity">&#8250;</button>
								<button class="arrow-button" @click="removeAmenity">&#8249;</button>
							</div>
							<table class="amenity-table">
								<tr><th><div>In apartment</div></th></tr>
								<tr v-for="amenity in addedAmenities" @click="selectedAmenity = amenity">{{amenity.name}}</tr>
							</table>
						</div
					</div>
				</div>
				</div>
				<br>
			</div>
			<div class="create-button-container">
					<button @click="test">Create</button>
					<button @click="test2">test2</button>
			</div>
			</div>
		</div>
	`,
	data: function(){
		return{
			apartment : {
					type:"ROOM",
					name:"Test sa slikom",
					roomCount:10,
					guestCount:4,
					location:{
						latitude:212.0,
						longitude:214.0,
						address:{
							street:"Topolska 18",
							city:"New Now",
							postalCode:21000
						}
					},
					approvedDates:[],
					availableDates:[],
					hostUsername:"marija",
					images: [],
					price:222.0,
					checkInTime:2323223232,
					checkOutTime:2323223232,
					status:"ACTIVE",
					amenitiesIds:[],
					id:4,
			},
			checkInTime: null,
			checkOutTime: null,
			approvedDate: {
				start: '09/09/2020',
				end: '10/09/2020'
			},
			amenities: null,
			files: null,
			image: null,
			listKey: 0,
			selectedAmenity : null,
			addedAmenities : [],
		}
	},
	mounted(){
		this.$root.$on('open-add-apartment-modal', () => {this.$refs.addApartmentModal.style.display = "block";});
		axios	
			.get('rest/amenities')
			.then((response) =>{this.amenities = response.data})
	},
	methods: {
		closeAddApartmentModal(){
			this.$refs.addApartmentModal.style.display="none";
		},
		test(){
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
										.then((response) => {console.log(response.data)})
									} })
		},
		
		test2(){
			console.log(this.apartment);
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
												.then((response) => {console.log(response.data)})
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
			var l = moment(this.approvedDate.start, 'DD/MM/YYYY');
			var r = moment(this.approvedDate.end, 'DD/MM/YYYY');
			this.apartment.approvedDates.push({l, r});
			console.log(this.apartment.approvedDates)
		},
		
		addAmenity(){
			this.addedAmenities.push(this.selectedAmenity);
			this.apartment.amenitiesIds.push(this.selectedAmenity.id)
			for(i = 0; i < this.amenities.length; ++i){
				if(this.amenities[i].id === this.selectedAmenity.id){
					this.amenities.splice(i,1);
				}
			}
		},
		
		removeAmenity(){
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