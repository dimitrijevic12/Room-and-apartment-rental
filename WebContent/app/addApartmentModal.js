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
					<div class="label-input-signup">
						<div class='label-error'>
							<label>Guest count:</label>
						</div>
						<input type="number"/>
					</div>
				</div>
				<div class="add-apartment-column">
					<div class="label-input-signup">
					<div class='label-error'>
						<label>Images:</label>
					</div>
					<input type="file" chips ref="browseImages" accept=".jpg,.png" @change="imageAdded($event)" multiple/><br/>
				</div>
				<div class="label-input-signup date-time-picker-container">
					<div class='label-error'>
						<label>Check in - Check out time:</label>
					</div>
					<vue-ctk-date-time-picker class="timepicker" v-model="checkInTime" :label="'Check in'" :format="'HH:mm'" :formatted="'HH:mm'" :inputSize="'sm'" :onlyTime="true"></vue-ctk-date-time-picker>
					<vue-ctk-date-time-picker class="timepicker" v-model="checkOutTime" :label="'Check out'" :format="'HH:mm'" :formatted="'HH:mm'" :inputSize="'sm'" :onlyTime="true"></vue-ctk-date-time-picker>
				</div>
				<div class="label-input-signup date-time-picker-container">
					<div class='label-error'>
						<label>Approve 
s</label>
					</div>
					<vue-ctk-date-time-picker v-model="approvedDates" :label="'Choose dates'" :format="'DD/MM/YYYY'" :formatted="'DD/MM/YYYY'" :range="true" v-bind:disabledDates="['2020-09-11','2020-09-12','2020-09-13']"></vue-ctk-date-time-picker><br>
				</div>
				<div class="label-input-signup last">
					<div class='label-error'>
						<label>Amenities</label>
					</div>
						<select>
							<option v-for="amenity in amenities" value="amenity.id">{{amenity.name}}</option>
						</select><br/>
					</div>
				</div>
				</div>
				<br>
				<div class="create-button-containter">
					<button @click="test">Create</button>
				</div>
			</div>
		</div>
	`,
	data: function(){
		return{
			checkInTime: null,
			checkOutTime: null,
			approvedDates: {
				start: '09/09/2020',
				end: '10/09/2020'
			},
			amenities: null,
			files: null,
			image: null
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

		test(event){
			fd = new FormData();
//			for(i = 0; i < this.images.length; ++i){
//				fd.append('image', this.images[i], this.images[i].name)
//			}
			fd.append('image123', event.target.files[0])
			console.log(event.target.files[0]);
			console.log(fd);
/*			const reader = new FileReader()
			blob = new Blob(this.files);
			reader.readAsDataURL(blob)
			var imageToSend
            reader.onload = e => {
				this.image = e.target.result
				imageToSend = {image:e.target.result}
                console.log(this.image)
			}
			console.log(this.image)
			var apartmentObject = {
				type:"ROOM",
				name:"Test",
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
				images: this.image,
				price:222.0,
				checkInTime:2323223232,
				checkOutTime:2323223232,
				status:"ACTIVE",
				amenitiesIds:[0,1,2,3],
				id:0,
				stars:4
			}
*/			
//			console.log(imageToSend);
			axios
				.post('rest/apartments/images', fd)

		}
,
		imageAdded(event){
			fd = new FormData();
			fd.append('image', event.target.files[0])
			console.log(event.target.files[0]);
			console.log(fd);

			axios
				.post('rest/apartments/images', fd)
		
		}
	}
})