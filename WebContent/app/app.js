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
	mounted(){
/*		this.$root.$on('popup', (text) => {
//			this.$refs.myModal.classList.add("modal-show");
			alert(text);
		});*/
		bus.$on('send', (text) => {
    	this.text = text;
    })
	},
	methods : {
		closeSignUpPopup : function(){
			this.$refs.myModal.classList.remove("modal-show");
		}
	}
});