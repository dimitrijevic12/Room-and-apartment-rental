Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});

var App = new Vue({
	el: '#topnav',
	data : {
		isActive : '',
		dropdownActive : false
	},
	mounted : function(){
		this.isActive = 'home'
	},
	methods : {
		openDropdown : function() {
//			this.$refs.myDropdown.classList.toggle("show");
			if(this.$refs.myDropdown.classList.contains("dropdown-content-show")){
				this.$refs.myDropdown.classList.remove("dropdown-content-show");
			}
			else{
				this.$refs.myDropdown.classList.add("dropdown-content-show");	
			}		
		},
		closeDropdown : function(){
//			if(this.$refs.myDropdown.classList.contains("dropdown-content.show")){
//				alert("postoji");
//			}
//			this.$refs.myDropdown.classList.replace("dropdown-content.show", "dropdown-content");
			this.$refs.myDropdown.classList.remove("dropdown-content-show");
		}
	}
});