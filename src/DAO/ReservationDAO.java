package DAO;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.StringTokenizer;

import beans.Apartment;
import beans.Comment;
import beans.Grade;
import beans.Reservation;
import beans.ReservationStatus;
import beans.User;

public class ReservationDAO {
	
	private HashMap<Long, Reservation> reservations = new HashMap<Long, Reservation>();
	
	public ReservationDAO(String contextPath) {
		loadReservations(contextPath);
	}
	
	private void loadReservations(String contextPath) {
		BufferedReader in = null;
		try {
			File file = new File(contextPath + "repositories/reservations.txt");
			in = new BufferedReader(new FileReader(file));
			String line;
			StringTokenizer st;
			while((line = in.readLine()) != null) {
				line = line.trim();
				if (line.equals("") || line.indexOf('#') == 0)
					continue;
				st = new StringTokenizer(line, ";");
				while(st.hasMoreTokens()) {
					String reservationIdString = st.nextToken().trim();
					String apartmentIdString = st.nextToken().trim();
					String checkInDateString = st.nextToken().trim();
					String nightCountString = st.nextToken().trim();
					String totalString = st.nextToken().trim();
					String message = st.nextToken().trim();
					String username = st.nextToken().trim();
					String statusString = st.nextToken().trim();
					long reservationId = Long.parseLong(reservationIdString);
					long apartmentId = Long.parseLong(apartmentIdString);
					// TODO apartmentDAO da se nadje odgovarajuci apartman
					Date checkInDate = new Date(Long.parseLong(checkInDateString));
					int nightCount = Integer.parseInt(nightCountString);
					Double total = Double.parseDouble(totalString);
//					User user = userDAOInterface.getUserByUsername(username);
					ReservationStatus status = ReservationStatus.valueOf(statusString);
					reservations.put(reservationId, new Reservation(reservationId, new Apartment(), checkInDate, nightCount, total, message, new User(), status));
				}
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			if ( in != null ) {
				try {
					in.close();
				}
				catch (Exception e) { }
			}
		}
	}
	
	public Collection<Reservation> getAll(){
		return reservations.values();
	}
	
	public Reservation findReservation(long id) {
		return reservations.containsKey(id)? reservations.get(id): null;
	}
	
	public List<Reservation> getReservationsFromCommaSeparatedString(String commaSeparatedReservationsIds) {
		String[] reservationsIds = commaSeparatedReservationsIds.split(",");
		List<Reservation> retVal = new ArrayList<Reservation>();
		
		for (String reservationId : reservationsIds) {
			long id = Long.parseLong(reservationId);
			retVal.add(this.findReservation(id));
		}
		return retVal;
	}
}
