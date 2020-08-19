package DAO;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.StringTokenizer;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import beans.Amenity;
import beans.Apartment;
import beans.Gender;
import beans.Reservation;
import beans.Role;
import beans.User;

public class UserDAO {
	private HashMap<String, User> users = new HashMap<String, User>(); 
	
	public UserDAO() {

	}

	public UserDAO(String contextPath) {
		loadUsers(contextPath);
	}
	
/*	private void loadUsers(String contextPath) {
		BufferedReader in = null;
		try {
			File file = new File(contextPath + "repositories/users.txt");
			in = new BufferedReader(new FileReader(file));
			String line;
			StringTokenizer st;
			while((line = in.readLine()) != null) {
				line = line.trim();
				if (line.equals("") || line.indexOf('#') == 0)
					continue;
				st = new StringTokenizer(line, ";");
				while(st.hasMoreTokens()) {
					String username = st.nextToken().trim();
					String password = st.nextToken().trim();
					String name = st.nextToken().trim();
					String surname = st.nextToken().trim();
					String genderString = st.nextToken().trim();
					String roleString = st.nextToken().trim();
					String apartmentsToRentString = st.nextToken().trim();
					String rentedApartmentsString = st.nextToken().trim();
					String reservationsString = st.nextToken().trim();
					
					Gender gender = Gender.valueOf(genderString);
					Role role = Role.valueOf(roleString);
					ReservationDAOInterface.
//					List<Apartment> apartmentsToRent = apartmentDAOInterface.getApartmentsFromCommaSeparatedString(apartmentsToRentString);
//					List<Apartment> rentedApartments = apartmentDAOInterface.getApartmentsFromCommaSeparatedString(rentedApartmentsString);
					List<Reservation> reservations = reservationDAOInterface.getReservationsFromCommaSeparatedString(reservationsString);
					
					users.put(username, new User(username, password, name, surname, gender, role, null, null, reservations));
				}
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			if ( in != null ) {
				try {
					in.close();
				}
				catch (Exception e) { }
			}
		}
	}
*/	
	
	private void loadUsers(String contextPath) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			
			List<User> usersList = Arrays.asList(mapper.readValue(Paths.get(contextPath + "repositories/users.json").toFile(), User[].class));
			
			for(User user: usersList) {
				users.put(user.getUsername(), user);
			}
			  
			
		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public Collection<User> getAll(){
		return users.values();
	}
	
	public User getUserByUsername(String username) {
		return users.containsKey(username)? users.get(username) : null;
	}
	
	public void test(String contextPath) {
		User user1 = new User("nemanja", "nemanja", "Nemanja", "Dimitrijevic", Gender.MALE, Role.ADMIN);
		User user2 = new User("jovana", "jovana", "Jovana", "Jovanovic", Gender.FEMALE, Role.HOST);
		List<User> usersList = new ArrayList<User>();
		usersList.add(user1);
		usersList.add(user2);
		
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			mapper.writeValue(Paths.get(contextPath + "repositories/users.json").toFile(), usersList);
		} catch (JsonGenerationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
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
