package DAO;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.Collection;
import java.util.HashMap;
import java.util.StringTokenizer;

import beans.Gender;
import beans.Role;
import beans.User;

public class UserDAO {
	private HashMap<String, User> users = new HashMap<String, User>();

	public UserDAO() {

	}

	public UserDAO(String contextPath) {
		loadUsers(contextPath);
	}
	
	private void loadUsers(String contextPath) {
		BufferedReader in = null;
		try {
			File file = new File(contextPath + "repositories/users.txt");
			in = new BufferedReader(new FileReader(file));
			String line;
			StringTokenizer st;
			while((line = in.readLine()) != null) {
				line = line.trim();
				if (line.equals("") || line.indexOf('#') == 0)
					continue;
				st = new StringTokenizer(line, ";");
				while(st.hasMoreTokens()) {
					String username = st.nextToken().trim();
					String password = st.nextToken().trim();
					String name = st.nextToken().trim();
					String surname = st.nextToken().trim();
					String genderString = st.nextToken().trim();
					String roleString = st.nextToken().trim();
/*					StringTokenizer st2 = new StringTokenizer(line, ",");
					while(st.hasMoreTokens()) {
						String apartmentsToRentIdString = st.nextToken();
					}
					st2 = new StringTokenizer(line, ",");
					while(st.hasMoreTokens()) {
						String rentedApartmentsIdString = st.nextToken();
					}
*/
					users.put(username, new User(username, password, name, surname, Gender.valueOf(genderString), Role.valueOf(roleString)));
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
	
	public Collection<User> getAll(){
		return users.values();
	}
	
	public User getUserByUsername(String username) {
		return users.get(username);
	}
}
