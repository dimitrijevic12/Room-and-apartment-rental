package DAO;

import java.awt.Image;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.StringTokenizer;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import beans.Address;
import beans.Amenity;
import beans.Apartment;
import beans.ApartmentStatus;
import beans.ApartmentType;
import beans.Comment;
import beans.Gender;
import beans.Grade;
import beans.Location;
import beans.Reservation;
import beans.ReservationStatus;
import beans.Role;
import beans.User;
import services.CommentService;
import services.ReservationService;
import services.UserService;

public class ApartmentDAO{
	private HashMap<Long,Apartment> apartments = new HashMap<Long,Apartment>();
	
	public ApartmentDAO() {
		
	}
	
	public ApartmentDAO(String contextPath) {
		loadApartments(contextPath);
	}

	public Collection<Apartment> getAll(){
		return apartments.values();
	}
	
	public Apartment findApartment(long id) {
		return apartments.get(id);
	}
	
	private void loadApartments(String contextPath) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			
			List<Apartment> apartmentsList = Arrays.asList(mapper.readValue(Paths.get(contextPath + "repositories/apartments.json").toFile(), Apartment[].class));
			
			for(Apartment apartment: apartmentsList) {
				apartments.put(apartment.getId(), apartment);
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
	
	public void test(String contextPath) {
		List<Date> dates = new ArrayList<Date>();
		Date date = new Date(1597622400328l);
		dates.add(date);
		dates.add(date);
		User user1 = new User("nemanja", "nemanja", "Nemanja", "Dimitrijevic", Gender.MALE, Role.ADMIN);
		User user2 = new User("jovana", "jovana", "Jovana", "Jovanovic", Gender.FEMALE, Role.HOST);
		Comment comm = new Comment(0, user2, new Apartment(), "Tekst komentara", Grade.FOUR);
		List<Comment> comments = new ArrayList<Comment>();
		comments.add(comm);
		Amenity amenity1 = new Amenity(0, "Amenity 1");
		Amenity amenity2 = new Amenity(1, "Amenity 2");
		List<Amenity> amenities = new ArrayList<Amenity>();
		amenities.add(amenity1);
		amenities.add(amenity2);
		Reservation reservation = new Reservation(0, new Apartment(), date, 10, 10000.0, "Poruka rezervacije", user2, ReservationStatus.ACCEPTED);
		List<Reservation> reservations = new ArrayList<Reservation>();
		reservations.add(reservation);
		reservations.add(reservation);
		Apartment ap1 = new Apartment(1, ApartmentType.ROOM, 3, 2, new Location(123, 123, new Address("Ulica", "Grad", 2222)), dates, dates, user1, comments, new ArrayList<Image>(), 100.0, date, date, ApartmentStatus.ACTIVE, amenities, reservations);
		
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			mapper.writeValue(Paths.get(contextPath + "repositories/apartments.json").toFile(), ap1);
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

	/*	private List<Reservation> getReservationFromCommaSeparatedString(String commaSeparatedReservationsIds) {
		String[] reservationsIds = commaSeparatedReservationsIds.split(",");
		List<Reservation> retVal = new ArrayList<Reservation>();
		
		for (String reservationId : reservationsIds) {
			long id= Long.parseLong(reservationId);
			retVal.add(reservationDAO.findReservation(id));
		}
		return retVal;
	}

	private User getUserByUsername(String username) {
		return userDAO.getUserByUsername(username);
	}
	
	private List<Comment> getCommentsFromCommaSeparatedString(String commaSeparatedCommentsIds) {
		String[] commentsIds = commaSeparatedCommentsIds.split(",");
		List<Comment> retVal = new ArrayList<Comment>();
		
		for (String commentId : commentsIds) {
			long id= Long.parseLong(commentId);
			retVal.add(commentDAO.findComment(id));
		}
		return retVal;
	}

	private List<Amenity> getAmenitiesFromCommaSeparatedString(String commaSeparatedAmenitiesIds) {
		String[] amenitiesIds = commaSeparatedAmenitiesIds.split(",");
		List<Amenity> retVal = new ArrayList<Amenity>();
		
		for (String amenityId : amenitiesIds) {
			long id= Long.parseLong(amenityId);
			retVal.add(amenityDAO.findAmenity(id));
		}
		return retVal;
	}

	private Location getLocationFromCommaSeparatedString(String commaSeparatedLocation) {
		String[] locationTokens = commaSeparatedLocation.split(",");
		double latitude = Double.parseDouble(locationTokens[0]);
		double longitude = Double.parseDouble(locationTokens[1]);
		String street = locationTokens[2];
		String city = locationTokens[3];
		long postalCode = Long.parseLong(locationTokens[4]);
		Address address = new Address(street,city,postalCode);
		return new Location(latitude,longitude,address);
	}
*/
	private List<Date> getDatesFromString(String commaSeparatedTime) {
		
		String[] ticks = commaSeparatedTime.split(",");
		List<Date> retVal = new ArrayList<Date>();
		for (String tick : ticks) {
			Date date = new Date(Long.parseLong(tick));
			retVal.add(date);
		}
		return retVal;
	}
	
	public List<Apartment> getApartmentsFromCommaSeparatedString(String commaSeparatedApartmentsIds) {
		String[] apartmentsIds = commaSeparatedApartmentsIds.split(",");
		List<Apartment> retVal = new ArrayList<Apartment>();
		
		for (String apartmentId : apartmentsIds) {
			long id = Long.parseLong(apartmentId);
			retVal.add(this.findApartment(id));
		}
		return retVal;
	}
	
	
}
