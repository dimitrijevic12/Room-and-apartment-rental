Vue.component("homepage",{
	template: `
<div class="container">
	<div class="home-search">
		<div class="search-bar-home">
			<div class="label-input home-div">
					<label class="home-label-location">Location:</label>
					<input class="home-input-location" v-model="location" type="text" @keypress="geocode" ref="autocompleteInput" v-click-outside="closeAutocomplete"/>
				<ul class="autocomplete-results-home" ref="autocompleteResults">
			      	<li @click="setLocation(result)" v-for="result in results" class="autocomplete-result">{{result.properties.city}}</li>
			    </ul>
			</div>
			<div class="label-input">
				<vue-ctk-date-time-picker class="search-field" :no-shortcuts="true" v-model="searchQuery.date" :label="'Choose dates'" :format="'DD/MM/YYYY'" :formatted="'DD/MM/YYYY'" :range="true" ></vue-ctk-date-time-picker>
			</div>
			<div class="label-input">
				<label>Guests:</label>
				<input v-model="searchQuery.guests" type="number"/>
			</div>
			<button @click="searchApartments" class="filter-btn">
				<img src="images/output-onlinepngtools (6).png" width="45" height="45">
			</button>
		</div>
	</div>
</div>
	`,
	data(){
		return{
			searchQuery:{
				city : '',
				date: {
					start: '',
					end: '',
				},
				guests : 0,
			},
			results : [],
			location : '',
		}
	},
	mounted : function(){
		console.log('Homepage mounted');
	},
	methods:{
		searchApartments(){
//			this.searchQuery.city = 'Stara Pazova';
			console.log(this.searchQuery)
			this.$router.push({ name: 'apartments', params: { searchQuery: this.searchQuery } })
		},
		
		geocode(){
			axios.defaults.withCredentials = false;
			axios
//				.get("https://app.geocodeapi.io/api/v1/autocomplete?apikey=b9897470-f4a6-11ea-aca1-459b89b18dba&text=" + this.location + "&size=5")
//				.get("https://app.geocodeapi.io/api/v1/autocomplete?apikey=b9897470-f4a6-11ea-aca1-459b89b18dba&text=666%20Fifth%20Ave&size=5")
				.get("https://api.geoapify.com/v1/geocode/autocomplete?text=" + this.location + "&limit=5&apiKey=7a05874016ad4a03b94ee8be997eb3e5&type=city")
				.then((response) => {console.log(response.data);
									 this.results = response.data.features;
									 this.$refs.autocompleteResults.style.display="block";
									 console.log(this.results)})
		},
		
		setLocation(result){
			this.searchQuery.city = result.properties.city;
			
			this.$refs.autocompleteInput.value = result.properties.city;
			this.$refs.autocompleteResults.style.display = "none"
		},
		
		closeAutocomplete(){
			this.$refs.autocompleteResults.style.display = "none";
		},
	}
})