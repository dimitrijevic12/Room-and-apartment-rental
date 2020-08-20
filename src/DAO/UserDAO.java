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
	
	public UserDAO() {

	}

	public UserDAO(String contextPath) {
		loadUsers(contextPath);
	}
	

	
	private void loadUsers(String contextPath) {
		try {	
			users = new ObjectMapper().readValue(Paths.get(contextPath + "repositories/users.json").toFile(), new TypeReference<Map<String, User>>() { });
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
		return users.containsKey(username)? users.get(username) : null;
	}
	
	public void write(String contextPath) {
		
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			mapper.writeValue(Paths.get(contextPath + "repositories/users.json").toFile(), users);
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
}
