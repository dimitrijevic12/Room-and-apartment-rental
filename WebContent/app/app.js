const Homepage = { template: '<homepage></homepage>' }
const Search = { template: '<search></search>' }

const router = new VueRouter({
	  mode: 'hash',
	  routes: [
	    { path: '/', component: Homepage},
	    { path: '/search', component: Search }
	  ]
});

var app = new Vue({
	router,
	el: '#general'
});