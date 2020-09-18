Vue.component('one-apartment',{
	template: `
		<div class="page-background" :key="apKey">
			<div class="page">
				<div class="name-header">
					<div class="apartment-name-container">
						<label class="apartment-name">{{apartment.name}}</label>
					</div>
					<div class="edit-apartment-button-container">
						<button v-if="mode !== 'GUEST'" @click="openEditApartment" class="edit-apartment-button">Edit</button>
					</div>
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
						<button v-if="isGuest" class="reserve-button" @click="openReserveDialog(apartment)">Reserve</button>
					</div>
					<div class="description">
						<div class="label-pair">
							<label class="tag">Description:</label>
							<div class="list-container">
								<dl class="description-list">
									<li>Type: <b>{{apartment.type}}</b></li>
									<li>Room count: <b>{{apartment.roomCount}}</b></li>
									<li>Guests: <b>{{apartment.guestCount}}</b></li>
									<li>Check in - Check out (TIME): <b>{{apartment.checkInTime | dateFormat('HH:mm')}} - {{apartment.checkOutTime | dateFormat('HH:mm')}}</b></li>
									<li>Price: <b>{{apartment.price}}</b></li>
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
						<div id="map" class="map">
						</div>
					<div>
					<div class="comments-container">
						<div class="grid-container comments">
							<div v-for="comment in comments" class="comment" :key="comment.id">
								<button class="hide-button" v-if="comment.show === true && mode === 'HOST'" @click="toggleComment(comment)">Hide</button>
								<button class="show-button" v-if="comment.show === false && mode === 'HOST'" @click="toggleComment(comment)">Show</button>
								<label class="guest-username">{{comment.guestUsername}} <span class="comment-grade" v-html="loadComment(comment.grade)"></span></label><br>
								<label class="comment-text">{{comment.text}}</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<add-apartment-modal @refresh-apartments="refreshApartments" ></add-apartment-modal>
			<reservate-apartment-modal></reservate-apartment-modal>
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
			apKey : 0,
		}
	},
	mounted(){
		if(!this.$cookies.get('user') || this.$cookies.get('user').role === 'GUEST'){
			this.mode = 'GUEST';
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
									 .get('rest/apartments/shown/' + this.$route.params.id)
									 .then((response) => this.comments = response.data);
								 						console.log(this.apartment);
								 						this.images = this.apartment.images;
								 						console.log(this.images[0]);})
		}else{
			this.mode = this.$cookies.get('user').role;
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
		}	
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
	methods:{
		openEditApartment(){
			this.$root.$emit('open-edit-apartment-modal');
		},
		
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
   		},
   		
   		toggleComment(comment){
			axios
				.put('rest/comments/toggleComment', comment)
				.then(() => {axios
								.get('rest/apartments/comments/' + this.$route.params.id)
								.then((response) => {this.comments = response.data})})
   		},
   		
   		refreshApartments(){
   			if(!this.$cookies.get('user') || this.$cookies.get('user').role === 'GUEST'){
   				this.mode = 'GUEST';
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
   										 .get('rest/apartments/shown/' + this.$route.params.id)
   										 .then((response) => this.comments = response.data);
   									 						console.log(this.apartment);
   									 						this.images = this.apartment.images;
   									 						console.log(this.images);})
   			}else{
   				this.mode = this.$cookies.get('user').role;
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
   									 						console.log(this.images);})
   			}								 
   		},
   		
   		openReserveDialog(apartment){
			this.$root.$emit('reserve-dialog',apartment);
		},
	},
	filters: {
    	dateFormat: function (value, format) {
    		var parsed = moment(value);
    		return parsed.format(format);
    	}
   	},
   	computed:{
   		isGuest(){
   			return (this.$cookies.get('user') && this.$cookies.get('user').role === 'GUEST')
   		}
   	}
})