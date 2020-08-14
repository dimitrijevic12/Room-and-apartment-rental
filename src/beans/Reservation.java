package beans;

import java.util.Date;

public class Reservation {
	private Apartment apartment;
	private Date checkInDate;
	private int nightCount;
	private double total;
	private String message;
	private User guest;
	private ReservationStatus status;
	
	public Reservation() {
		super();
		this.apartment = new Apartment();
		this.checkInDate = new Date();
		this.nightCount = 0;
		this.total = 0.0;
		this.message = "";
		this.guest = new User();
		this.status = ReservationStatus.CREATED;
	}
	
	public Reservation(Apartment apartment, Date checkInDate, int nightCount, double total, String message, User guest,
			ReservationStatus status) {
		super();
		this.apartment = apartment;
		this.checkInDate = checkInDate;
		this.nightCount = nightCount;
		this.total = total;
		this.message = message;
		this.guest = guest;
		this.status = status;
	}

	public Apartment getApartment() {
		return apartment;
	}

	public void setApartment(Apartment apartment) {
		this.apartment = apartment;
	}

	public Date getCheckInDate() {
		return checkInDate;
	}

	public void setCheckInDate(Date checkInDate) {
		this.checkInDate = checkInDate;
	}

	public int getNightCount() {
		return nightCount;
	}

	public void setNightCount(int nightCount) {
		this.nightCount = nightCount;
	}

	public double getTotal() {
		return total;
	}

	public void setTotal(double total) {
		this.total = total;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public User getGuest() {
		return guest;
	}

	public void setGuest(User guest) {
		this.guest = guest;
	}

	public ReservationStatus getStatus() {
		return status;
	}

	public void setStatus(ReservationStatus status) {
		this.status = status;
	}
}
