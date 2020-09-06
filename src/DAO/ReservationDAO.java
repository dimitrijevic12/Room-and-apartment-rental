package DAO;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import beans.Apartment;
import beans.Reservation;
import beans.ReservationStatus;
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
	
	public Collection<Reservation> getAllWithApartment(ApartmentDAO apartmentDAO){
		List<Reservation> result = new ArrayList<Reservation>();
		for(long resId : reservations.keySet()) {
			Reservation reservation = reservations.get(resId);
			reservation.setApartment(apartmentDAO.findApartment(reservation.getApartmentId()));
			result.add(reservation);
		}
		return result;
	}
	
	public Reservation findReservation(long id,ApartmentDAO apartmentDAO) {
		if(reservations.containsKey(id) && reservations.get(id).getId()!=-1) {
			Reservation result = reservations.get(id);
			result.setApartment(apartmentDAO.findApartment(result.getApartmentId()));
			return result;
		}
		return null;
	}
	
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
	
	public void deleteReservationsForApartment(long aparmtentId) {
		for(Long reservationId : reservations.keySet()) {
			Reservation reservation = reservations.get(reservationId);
			if(reservation.IsDeleted()) continue;
			
			if(reservation.getApartmentId()==aparmtentId)
				delete(reservationId);
		}
		write();
	}
	
	public Set<User> getGuestsFromApartments(Collection<Long> apartmentsIds){
		Set<User> result = new HashSet<User>();
		for (Long reservationId : reservations.keySet()) {
			Reservation reservation = reservations.get(reservationId);
			if(reservation.IsDeleted()) continue;
			
			if(isApartmansContainsReservation(reservation, apartmentsIds))
				result.add(reservation.getGuest());
		}
		return result;
		
	}
	
	public boolean IsReservationExpired(String username,long apartmentId) {
		for(long reservationId : reservations.keySet()) {
			Reservation reservation = reservations.get(reservationId);
			if(reservation.IsDeleted()) continue;
			
			if(reservation.getGuestUsername().equals(username) && reservation.getApartmentId()==apartmentId) {
				ReservationStatus reservationStatus = reservation.getStatus();
				if(reservationStatus.equals(ReservationStatus.DENIED)|| reservationStatus.equals(ReservationStatus.COMPLETED)) return true;
			}
		}
		return false;
	}
	
	private boolean isApartmansContainsReservation(Reservation reservation,Collection<Long> apartmentsIds) {
		for (Long id : apartmentsIds) {
			if(reservation.getApartment().getId()==id) return true;
		}
		return false;
	}
	
	public void deleteGuest(String username) {
		for(Long reservationId : reservations.keySet()) {
			Reservation reservation = reservations.get(reservationId);
			if(reservation.IsDeleted()) continue;
			
			if(reservation.getGuestUsername().equals(username)) {
				delete(reservation.getId());
			}
				
		}
	}
	
	public void initilazeFile(List<Apartment> ap,List<User> useri) {
		ObjectMapper mapper = new ObjectMapper();
		Calendar c = Calendar.getInstance();
		c.set(Calendar.YEAR, 2020);
		c.set(Calendar.MONTH,Calendar.NOVEMBER);
		c.set(Calendar.DAY_OF_MONTH,22);
		Reservation r1= new Reservation(0,ap.get(0),c.getTime(),7,3000,"Bilo je ludo i nezaboravno",useri.get(0),ReservationStatus.ACCEPTED);
		Reservation r2= new Reservation(1,ap.get(0),c.getTime(),4,2400,"Kada jedem gumene medvedice prvo im odkinem glavu :(",useri.get(1),ReservationStatus.ACCEPTED);
		Reservation r3= new Reservation(2,ap.get(1),c.getTime(),7,3000,"Dosao sam da veceram i prcim nesto, a vec sam veceraso",useri.get(2),ReservationStatus.DENIED);
		Reservation r4= new Reservation(3,ap.get(0),c.getTime(),7,3000,"Kad vec ne mogu da spavam po tudjim sobama, moram i sam da uzmem jednu",useri.get(2),ReservationStatus.CREATED);
		HashMap<Long, Reservation> reservationsFake = new HashMap<Long, Reservation>();
		reservationsFake.put(r1.getId(), r1);
		reservationsFake.put(r2.getId(), r2);
		reservationsFake.put(r3.getId(), r3);
		reservationsFake.put(r4.getId(), r4);
		try {
			mapper.writeValue(Paths.get(path).toFile(), reservationsFake);
		} catch (Exception e) {
			System.out.println("Opet nesto zajebava");
		}
	}

}
