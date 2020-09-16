Vue.component('delete-apartment-modal',{
	template:`
		<div class="modal" ref="deleteApartmentModal">
			<div class="delete-apartment-content">
				<label>Are you sure you want to delete "<b>{{apartment.name}}</b>"?</label><br><br>
				<div>
					<button class="show-button" @click="deleteApartment">YES</button>
					<button class="hide-button" @click="quit">NO</button>
				</div>
			</div>
		</div>
	`,
	data(){
		return{
			apartment : {},
		}
	},
	mounted(){
		this.$root.$on('open-delete-modal', (value) => {this.apartment = value;
														this.$refs.deleteApartmentModal.style.display = "block"})
	},
	methods:{
		deleteApartment(){
//			console.log(this.apartment)
			axios
				.delete('rest/apartments/deleteApartment/' + this.apartment.id)
				.then((response) => {this.$refs.deleteApartmentModal.style.display = "none";
									 this.$emit('refresh-apartments')})
		},
		
		quit(){
			this.$refs.deleteApartmentModal.style.display = "none"
		}
	}
})