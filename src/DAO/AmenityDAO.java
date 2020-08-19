package DAO;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

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
	
	
	
	
/*	private void loadAmenities(String contextPath) {
		BufferedReader in = null;
		try {
			File file = new File(contextPath + "repositories/amenities.txt");
			in = new BufferedReader(new FileReader(file));
			String line;
			StringTokenizer st;
			while((line=in.readLine()) != null) {
				line = line.trim();
				if(line.equals("") || line.indexOf('#') == 0){
					continue;
				}
				
				st = new StringTokenizer(line, ";");
				while(st.hasMoreTokens()) {
					long id = Long.parseLong(st.nextToken().trim());
					String name = st.nextToken().trim();
					
					amenities.put(id, new Amenity(id, name));
				}
			}
		}catch (Exception e) {
			e.printStackTrace();
		}finally {
			if( in != null) {
				try {
					in.close();
				}catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		
	}
*/
	
	private void loadAmenities(String contextPath) {
		
		try {
			ObjectMapper mapper = new ObjectMapper();
			
			List<Amenity> amenitiesList = Arrays.asList(mapper.readValue(Paths.get(contextPath + "repositories/amenities.json").toFile(), Amenity[].class));
			
			for(Amenity amenity : amenitiesList) {
				amenities.put(amenity.getId(), amenity);
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
		Amenity amenity1 = new Amenity(0, "Amenity1");
		Amenity amenity2 = new Amenity(1, "Amenity2");
		
		List<Amenity> amenities = new ArrayList<Amenity>();
		amenities.add(amenity1);
		amenities.add(amenity2);
		
		try {
			ObjectMapper mapper = new ObjectMapper();
			File path = Paths.get(contextPath + "repositories/amenities.json").toFile();
			mapper.writeValue(path, amenities);
		}
		catch (Exception ex) {
		    ex.printStackTrace();
		}
	}
	
}
