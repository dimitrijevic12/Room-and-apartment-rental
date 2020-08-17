package DAO;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.Collection;
import java.util.HashMap;
import java.util.StringTokenizer;

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

	
}
