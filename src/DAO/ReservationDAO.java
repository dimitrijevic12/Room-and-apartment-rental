package DAO;

import java.nio.file.Paths;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;


import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import beans.Reservation;



public class ReservationDAO {
	
	private HashMap<Long, Reservation> reservations = new HashMap<Long, Reservation>();
	private String path;
	
	public ReservationDAO(String contextPath) {
		path = contextPath + "repositories/reservations.json";
		loadReservations();
	}
	
	private void loadReservations() {
		try {
			reservations = new ObjectMapper().readValue(Paths.get(path).toFile(), new TypeReference<Map<Long, Reservation>>() { });
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public Collection<Reservation> getAll(){
		return reservations.values();
	}
	
	public Reservation findReservation(long id) {
		return (reservations.containsKey(id) && reservations.get(id).getId()!=-1)? reservations.get(id): null;	}
	
	public void write() {
		ObjectMapper mapper = new ObjectMapper();
		try {
			mapper.writeValue(Paths.get(path).toFile(),reservations);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public Reservation delete(long id) {
		if(reservations.containsKey(id)) {
			Reservation deletedReservation = reservations.get(id);
			deletedReservation.setId(-1);
			write();
			return deletedReservation;
		}
		return null;
	}
}
