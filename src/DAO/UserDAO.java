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
import beans.Reservation;
import beans.User;

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
	
	
}
