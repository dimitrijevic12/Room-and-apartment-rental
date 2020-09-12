package beans;

import java.awt.Image;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class Apartment {
	private ApartmentType type;
	private String name;
	private int roomCount;
	private int guestCount;
	private Location location;
	private List<Pair<Date,Date>> approvedDates;
	private List<Date> availableDates;
	@JsonIgnore
	private User host;
	private String hostUsername;
	@JsonIgnore
	private List<Comment> comments;
	private List<String> images;
	private double price;
	private Date checkInTime;
	private Date checkOutTime;
	private ApartmentStatus status;
	@JsonIgnore
	private List<Amenity> amenities;
	private List<Long> amenitiesIds;
	@JsonIgnore
	private List<Reservation> reservations;
	private long id;
	
	
	

	public Apartment() {
		this.type = ApartmentType.APARTMENT;
		this.roomCount = 0;
		this.guestCount = 0;
		this.location = new Location();
		this.approvedDates = new ArrayList<Pair<Date,Date>>();
		this.availableDates = new ArrayList<Date>();
		this.host = new User();
		this.comments = new ArrayList<Comment>();
		this.images = new ArrayList<String>();
		this.price = 0;
		this.checkInTime = new Date();
		this.checkOutTime = new Date();
		this.status = ApartmentStatus.INACTIVE;
		this.amenities = new ArrayList<Amenity>();
		this.reservations = new ArrayList<Reservation>();
		this.hostUsername="";
		this.amenitiesIds = new ArrayList<Long>();
		this.id = 0;
		this.name = "";
	}
	
	public Apartment(long id,String name, ApartmentType type, int roomCount, int guestCount, Location location, ArrayList<Pair<Date,Date>> approvedDates,
			List<Date> availableDates, User host, List<String> images, double price,
			Date checkInTime, Date checkOutTime, ApartmentStatus status, List<Long> amenitiesIds,
			List<Reservation> reservations) {
		super();
		
		this.type = type;
		this.name = name;
		this.roomCount = roomCount;
		this.guestCount = guestCount;
		this.location = location;
		this.approvedDates = approvedDates;
		this.availableDates = availableDates;
		this.host = host;
		this.images = images;
		this.price = price;
		this.checkInTime = checkInTime;
		this.checkOutTime = checkOutTime;
		this.status = status;
		this.amenitiesIds = amenitiesIds;
		this.reservations = reservations;
		this.id = id;
		this.hostUsername = host.getUsername();
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getHostUsername() {
		return hostUsername;
	}

	public void setHostUsername(String hostUsername) {
		this.hostUsername = hostUsername;
	}

	public List<Comment> getComments() {
		return comments;
	}

	public void setComments(List<Comment> comments) {
		this.comments = comments;
	}

	public List<Long> getAmenitiesIds() {
		return amenitiesIds;
	}

	public void setAmenitiesIds(List<Long> amenitiesIds) {
		this.amenitiesIds = amenitiesIds;
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

	public List<Pair<Date,Date>> getApprovedDates() {
		return approvedDates;
	}

	public void setApprovedDates(List<Pair<Date,Date>> approvedDates) {
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


	public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> images) {
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
		
	public boolean removeAmenity(long amenityId) {
		return amenitiesIds.remove(amenityId);
	}
	
	public boolean IsDeleted() {
		return id==-1;
	}
	
	
}
