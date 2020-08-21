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
	
}
