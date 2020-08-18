package DAO;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.Collection;
import java.util.HashMap;
import java.util.StringTokenizer;

import beans.Apartment;
import beans.Comment;
import beans.Grade;
import beans.User;
import DAO.UserDAO;

public class CommentDAO {
	
	private HashMap<Long, Comment> comments = new HashMap<Long, Comment>();

	public CommentDAO(String contextPath) {
		loadComments(contextPath);
	}
	
	private void loadComments(String contextPath) {
		BufferedReader in = null;
		try {
			File file = new File(contextPath + "repositories/comments.txt");
			in = new BufferedReader(new FileReader(file));
			String line;
			StringTokenizer st;
			while((line = in.readLine()) != null) {
				line = line.trim();
				if (line.equals("") || line.indexOf('#') == 0)
					continue;
				st = new StringTokenizer(line, ";");
				while(st.hasMoreTokens()) {
					String idString = st.nextToken().trim();
					String username = st.nextToken().trim();
					String apartmentId = st.nextToken().trim();
					String text = st.nextToken().trim();
					String gradeString = st.nextToken().trim();
/*					StringTokenizer st2 = new StringTokenizer(line, ",");
					while(st.hasMoreTokens()) {
						String apartmentsToRentIdString = st.nextToken();
					}
					st2 = new StringTokenizer(line, ",");
					while(st.hasMoreTokens()) {
						String rentedApartmentsIdString = st.nextToken();
					}
*/
					long id = Long.parseLong(idString);
					User user = new UserDAO(contextPath).getUserByUsername(username);
					Grade grade = Grade.valueOf(gradeString);
					comments.put(id, new Comment(id, user, new Apartment(), text, grade));
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
	
	public Collection<Comment> getAll(){
		return comments.values();
	}
	
	public Comment findComment(long id) {
		return comments.containsKey(id)? comments.get(id): null;
	}

}
