const Homepage = { template: '<homepage></homepage>' }
const Search = { template: '<search></search>' }
const Reservations = { template: '<reservations></reservations>' }
const Apartments = { template: '<apartments></apartments>' }

const router = new VueRouter({
	  mode: 'hash',
	  routes: [
	    { path: '/', component: Homepage},
		{ path: '/search', component: Search },
		{ path: '/reservations', component: Reservations, meta: { requiresGuest: true } },
		{ path: '/apartments', component: Apartments, meta: { requiresHost:true } }
	  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresGuest === true) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!this.$cookies.get('user')) {
      next({ name: '#' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
  if (to.meta.requiresHost === true) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (this.$cookies.get('user').role !== 'HOST') {
      next({ name: '#' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})

var app = new Vue({
	router,
	el: '#general',
});