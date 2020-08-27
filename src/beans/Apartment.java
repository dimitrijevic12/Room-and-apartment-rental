package beans;

import java.awt.Image;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class Apartment {
	private ApartmentType type;
	private int roomCount;
	private int guestCount;
	private Location location;
	private List<Date> approvedDates;
	private List<Date> availableDates;
	private User host;
	private List<Comment> comments;
	private List<Image> images;
	private double price;
	private Date checkInTime;
	private Date checkOutTime;
	private ApartmentStatus status;
	private List<Amenity> amenities;
	@JsonIgnore
	private List<Reservation> reservations;
	private long id;
	
	public Apartment() {
		super();
		this.type = ApartmentType.APARTMENT;
		this.roomCount = 0;
		this.guestCount = 0;
		this.location = new Location();
		this.approvedDates = new ArrayList<Date>();
		this.availableDates = new ArrayList<Date>();
		this.host = new User();
		this.comments = new ArrayList<Comment>();
		this.images = new ArrayList<Image>();
		this.price = 0;
		this.checkInTime = new Date();
		this.checkOutTime = new Date();
		this.status = ApartmentStatus.INACTIVE;
		this.amenities = new ArrayList<Amenity>();
		this.reservations = new ArrayList<Reservation>();
		this.id = 0;
	}
	
	public Apartment(long id, ApartmentType type, int roomCount, int guestCount, Location location, List<Date> approvedDates,
			List<Date> availableDates, User host, List<Comment> comment, List<Image> images, double price,
			Date checkInTime, Date checkOutTime, ApartmentStatus status, List<Amenity> amenities,
			List<Reservation> reservations) {
		super();
		this.type = type;
		this.roomCount = roomCount;
		this.guestCount = guestCount;
		this.location = location;
		this.approvedDates = approvedDates;
		this.availableDates = availableDates;
		this.host = host;
		this.comments = comment;
		this.images = images;
		this.price = price;
		this.checkInTime = checkInTime;
		this.checkOutTime = checkOutTime;
		this.status = status;
		this.amenities = amenities;
		this.reservations = reservations;
		this.id = id;
	}
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public ApartmentType getType() {
		return type;
	}

	public void setType(ApartmentType type) {
		this.type = type;
	}

	public int getRoomCount() {
		return roomCount;
	}

	public void setRoomCount(int roomCount) {
		this.roomCount = roomCount;
	}

	public int getGuestCount() {
		return guestCount;
	}

	public void setGuestCount(int guestCount) {
		this.guestCount = guestCount;
	}

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public List<Date> getApprovedDates() {
		return approvedDates;
	}

	public void setApprovedDates(List<Date> approvedDates) {
		this.approvedDates = approvedDates;
	}

	public List<Date> getAvailableDates() {
		return availableDates;
	}

	public void setAvailableDates(List<Date> availableDates) {
		this.availableDates = availableDates;
	}

	public User getHost() {
		return host;
	}

	public void setHost(User host) {
		this.host = host;
	}

	public List<Comment> getComment() {
		return comments;
	}

	public void setComment(List<Comment> comment) {
		this.comments = comment;
	}

	public List<Image> getImages() {
		return images;
	}

	public void setImages(List<Image> images) {
		this.images = images;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public Date getCheckInTime() {
		return checkInTime;
	}

	public void setCheckInTime(Date checkInTime) {
		this.checkInTime = checkInTime;
	}

	public Date getCheckOutTime() {
		return checkOutTime;
	}

	public void setCheckOutTime(Date checkOutTime) {
		this.checkOutTime = checkOutTime;
	}

	public ApartmentStatus getStatus() {
		return status;
	}

	public void setStatus(ApartmentStatus status) {
		this.status = status;
	}

	public List<Amenity> getAmenities() {
		return amenities;
	}

	public void setAmenities(List<Amenity> amenities) {
		this.amenities = amenities;
	}

	public List<Reservation> getReservations() {
		return reservations;
	}

	public void setReservations(List<Reservation> reservations) {
		this.reservations = reservations;
	}
		
	public Amenity removeAmenity(long amenityId) {
		for(Amenity amenity : amenities) {
			if(amenity.getId() == amenityId) {
				amenities.remove(amenity);
				return amenity;
			}
		}
		return null;
	}

	public Comment removeComment(long commentId) {
		for(Comment comment : comments) {
			if(comment.getId() == commentId) {
				comments.remove(comment);
				return comment;
			}
		}
		return null;
		
	}
	
	public boolean IsDeleted() {
		return id==-1;
	}
	
	
}
