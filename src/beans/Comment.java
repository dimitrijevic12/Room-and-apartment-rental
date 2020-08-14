package beans;

public class Comment {
	private User guest;
	private Apartment apartment;
	private String text;
	private Grade grade;
	
	public Comment() {
		super();
		this.guest = new User();
		this.apartment = new Apartment();
		this.text = "";
		this.grade = Grade.ONE;
	}
	
	public Comment(User guest, Apartment apartment, String text, Grade grade) {
		super();
		this.guest = guest;
		this.apartment = apartment;
		this.text = text;
		this.grade = grade;
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
}
