package DAO;

import java.nio.file.Paths;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import beans.Reservation;
import beans.User;



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
	
	public Set<User> getGuestsFromApartments(Collection<Long> apartmentsIds){
		Set<User> result = new HashSet<User>();
		for (Long reservationId : reservations.keySet()) {
			Reservation reservation = reservations.get(reservationId);
			if(reservation.isDeleted()) continue;
			
			if(isApartmansContainsReservation(reservation, apartmentsIds))
				result.add(reservation.getGuest());
		}
		return result;
		
	}
	
	private boolean isApartmansContainsReservation(Reservation reservation,Collection<Long> apartmentsIds) {
		for (Long id : apartmentsIds) {
			if(reservation.getApartment().getId()==id) return true;
		}
		return false;
	}
}
