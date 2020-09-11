package services;

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
import beans.Role;
import beans.User;
import beans.UsernameAndPassword;

@Path("/users")
public class UserService {
	
	@Context
	ServletContext ctx;
	
	public UserService() {
		
	}
	
	@PostConstruct
	public void init() {
		if(ctx.getAttribute("userDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
	}
	
	private void initApartmentDAO() {
		if(ctx.getAttribute("apartmentDAO") == null) { //TODO da li ovo treba ovde?
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("apartmentDAO", new ApartmentDAO(contextPath));
		}
	}
	
	private void initReservationDAO() {
		if(ctx.getAttribute("reservationDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("reservationDAO", new ReservationDAO(contextPath));
		}
	}
	
	private void initCommentDAO() {
		if(ctx.getAttribute("commentDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("commentDAO", new CommentDAO(contextPath));
		}
	}
	
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<User> getUsers(){
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		return dao.getAll();
	}
	
	@GET
	@Path("/toRent/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Apartment> getApartmentsToRent(@PathParam("username") String username){
		initApartmentDAO();
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		return dao.getApartmentsToRent(username, apartmentDAO);
	}
	
	@GET
	@Path("/rented/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Apartment> getRentedApartments(@PathParam("username") String username){
		initReservationDAO();
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		return dao.getRentedApartments(username, reservationDAO);
	}
	
	@GET
	@Path("/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	
	public User findOne(@PathParam("username") String username) {
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		return dao.getUserByUsername(username);
	}
	
	@GET
	@Path("/guests/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<User> getAllGuestsForHost(@PathParam("username") String hostUsername){
		initApartmentDAO();
		initReservationDAO();
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");		
		Collection<Long> apartmentsIds = apartmentDAO.getApartmentsIdsFromHost(hostUsername);
		return reservationDAO.getGuestsFromApartments(apartmentsIds, dao);
	}
	
	@POST
	@Path("/write")
	@Produces(MediaType.APPLICATION_JSON)
	public void test(String contextpath){
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		dao.write();
	}
	
	@DELETE
	@Path("/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	
	public User delete(@PathParam("username") String username) {
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		User user = findOne(username);
		if(user.getRole().equals(Role.HOST)) {
			initApartmentDAO();
			ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
			apartmentDAO.deleteHost(username);
		}
		else if(user.getRole().equals(Role.GUEST)) {
			initCommentDAO();
			initReservationDAO();
			ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
			CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("commentDAO");
			reservationDAO.deleteGuest(username);
			commentDAO.deleteUser(username);
		}
		return dao.delete(username);
	}
	
	@POST
	@Path("")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User addUser(User user) {
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		return dao.save(user);
	}
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User loginUser(UsernameAndPassword usernameAndPassword) {
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		return dao.loginUser(usernameAndPassword);
	}
	
	@POST
	@Path("/initialize")
	@Produces(MediaType.APPLICATION_JSON)
	public void initialize() {
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		dao.initilazeFile();
	}
	
	@PUT
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User editUser(User user) {
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		return dao.editUser(user);
	}
}
