package DAO;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import beans.Apartment;
import beans.Gender;
import beans.Reservation;
import beans.Role;
import beans.User;
import beans.UsernameAndPassword;

public class UserDAO {
	private HashMap<String, User> users = new HashMap<String, User>(); 
	private String path;
	
	public UserDAO() {

	}

	public UserDAO(String contextPath) {
		path = contextPath + "repositories/users.json";
		loadUsers();
	}
	

	
	private void loadUsers() {
		try {	
			users = new ObjectMapper().readValue(Paths.get(path).toFile(), new TypeReference<Map<String, User>>() { });
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public Collection<User> getAll(){
		return users.values();
	}
	
	public User getUserByUsername(String username) {
		return (users.containsKey(username) && !users.get(username).getUsername().equals(""))? users.get(username): null;
	}
	
	public void write() {
		
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			mapper.writeValue(Paths.get(path).toFile(), users);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public List<Apartment> getApartmentsToRent(String username, ApartmentDAO dao){
		List<Apartment> apartments = new ArrayList<Apartment>();
		
		for(Apartment apartment : dao.getAll()) {
			if(apartment.getHost().getUsername().equals(username)) {
				apartments.add(apartment);
			}
		}
		
		return apartments;
	}
	
	public List<Apartment> getRentedApartments(String username, ReservationDAO dao){
		List<Apartment> apartments = new ArrayList<Apartment>();
		
		for(Reservation reservation : dao.getAll()) {
			if(reservation.getGuest().getUsername().equals(username)) {
				apartments.add(reservation.getApartment());
			}
		}
		
		return apartments;
	}
	
	public List<Reservation> getReservations(User user, ReservationDAO dao){
		List<Reservation> reservations = new ArrayList<Reservation>();
		
		for(Reservation reservation : dao.getAll()) {
			if(reservation.getGuest().getUsername().equals(user.getUsername())) {
				reservations.add(reservation);
			}
		}
		
		return reservations;
	}
	
	public User delete(String username) {
		if(users.containsKey(username)) {
			User deletedUser = users.get(username);
			deletedUser.setUsername("");
			write();
			return deletedUser;
		}
		return null;
	}
	
	public User save(User user) {
		if(users.containsKey(user.getUsername())) return null; //TODO odrediti sta ce se desiti ako postoji vec korisnik sa unetim username
		
		users.put(user.getUsername(),user);
		write();
		return user;
	}
	
	public User loginUser(UsernameAndPassword usernameAndPassword) {
		User user = getUserByUsername(usernameAndPassword.getUsername());
		if(user == null) return null;
		if(!user.getPassword().equals(usernameAndPassword.getPassword())) {
			return null;
		}
		
		
		return user;
	}
	
	public User editUser(User user) {
		User userToEdit = getUserByUsername(user.getUsername());
		userToEdit = user;
		users.put(userToEdit.getUsername(), userToEdit);
		write();
		
		return userToEdit;
	}
	
	public Collection<User> getAllUndeletedRoles(Role role){
		List<User> result = new ArrayList<User>();
		for(String un : users.keySet()) {
			if(users.get(un).getRole().equals(role))
				result.add(users.get(un));
		}
		return result;
	}
	
	public void initilazeFile() {
		User u1= new User("nemanja","admin","Nemanja","Dimitrijevic",Gender.MALE,Role.ADMIN);
		User u2= new User("bozidar","test","Bozidar","Arsic",Gender.MALE,Role.ADMIN);
		User u3= new User("marko","markicNarkic","Marko","Lazovic",Gender.MALE,Role.HOST);
		User u4= new User("jelena","seka","Jelena","Stojanovic",Gender.FEMALE,Role.GUEST);
		User u5= new User("marija","sekinaSeka","Marija","Stojanovic",Gender.FEMALE,Role.HOST);
		User u6= new User("dzuca","taki","Tamara","Zuleva",Gender.FEMALE,Role.GUEST);
		User u7= new User("nikola","nisi moj tip","Nikola","Brasno",Gender.MALE,Role.GUEST);
		
		HashMap<String, User> usersFake = new HashMap<String, User>(); 
		
		usersFake.put(u1.getUsername(), u1);
		usersFake.put(u2.getUsername(), u2);
		usersFake.put(u3.getUsername(), u3);
		usersFake.put(u4.getUsername(), u4);
		usersFake.put(u5.getUsername(), u5);
		usersFake.put(u6.getUsername(), u6);
		usersFake.put(u7.getUsername(), u7);
		ObjectMapper mapper = new ObjectMapper();
		try {
			mapper.writeValue(Paths.get(path).toFile(), usersFake);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
