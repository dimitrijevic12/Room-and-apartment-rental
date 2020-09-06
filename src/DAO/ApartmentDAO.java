package DAO;

import java.awt.Image;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import beans.Address;
import beans.Amenity;
import beans.Apartment;
import beans.ApartmentStatus;
import beans.ApartmentType;
import beans.Location;
import beans.Reservation;
import beans.User;


public class ApartmentDAO{
	private HashMap<Long,Apartment> apartments = new HashMap<Long,Apartment>();
	private String path;
	
	public ApartmentDAO() {
		
	}
	
	public ApartmentDAO(String contextPath) {
		path = contextPath + "repositories/apartments.json";
		loadApartments();
	}

	public Collection<Apartment> getAll(){
		return apartments.values();
	}
	
	public List<Apartment> getActiveApartments(){
		List<Apartment> activeApartments = new ArrayList<Apartment>();
		for(Apartment ap : getAll()) {
			if(ap.getStatus() == ApartmentStatus.ACTIVE) {
				activeApartments.add(ap);
			}
		}
		
		return activeApartments;
	}
	
	public List<Apartment> getHostApartments(String username){
		List<Apartment> hostApartments = new ArrayList<Apartment>();
		for(Apartment ap : getAll()) {
			if(ap.getHostUsername().equals(username)) {
				hostApartments.add(ap);
			}
		}
		
		return hostApartments;
	}
	
	
	public Apartment findApartment(long id) {
		return (apartments.containsKey(id) && apartments.get(id).getId()!=-1)? apartments.get(id): null;
	}
	
	public Collection<Long> getApartmentsIdsFromHost(String username){
		List<Long> result = new ArrayList<Long>();
		for (Long apartmentId : apartments.keySet()) {
			Apartment apartment = apartments.get(apartmentId);
			if(apartment.IsDeleted()) continue;
			
			if(apartment.getHost().getUsername().equals(username)) 
				result.add(apartment.getId()) ;
		}
		return result;
	}
	
	private void loadApartments() {
		try {
			apartments = new ObjectMapper().readValue(Paths.get(path).toFile(), new TypeReference<Map<Long, Apartment>>() { });
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void write() {
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			mapper.writeValue(Paths.get(path).toFile(), apartments);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public Apartment delete(long id) {
		if(apartments.containsKey(id)) {
			Apartment deletedApartmant = apartments.get(id);
			deletedApartmant.setId(-1);
			write();
			return deletedApartmant;
		}
		return null;
	}
	
	public void deleteAmenity(long amenityId) {
		for(Long id : apartments.keySet()) {
			apartments.get(id).removeAmenity(amenityId);
		}
		write();
	}
	
	public void deleteHost(String username) {
		for(Long apartmentId : apartments.keySet()) {
			Apartment apartment = apartments.get(apartmentId);
			if(apartment.IsDeleted()) continue;
			
			if(apartment.getHostUsername().equals(username)) {
				//apartment.getHost().setUsername("");
				apartment.setHostUsername("");
			}
				
		}
		write();
	}
	
	
	public void initilazeFile(List<User> users,List<Amenity> amenities) {
		ApartmentType type1 = ApartmentType.ROOM;
		ApartmentType type2 = ApartmentType.APARTMENT;
		Location location = new Location(212,214,new Address("Topolska 18", "New Now", 21000));
		List<Date> dates = new ArrayList<Date>();
		Date d = new Date(2323223232L);
		ApartmentStatus active = ApartmentStatus.ACTIVE;
		ApartmentStatus inactive = ApartmentStatus.INACTIVE;
		List<Reservation> res = new ArrayList<Reservation>();
		List<Image> images = new ArrayList<Image>();
		List<Long> amenitiesIds1= new ArrayList<Long>();
		amenitiesIds1.add(amenities.get(0).getId());
		amenitiesIds1.add(amenities.get(1).getId());
		List<Long> amenitiesIds2= new ArrayList<Long>();
		amenitiesIds2.add(amenities.get(0).getId());
		amenitiesIds2.add(amenities.get(3).getId());
		//Apartment at1 = new Apartment(0, type1, 10, 4, location, dates, dates, users.get(0).getUsername(), commentsIds, images, price, checkInTime, checkOutTime, status, amenitiesIds, reservations)
		Apartment at1 = new Apartment(0,"Hotel zlatiborska noc",type1,10,4,location,dates,dates,users.get(0),images,222,d,d,active,amenitiesIds1,res,4);
		Apartment at2 = new Apartment(1,"Pupinova palata",type2,13,0,location,dates,dates,users.get(1),images,500,d,d,inactive,amenitiesIds2,res,3);		
		
		HashMap<Long,Apartment> apartmentsFake = new HashMap<Long,Apartment>();
		apartmentsFake.put(at1.getId(),at1);
		apartmentsFake.put(at2.getId(),at2);
		
		ObjectMapper mapper = new ObjectMapper();
		try {
			mapper.writeValue(Paths.get(path).toFile(), apartmentsFake);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
