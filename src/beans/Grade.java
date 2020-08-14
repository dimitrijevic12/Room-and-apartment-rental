package beans;

public enum Grade {
	ONE(1), TWO(2), THREE(3), FOUR(4), FIVE(5);
	
	Grade(int value){
		this.value = value;
	}
	
	private int value;
	
	public String toString() {
        return Integer.toString(value);
    }
}
