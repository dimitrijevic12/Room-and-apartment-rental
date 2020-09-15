package beans;

import java.util.Date;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonProperty;


public class Reservation {
	private long id;
	private long apartmentId;
	private Date checkInDate;
	private int nightCount;
	private double total;
	private String message;
	private String guestUsername;
	@JsonProperty
	private Apartment apartment;
	@JsonIgnore
	private User guest;
	private ReservationStatus status;

	
	public Reservation() {
		super();
		this.id = 0;
		this.apartment = new Apartment();
		this.checkInDate = new Date();
		this.nightCount = 0;
		this.total = 0.0;
		this.message = "";
		this.guest = new User();
		this.status = ReservationStatus.CREATED;
		this.apartmentId=-1;
		this.guestUsername="";
	}
	
	public Reservation(long id, Apartment apartment, Date checkInDate, int nightCount, double total, String message, User guest,
			ReservationStatus status) {
		super();
		this.id = id;
		this.apartment = apartment;
		this.checkInDate = checkInDate;
		this.nightCount = nightCount;
		this.total = total;
		this.message = message;
		this.guest = guest;
		this.status = status;
		this.guestUsername = guest.getUsername();
		this.apartmentId = apartment.getId();
	}
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	public long getApartmentId() {
		return apartmentId;
	}

	public void setApartmentId(long apartmentId) {
		this.apartmentId = apartmentId;
	}

	public String getGuestUsername() {
		return guestUsername;
	}

	public void setGuestUsername(String guestUsername) {
		this.guestUsername = guestUsername;
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
	
	public boolean IsDeleted() {
		return id==-1;
	}
}
