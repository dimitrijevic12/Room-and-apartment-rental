Vue.component('add-apartment-modal',{
	template: `
		<div class="modal" ref="addApartmentModal">
			<div class="signUpModal-content">
				<span @click="closeAddApartmentModal" class="close">&times;</span><br/><br/>
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
				<div class="label-input-signup">
					<div class='label-error'>
						<label>Images:</label>
					</div>
					<input type="file" ref="browseImages" multiple/><br/>
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
				<div class="signup-button-containter">
					<button>Create</button>
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
			amenities: null
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
			console.log(this.checkInTime);
			console.log(this.checkOutTime);
		}
	}
})