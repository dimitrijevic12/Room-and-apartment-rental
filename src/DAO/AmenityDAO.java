package DAO;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import beans.Amenity;

public class AmenityDAO {
	private HashMap<Long, Amenity> amenities = new HashMap<Long,Amenity>();
	private String path;

	
	public AmenityDAO() {
		
	}
	
	public AmenityDAO(String contextPath) {
		path = contextPath + "repositories/amenities.json";
		loadAmenities();
	}

	
	public Collection<Amenity> findAll(){
		return amenities.values();
	}
	
	public Collection<Amenity> findAllUndeleted(){
		List<Amenity> result = new ArrayList<Amenity>();
		for(long id: amenities.keySet()) {
			if(amenities.get(id).getId()!=-1) result.add(amenities.get(id));
		}
		return result;
	}
	
	public Amenity findAmenity(long id) {
		return (amenities.containsKey(id) && amenities.get(id).getId()!=-1)? amenities.get(id): null;
	}
	
	public List<Amenity> findAmenitiesById(List<Long> ids){
		List<Amenity> amenities = new ArrayList<Amenity>();
		for(long id : ids) {
			amenities.add(findAmenity(id));
		}
		
		return amenities;
	}
	
	public Amenity save(Amenity amenity) {
		long maxId = -1;
		for(long id : amenities.keySet()) {
			if(amenities.get(id).getId()==-1) break;
			if(maxId<id) maxId=id;
		}
		maxId++;
		amenity.setId(maxId);
		amenities.put(amenity.getId(),amenity);
		write();
		return amenity;
	}
	

	
	private void loadAmenities() {
		
		try {
			amenities = new ObjectMapper().readValue(Paths.get(path).toFile(), new TypeReference<Map<Long, Amenity>>() { });			
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
			mapper.writeValue(Paths.get(path).toFile(), amenities);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public Amenity delete(long id) {
		if(amenities.containsKey(id)) {
			Amenity deletedAmenity = amenities.get(id);
			deletedAmenity.setId(-1);
			write();
			return deletedAmenity;
		}
		return null;
	}
	
	public void initilazeFile() {
		Amenity a1= new Amenity(0,"WIFI");
		Amenity a2= new Amenity(1,"Klima");
		Amenity a3= new Amenity(2,"Radio");
		Amenity a4= new Amenity(3,"TV");
		
		
		HashMap<Long, Amenity> amenitiesFake = new HashMap<Long,Amenity>();
		amenitiesFake.put(a1.getId(),a1);
		amenitiesFake.put(a2.getId(),a2);
		amenitiesFake.put(a3.getId(),a3);
		amenitiesFake.put(a4.getId(),a4);
		ObjectMapper mapper = new ObjectMapper();
		try {
			mapper.writeValue(Paths.get(path).toFile(), amenitiesFake);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
