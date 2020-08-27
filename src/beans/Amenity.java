package beans;

public class Amenity {
	private long id;
	private String name;
	
	public Amenity() {
		super();
		this.id = 0;
		this.name = "";
	}
	public Amenity(long id, String name) {
		super();
		this.id = id;
		this.name = name;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}	
	
	public boolean IsDeleted() {
		return id==-1;
	}
}
