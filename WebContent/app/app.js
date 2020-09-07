const Homepage = { template: '<homepage></homepage>' }
const Search = { template: '<search></search>' }
const Reservations = { template: '<reservations></reservations>' }
const Apartments = { template: '<apartments></apartments>' }
const OneApartment = { template: '<one-apartment></one-apartment>' }
const Guests = { template: '<guests></guests>' }
const Users = { template: '<users></users>' }

const router = new VueRouter({
	  mode: 'hash',
	  routes: [
	    { name: 'home', path: '/', component: Homepage},
		{ name: 'search', path: '/search', component: Search },
		{ name: 'reservations', path: '/reservations', component: Reservations, meta: { forbidAnon: true } },
    { name: 'apartments', path: '/apartments', component: Apartments},
    { name: 'one-apartment', path: '/apartment/:id', component: OneApartment},
    { name: 'guests', path: '/guests', component: Guests, meta: { requiresHost:true} },
    { name: 'users', path: '/users', component: Users, meta: { requiresAdminOrHost:true } }
	  ]
});

router.beforeEach((to, from, next) => {
  var cookie = this.$cookies.get('user');
   if(to.meta.forbidAnon === true){
    if(!cookie){
      next({ name: 'home' })
    } else{
      next()
    }
  
  }else if(to.meta.requiresAdmin === true){
    if(!cookie || (cookie.role !== 'ADMIN')){
      next({ name: 'home' })
    } else{
      next()
    }
  } else if(to.meta.requiresHost === true){
      if(cookie !== null) {
        if((cookie.role === 'ADMIN')) {
          next({ name: 'users' })
        }else if(cookie.role === 'GUEST'){
          next({ name: 'home' })
        }else{
          next()
        }
      } else{
      next({ name: 'home' })
    }
  } else if(to.meta.requiresGuest === true) {
      if(cookie !== null) {
        if(cookie.role === 'ADMIN') {
          next({ name: 'users' })
        }else if (cookie.role === 'HOST'){
          next({ name: 'home' })
        }else{
          next()
        }
    } else{
      next({ name: 'home' })
    }
  }else if(to.meta.requiresAdminOrHost === true){
      if(cookie !== null) {
        if((cookie.role !== 'ADMIN') && (cookie.role !== 'HOST')) {
          next({ name: 'home' })

        }else{
          next()
        }
      } else{
      next({ name: 'home' })
    }
  }else{
    next()
  }
})
/*  if(to.meta.requiresAdmin === true){
    // this route requires auth, check if logged in
    // if not, redirect to login page.
//    if (!this.$cookies.get('user').role !== 'ADMIN') {
    if ((!cookie) || (cookie.role !== 'ADMIN')) {
        next({ name: '#' })
      } else {
        next() // go to wherever I'm going
      } else {
      next() // does not require auth, make sure to always call next()!
    }
  }
  if (to.meta.requiresGuest === true) {
//    if (!this.$cookies.get('user')) {
    if((!cookie) && (cookie.role === 'ADMIN')){
      next({ name: '#/users' })
    }
    else if (!cookie) {
        next({ name: '#' })
      } else {
        next() // go to wherever I'm going
      }
    } else {
      next() // does not require auth, make sure to always call next()!
    }
  }

  if (to.meta.requiresHost === true) {
//    if (this.$cookies.get('user').role !== 'HOST') {
  if ((!cookie) || (cookie.role !== 'HOST')) {
      next({ name: '#' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})*/

var app = new Vue({
	router,
	el: '#general'
});