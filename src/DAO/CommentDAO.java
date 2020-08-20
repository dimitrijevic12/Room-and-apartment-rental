package DAO;

import java.nio.file.Paths;
import java.util.Collection;
import java.util.HashMap;
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
			comments = new ObjectMapper().readValue(Paths.get(contextPath + "repositories/comments.json").toFile(), new TypeReference<Map<Long, Comment>>() { });
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public Collection<Comment> getAll(){
		return comments.values();
	}
	
	public Comment findComment(long id) {
		return comments.containsKey(id)? comments.get(id): null;
	}
	
	
	public void write(String contextPath) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			mapper.writeValue(Paths.get(contextPath + "repositories/comments.json").toFile(), comments);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
}
