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
	private String path;

	public CommentDAO(String contextPath) {
		path = contextPath + "repositories/comments.json";
		loadComments();
	}
	
	
	private void loadComments() {
		try {
			comments = new ObjectMapper().readValue(Paths.get(path).toFile(), new TypeReference<Map<Long, Comment>>() { });
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public Collection<Comment> findAll(){
		return comments.values();
	}
	
	public Collection<Comment> findAllUndeleted(){
		List<Comment> result = new ArrayList<Comment>();
		for(long id: comments.keySet()) {
			if(comments.get(id).getId()!=-1) result.add(comments.get(id));
		}
		return result;
	}
	
	public Comment findComment(long id) {
		return (comments.containsKey(id) && comments.get(id).getId()!=-1)? comments.get(id): null;
	}
	
	
	public void write() {
		ObjectMapper mapper = new ObjectMapper();
		try {
			mapper.writeValue(Paths.get(path).toFile(), comments);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	public Comment delete(long id) {
		if(comments.containsKey(id)) {
			Comment deletedComment = comments.get(id);
			deletedComment.setId(-1);
			write();
			return deletedComment;
		}
		return null;
	}
}
