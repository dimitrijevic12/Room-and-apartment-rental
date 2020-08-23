const Homepage = { template: '<homepage></homepage>' }
const Search = { template: '<search></search>' }

const router = new VueRouter({
	  mode: 'hash',
	  routes: [
	    { path: '/', component: Homepage},
	    { path: '/search', component: Search }
	  ]
});

//const openSignUpPopup = function(){
//	this.$refs.modal.add("modal-show");
//};

var app = new Vue({
	router,
	el: '#general',
	methods : {
		closeSignUpPopup : function(){
			this.$refs.myModal.classList.remove("modal-show");
		}
	}
});