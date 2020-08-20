package DAO;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import beans.Amenity;

public class AmenityDAO {
	private HashMap<Long, Amenity> amenities = new HashMap<Long,Amenity>();

	
	public AmenityDAO() {
		
	}
	
	public AmenityDAO(String contextPath) {
		loadAmenities(contextPath);
	}

	
	public Collection<Amenity> findAll(){
		return amenities.values();
	}
	
	public Amenity findAmenity(long id) {
		return amenities.containsKey(id)? amenities.get(id) : null;
	}
	
	public Amenity save(Amenity amenity) {
		long maxId = -1;
		for(long id : amenities.keySet()) {
			if(maxId<id) maxId=id;
		}
		maxId++;
		amenity.setId(maxId);
		amenities.put(amenity.getId(),amenity);
		return amenity;
	}
	

	
	private void loadAmenities(String contextPath) {
		
		try {
			amenities = new ObjectMapper().readValue(Paths.get(contextPath + "repositories/amenities.json").toFile(), new TypeReference<Map<Long, Amenity>>() { });			
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void write (String contextPath) {
		/*Amenity a1 = new Amenity(0, "WIFI");
		Amenity a2 = new Amenity(1, "Klima");
		Amenity a3 = new Amenity(2, "Krevet");
		
		HashMap<Long, Amenity> firstAmenities = new HashMap<Long,Amenity>();
		firstAmenities.put(a1.getId(), a1);
		firstAmenities.put(a2.getId(), a2);
		firstAmenities.put(a3.getId(), a3);
		*/
		ObjectMapper mapper = new ObjectMapper();
		try {
			mapper.writeValue(Paths.get(contextPath+"repositories/amenities.json").toFile(), amenities);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
