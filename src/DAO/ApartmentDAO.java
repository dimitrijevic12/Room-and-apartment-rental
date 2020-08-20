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
	
	public Apartment findApartment(long id) {
		return (apartments.containsKey(id) && apartments.get(id).getId()!=-1)? apartments.get(id): null;
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
		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
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
	
	
	public Apartment delete(long id) {
		if(apartments.containsKey(id)) {
			Apartment deletedApartmant = apartments.get(id);
			deletedApartmant.setId(-1);
			write();
			return deletedApartmant;
		}
		return null;
	}
	
}
