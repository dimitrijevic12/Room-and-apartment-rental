package DAO;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import beans.Apartment;
import beans.Comment;
import beans.User;

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
	
	public Collection<Comment> findCommentsByApartment(long id) {
		List<Comment> comments = new ArrayList<Comment>();
		for(Comment comment : findAllUndeleted()) {
			if(comment.getApartmentId() == id) {
				comments.add(comment);
			}
		}
		
		return comments;
	}
	
	public Comment save(Comment comment) {
		long maxId = -1;
		for(long id : comments.keySet()) {
			if(comments.get(id).getId()==-1) break;
			if(maxId<id) maxId=id;
		}
		maxId++;
		comment.setId(maxId);
		comments.put(comment.getId(),comment);
		write();
		return comment;
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
	
	public void deleteUser(String username) {
		for(Long commentId : comments.keySet()) {
			Comment comment = comments.get(commentId);
			if(comment.IsDeleted()) continue;
			
			if(comment.getGuestUsername().equals(username)) {
				delete(comment.getId());
			}
				
		}
	}
	
	public void deleteCommentForApartment(long apartmentId) {
		for(long commentId : comments.keySet()) {
			Comment comment = comments.get(commentId);
			if(comment.IsDeleted()) continue;
			
			if(comment.getApartmentId()==apartmentId)
				comment.delete();
		}
		write();
	}
	
	public void toggleComment(Comment comment){
		for(long commentId : comments.keySet()) {
			Comment com = comments.get(commentId);
			if(comment.getId() == commentId) {
				if(com.getShow() == true) {
					com.setShow(false);
				}else {
					com.setShow(true);
				}
			}
		}
		write();
	}
	
	public Collection<Comment> getAllShown(long id){
		Collection<Comment> temp = findCommentsByApartment(id);
		List<Comment> result = new ArrayList<Comment>();
		for(Comment com: temp) {
			if(com.getShow() == true) result.add(com);
		}
		return result;
	}
	
	public void initilazeFile(List<User> users,List<Apartment> aps) {
/*		Comment c1 = new Comment(0,users.get(0),aps.get(0),"Htela bih da pohvalim prijatan ambijent sa puno biljaka",Grade.FIVE);
		Comment c2 = new Comment(1,users.get(1),aps.get(0),"Nisu mi dozvolili da uvedem kuce",Grade.TWO);
		Comment c3 = new Comment(2,users.get(2),aps.get(1),"nisu me pustili",Grade.ONE);
		Comment c4 = new Comment(3,users.get(2),aps.get(0),"Primimli su me i oni i komsinka ;)",Grade.FIVE);
*/		
		HashMap<Long, Comment> commentsFake = new HashMap<Long, Comment>();
/*		commentsFake.put(c1.getId(),c1);
		commentsFake.put(c2.getId(),c2);
		commentsFake.put(c3.getId(),c3);
		commentsFake.put(c4.getId(),c4);
*/		ObjectMapper mapper = new ObjectMapper();
		try {
			mapper.writeValue(Paths.get(path).toFile(), commentsFake);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
