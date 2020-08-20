package DAO;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import beans.Comment;

public class CommentDAO {
	
	private HashMap<Long, Comment> comments = new HashMap<Long, Comment>();

	public CommentDAO(String contextPath) {
		loadComments(contextPath);
	}
	
	
	private void loadComments(String contextPath) {
		try {
			comments = new ObjectMapper().readValue(Paths.get(contextPath + "repositories/comments.json").toFile(), new TypeReference<Map<String, Comment>>() { });
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
/*private void loadComments(String contextPath) {
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
//					StringTokenizer st2 = new StringTokenizer(line, ",");
//					while(st.hasMoreTokens()) {
//						String apartmentsToRentIdString = st.nextToken();
//					}
//					st2 = new StringTokenizer(line, ",");
//					while(st.hasMoreTokens()) {
//						String rentedApartmentsIdString = st.nextToken();
//					}
//
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
	}*/
	
	public Collection<Comment> getAll(){
		return comments.values();
	}
	
	public Comment findComment(long id) {
		return comments.containsKey(id)? comments.get(id): null;
	}
	
	
	public void firstInsert(String contextPath) {
		ObjectMapper mapper = new ObjectMapper();
		List<Comment> enterComments = new ArrayList<Comment>();
		for(long id : comments.keySet()) {
			enterComments.add(comments.get(id));
		}
		try {
			mapper.writeValue(Paths.get(contextPath + "repositories/comments.json").toFile(), comments);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
}
