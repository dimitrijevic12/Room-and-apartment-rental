package beans;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class User {
	private String username;
	private String password;
	private String name;
	private String surname;
	private Gender gender;
	private Role role;
	@JsonIgnore
	private List<Apartment> apartmentsToRent;
	@JsonIgnore
	private List<Apartment> rentedApartments;
	@JsonIgnore
	private List<Reservation> reservations;
	private boolean banned;

	public User() {
		super();
		this.username = "";
		this.password = "";
		this.name = "";
		this.surname = "";
		this.gender = Gender.MALE;
		this.role = Role.GUEST;
		this.apartmentsToRent = new ArrayList<Apartment>();
		this.rentedApartments = new ArrayList<Apartment>();
		this.reservations = new ArrayList<Reservation>();
		this.banned = false;
	}
	public User(String username, String password, String name, String surname, Gender gender, Role role,
			List<Apartment> apartmentsToRent, List<Apartment> rentedApartments, List<Reservation> reservations, boolean banned) {
		super();
		this.username = username;
		this.password = password;
		this.name = name;
		this.surname = surname;
		this.gender = gender;
		this.role = role;
		this.apartmentsToRent = apartmentsToRent;
		this.rentedApartments = rentedApartments;
		this.reservations = reservations;
		this.banned = banned;
	}
	public User(String username, String password, String name, String surname, Gender gender, Role role) {
		super();
		this.username = username;
		this.password = password;
		this.name = name;
		this.surname = surname;
		this.gender = gender;
		this.role = role;
		this.apartmentsToRent = new ArrayList<Apartment>();
		this.rentedApartments = new ArrayList<Apartment>();
		this.reservations = new ArrayList<Reservation>();
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSurname() {
		return surname;
	}
	public void setSurname(String surname) {
		this.surname = surname;
	}
	public Gender getGender() {
		return gender;
	}
	public void setGender(Gender gender) {
		this.gender = gender;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public List<Apartment> getApartmentsToRent() {
		return apartmentsToRent;
	}
	public void setApartmentsToRent(List<Apartment> apartmentsToRent) {
		this.apartmentsToRent = apartmentsToRent;
	}
	public List<Apartment> getRentedApartments() {
		return rentedApartments;
	}
	public void setRentedApartments(List<Apartment> rentedApartments) {
		this.rentedApartments = rentedApartments;
	}
	public List<Reservation> getReservations() {
		return reservations;
	}
	public void setReservations(List<Reservation> reservations) {
		this.reservations = reservations;
	}
	public boolean isBanned() {
		return banned;
	}
	public void setBanned(boolean banned) {
		this.banned = banned;
	}
	public boolean IsDeleted() {
		return username.equals("");
	}

}
