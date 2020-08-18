package DAO;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.StringTokenizer;

import beans.Address;
import beans.Amenity;
import beans.Apartment;
import beans.ApartmentStatus;
import beans.ApartmentType;
import beans.Comment;
import beans.Location;
import beans.Reservation;
import beans.User;
import services.CommentService;
import services.ReservationService;
import services.UserService;

public class ApartmentDAO {
	private HashMap<Long,Apartment> apartments = new HashMap<Long,Apartment>();
	private UserDAO userDAO ;
	private CommentDAO commentDAO;
	private ReservationDAO reservationDAO;
	private AmenityDAO amenityDAO;
	
	public ApartmentDAO() {
		
	}
	
	public ApartmentDAO(String contextPath) {
		userDAO = new UserDAO(contextPath);
		commentDAO = new CommentDAO(contextPath);
		reservationDAO = new ReservationDAO(contextPath);
		amenityDAO = new AmenityDAO(contextPath);
		loadApartments(contextPath);
	}

	public Collection<Apartment> getAll(){
		return apartments.values();
	}
	
	public Apartment findApartment(long id) {
		return apartments.get(id);
	}
	
	private void loadApartments(String contextPath) {
		BufferedReader in = null;
		try {
			File file = new File(contextPath + "repositories/apartments.txt");
			in = new BufferedReader(new FileReader(file));
			String line;
			StringTokenizer st;
			while((line = in.readLine())!=null) {
				line = line.trim();
				if(line.equals("") || line.indexOf('#') == 0) continue;
				st = new StringTokenizer(line,";");
				while(st.hasMoreTokens()) {
					long apartmentId = Long.parseLong(st.nextToken().trim());
					User hostUsername = getUserByUsername(st.nextToken().trim());
					ApartmentType type = ApartmentType.valueOf(st.nextToken().trim());
					int roomCount = Integer.parseInt(st.nextToken().trim());
					int guestCount = Integer.parseInt(st.nextToken().trim());
					double price = Double.parseDouble(st.nextToken().trim());
					ApartmentStatus status = ApartmentStatus.valueOf(st.nextToken().trim());
					Date checkInTime = new Date(Long.parseLong(st.nextToken().trim()));
					Date checkOutTime = new Date(Long.parseLong(st.nextToken().trim()));
					Location location = getLocationFromCommaSeparatedString(st.nextToken().trim());
					List<Amenity> amenities = getAmenitiesFromCommaSeparatedString(st.nextToken().trim());
					List<Comment> comments = getCommentsFromCommaSeparatedString(st.nextToken().trim());
					//TODO: Treba odraditi i approvedAppointments a available ce sam program traziti
					List<Reservation> reservations = getReservationFromCommaSeparatedString(st.nextToken().trim());
					
					apartments.put(apartmentId,new Apartment(type, roomCount, guestCount, location, null, null, hostUsername, comments, null, price, checkInTime, checkOutTime, status, amenities, reservations));
				}
			}
		}catch (Exception e) {
			e.printStackTrace();
		}finally {
			if ( in != null ) {
				try {
					in.close();
				}
				catch (Exception e) { }
			}
		}
		
	}

	private List<Reservation> getReservationFromCommaSeparatedString(String commaSeparatedReservationsIds) {
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

	private List<Date> getDatesFromString(String commaSeparatedTime) {
		
		String[] ticks = commaSeparatedTime.split(",");
		List<Date> retVal = new ArrayList<Date>();
		for (String tick : ticks) {
			Date date = new Date(Long.parseLong(tick));
			retVal.add(date);
		}
		return retVal;
	}
	
	
}
