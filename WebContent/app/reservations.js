Vue.component("reservations",{
	template: `
<div>
	Rezervacije
</div>
	`,
	beforeRouteUpdate (to, from, next) {
//    	if(this.App.$cookies.get('user').role === 'ANON') {
//		if(to.$cookies.get('user').role === 'ANON'){
		if(this.$cookies.get('user').role === 'ANON'){
			alert("Pristupanje reservations bez dozvole")
			next('#');
		}
  },
})