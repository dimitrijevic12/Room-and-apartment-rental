package beans;

import org.codehaus.jackson.annotate.JsonIgnore;

public class Comment {
	private long id;
	private String guestUsername;
	private String text;
	private Grade grade;
	@JsonIgnore
	private User guest;
	@JsonIgnore
	private Apartment apartment;
	
	public Comment() {
		super();
		this.id = 0;
		this.guest = new User();
		this.apartment = new Apartment();
		this.text = "";
		this.grade = Grade.ONE;
	}
	
	public Comment(long id, User guest, Apartment apartment, String text, Grade grade) {
		super();
		this.id = id;
		this.guest = guest;
		this.apartment = apartment;
		this.text = text;
		this.grade = grade;
		this.guestUsername = guest.getUsername();
	}
	
	public String getGuestUsername() {
		return guestUsername;
	}

	public void setGuestUsername(String guestUsername) {
		this.guestUsername = guestUsername;
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
}
