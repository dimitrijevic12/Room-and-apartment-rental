Vue.component('one-apartment',{
	template: `
		<div class="page-background">
			<div class="page">
				<div class="name-header">
					{{apartment.name}}
				</div>
				<div class="page-content">
					<div class="image-slider" :key="index">
						<div class="slider-button-container elft">
							<button class="slider-button" @click="prevImage">&#8249</button>
						</div>
						<img class="image-view" v-bind:src = "images[index]">
						<div class="slider-button-container right">
							<button class="slider-button" @click="nextImage">&#8250</button>
						</div>
					</div>
					<div class="important-info">
						<div class="label-pair">
							<label class="tag">Location:</label>
							<div class="info">
								<label class="street">{{apartment.location.address.street}}</label>
								<label class="city">{{apartment.location.address.city}} {{apartment.location.address.postalCode}}</label>	
								<label class="lat-long">{{apartment.location.latitude}}, {{apartment.location.longitude}}</label>
							</div>									
						</div>
						<div class="label-pair host">
							<label class="host-tag">Host:</label>
							<div class="info">
								<label class="host-username">{{apartment.hostUsername}}</label>
								<label class="city">{{host.name}} {{host.surname}}</label>
							</div>
						</div>
						<button class="reserve-button">Reserve</button>
					</div>
					<div class="description">
						<div class="label-pair">
							<label class="tag">Description:</label>
							<div class="list-container">
								<dl class="description-list">
									<li>Type: <b>{{apartment.type}}</b></li>
									<li>Room count: <b>{{apartment.roomCount}}</b></li>
									<li>Guests: <b>{{apartment.guestCount}}</b></li>
									<li>Check in - Check out (TIME): <b>{{apartment.checkInTime | dateFormat('HH:MM')}} - {{apartment.checkOutTime | dateFormat('HH:MM')}}</b></li>
									<li v-if="mode !== 'GUEST'">Status: <b>{{apartment.status}}</b></li>
								</dl>
							</div>
						</div>
					</div>
					<div class="amenities-container">
						<div class="label-pair">
							<label class="tag">Amenities:</label>
						</div>
						<div class="grid-container">
								<div v-for="amenity in amenities" class="grid-item">{{amenity.name}}</div>
						</div>
					</div>
					<div class="comments-container">
						<div class="grid-container comments">
							<div v-for="comment in comments" class="comment">
								<label class="guest-username">{{comment.guestUsername}} <span class="comment-grade" v-html="loadComment(comment.grade)"></span></label><br>
								<label class="comment-text">{{comment.text}}</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
	data(){
		return{
			apartment: {},
			host: {},
			amenities: null,
			comments: null,
			mode: '',
			images: {},
			index : 0,
		}
	},
	mounted(){
		axios
			.get('rest/apartments/' + this.$route.params.id)
			.then((response) => {this.apartment = response.data;
								 axios
									 .get('rest/users/' + this.apartment.hostUsername)
									 .then((response) => this.host = response.data);
								 axios
									 .get('rest/amenities/byApartment/' + this.$route.params.id)
									 .then((response) => {this.amenities = response.data;});
								 axios
									 .get('rest/apartments/comments/' + this.$route.params.id)
									 .then((response) => this.comments = response.data);
								 						console.log(this.apartment);
								 						this.images = this.apartment.images;
								 						console.log(this.images[0]);})
		
		console.log(this.amenities)							  
		if(!this.$cookies.get('user') || this.$cookies.get('user').role === 'GUEST'){
			this.mode = 'GUEST';
		}else {
			this.mode = this.$cookies.get('user').role;
		}
									 
	},
	methods:{
		prevImage(){
			if((this.index-1) < 0){
				this.index = this.images.length-1;
			}else{
				this.index = this.index-1
			}
			console.log(this.images[this.index])
		},
		
		nextImage(){
			if((this.index+1) > this.images.length-1){
				this.index = 0;
			}else{
				this.index = this.index+1
			}
			console.log(this.images[this.index])
		},
		
		loadComment(grade){
   			if(grade === 'ONE'){
   				return '&#11088;&#9733;&#9733;&#9733;&#9733;'
   			}else if(grade === 'TWO'){
   				return '&#11088;&#11088;&#9733;&#9733;&#9733;'
   			}else if(grade === 'THREE'){
   				return '&#11088;&#11088;&#11088;&#9733;&#9733;'
   			}else if(grade === 'FOUR'){
   				return '&#11088;&#11088;&#11088;&#11088;&#9733;'
   			}else{
   				return '&#11088;&#11088;&#11088;&#11088;&#11088;'
   			}
   		}
	},
	filters: {
    	dateFormat: function (value, format) {
    		var parsed = moment(value);
    		return parsed.format(format);
    	}
   	},
})