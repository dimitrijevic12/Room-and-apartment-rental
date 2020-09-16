package beans;

import org.codehaus.jackson.annotate.JsonIgnore;

public class Comment {
	private long id;
	private String guestUsername;
	private long apartmentId;
	private String text;
	private Grade grade;
	@JsonIgnore
	private User guest;
	@JsonIgnore
	private Apartment apartment;
	private Boolean show;

	
	
	public Comment() {
		super();
		this.id = 0;
		this.guest = new User();
		this.apartment = new Apartment();
		this.text = "";
		this.grade = Grade.ONE;
		this.apartmentId=-1;
		this.guestUsername="";
		this.show = true;
	}
	
	public Comment(long id, User guest, Apartment apartment, String text, Grade grade, Boolean show) {
		super();
		this.id = id;
		this.guest = guest;
		this.apartment = apartment;
		this.text = text;
		this.grade = grade;
		this.guestUsername = guest.getUsername();
		this.apartmentId = apartment.getId();
		this.show = show;
	}
	
	public String getGuestUsername() {
		return guestUsername;
	}

	public Boolean getShow() {
		return show;
	}

	public void setShow(Boolean show) {
		this.show = show;
	}

	public void setGuestUsername(String guestUsername) {
		this.guestUsername = guestUsername;
	}

	public long getApartmentId() {
		return apartmentId;
	}

	public void setApartmentId(long apartmentId) {
		this.apartmentId = apartmentId;
	}

	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id= id;
	}
	
	public User getGuest() {
		return guest;
	}
	public void setGuest(User guest) {
		this.guest = guest;
	}
	public Apartment getApartment() {
		return apartment;
	}
	public void setApartment(Apartment apartment) {
		this.apartment = apartment;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Grade getGrade() {
		return grade;
	}
	public void setGrade(Grade grade) {
		this.grade = grade;
	}

	public boolean IsDeleted() {
		return id==-1;
	}
	public void delete() {
		id=-1;
	}
}
