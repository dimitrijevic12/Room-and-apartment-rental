package services;

import java.util.ArrayList;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import DAO.ApartmentDAO;
import DAO.CommentDAO;
import DAO.ReservationDAO;
import DAO.UserDAO;
import beans.Apartment;
import beans.Comment;
import beans.Role;
import beans.User;

@Path("/comments") 
public class CommentService {
	
	@Context
	ServletContext ctx;
	
	public CommentService() {
		
	}
	
	@PostConstruct
	public void init() {
		if(ctx.getAttribute("commentDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("commentDAO", new CommentDAO(contextPath));
		}
	}
	
	private void initApartmentDAO() {
		if(ctx.getAttribute("apartmentDAO") == null) { //TODO da li ovo treba ovde?
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("apartmentDAO", new ApartmentDAO(contextPath));
		}
	}
	
	private void initUserDAO() {
		if(ctx.getAttribute("userDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
	}
	
	private void initReservationDAO() {
		if(ctx.getAttribute("reservationDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("reservationDAO", new ReservationDAO(contextPath));
		}
	}
	
	@GET
	@Path("/all")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Comment> getAllComments(){
		CommentDAO dao = (CommentDAO) ctx.getAttribute("commentDAO");
		return dao.findAll();
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Comment> getComments(){
		CommentDAO dao = (CommentDAO) ctx.getAttribute("commentDAO");
		return dao.findAllUndeleted();
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	
	public Comment findOne(@PathParam("id") Long id) {
		CommentDAO dao = (CommentDAO) ctx.getAttribute("commentDAO");
		return dao.findComment(id);
	}
	
	@POST
	@Path("/write")
	@Produces(MediaType.APPLICATION_JSON)
	public void test() {
		CommentDAO dao = (CommentDAO) ctx.getAttribute("commentDAO");
		dao.write();
	}
	
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Comment addComment(Comment comment) {
		String username = comment.getGuestUsername();
		long apartmentId = comment.getApartmentId();
		
		initUserDAO();
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		User user=userDAO.getUserByUsername(username);
		if(!user.getRole().equals(Role.GUEST)) return null;
		
		initReservationDAO();
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		if(reservationDAO.IsReservationExpired(username, apartmentId)) {
			CommentDAO dao = (CommentDAO) ctx.getAttribute("commentDAO");
			return dao.save(comment);
		}
		return null;
	}
	
	@POST
	@Path("/initialize")
	@Produces(MediaType.APPLICATION_JSON)
	public void initialize(String contextpath){
		initApartmentDAO();
		initUserDAO();
		
		CommentDAO dao = (CommentDAO) ctx.getAttribute("commentDAO");
		ApartmentDAO apartmentdao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		dao.initilazeFile(new ArrayList<User>(userDAO.getAllUndeletedRoles(Role.GUEST)), new ArrayList<Apartment>(apartmentdao.getAll()));
	}
	
	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Comment delete(@PathParam("id") long id) {
		initApartmentDAO();
		CommentDAO dao = (CommentDAO) ctx.getAttribute("commentDAO");
		
		if(dao.findComment(id)== null) return null;
		return dao.delete(id);
	}
	
	@PUT
	@Path("/toggleComment")
	@Produces(MediaType.APPLICATION_JSON)
	public void toggleComment(Comment comment) {
		CommentDAO dao = (CommentDAO) ctx.getAttribute("commentDAO");
		dao.toggleComment(comment);
	}
}
