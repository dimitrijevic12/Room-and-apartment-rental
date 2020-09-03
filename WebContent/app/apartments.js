Vue.component('apartments',{
	template: `
		<div class="wrapper">
		<div class="search-form">
			<form class="f">
				<h1 class="search">Search</h1>
				<label for="fname">Location:</label><br>
				<ul class="form-ul">
					<li><input type="text" id="searchLocation" name="searchLocation" placeholder="Where would you like to go..."><br></li>
				</ul>
				
				<label for="lname">Date:</label><br>
				<input type="date" placeholder="Check in date" id="checkInDate" name="checkInDate">
				<input type="date" id="checkOutDate" name="checkOutDate" placeholder="Check out date"><br>
				<label>Price:</label><br>
				<input type="number" name="minPrice" placeholder="min price">
				<input type="number" name="maxPrice" placeholder="max price"><br>
				<label>Guests number: </label><br>
				<input type="number" name="guestNum" value="number of guests"><br><br>
				<input type="submit" value="Search">
			</form>
		</div>

		<div class="apartments-label">
			<ul class="ap-ul">
				<li v-for="a in apartments" class="apartment">
					<div class="image-holder">
						<!--<img src="images/ap1.jpg" class="">-->
					</div>
					<h3 class="hotel-name">{{a.name}}</h3>
					<div class="rating-box">
						<template v-for="n in 5" >
							<input type="radio" >
							<label v-if="a.stars > n"  class="star" >&#127775</label>
							<label v-else class="star" >&#9733</label>
						</template>
					</div>
					<label class="activity">status: {{a.status}}</label>
					<div class="host-data">
						<h4 class="host-username">username: {{a.hostUsername}}</h4>
					</div>
					<h4 class="sobe">room count:{{a.roomCount}}</h4>
					<h4 class="gosti">guest count: {{a.guestCount}}</h4>
					<button type="button" class="amenities">Sadrzaj</button> 
					<h3 class="price">200e</h3>
					<button type="button" class="reserve">rezervisi</button>
				</li>
				
			</ul>
		</div>
	</div>
	`,
		
	data: function() {
		return{
			apartments: null
		}
	},
	
	mounted : function(){
		axios
			.get('rest/apartments/')
			.then((response) => {
				this.apartments = response.data;
			})
	},

})