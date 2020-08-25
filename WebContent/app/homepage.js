Vue.component("homepage",{
	template: `
<div class="container">
	<div class="home-search">
		<form>
			<table>
				<tr><td><h2>Ovo je pocetna stranica!</h2></td></tr>
				<tr>
					<td><input id="location" type = "text" placeholder="Lokacija"><input id="datum" type="date"></td>
				</tr>
			</table>
		</form>
	</div>
</div>
	`,
	mounted : function(){
		console.log('Homepage mounted');
	}
})