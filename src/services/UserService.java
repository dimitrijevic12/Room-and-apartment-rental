package services;

import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import DAO.ApartmentDAO;
import DAO.ReservationDAO;
import DAO.UserDAO;
import beans.Apartment;
import beans.User;

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
			//moguce resenje: u konstruktoru userDAO izbaciti load i pozvati je kao posebnu metodu
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
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		if(apartmentDAO == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("apartmentDAO", new ApartmentDAO(contextPath));
			apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		}
		return dao.getApartmentsToRent(username, apartmentDAO);
	}
	
	@GET
	@Path("/rented/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Apartment> getRentedApartments(@PathParam("username") String username){
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		if(reservationDAO == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("reservationDAO", new ReservationDAO(contextPath));
			reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		}
		return dao.getRentedApartments(username, reservationDAO);
	}
	
	@GET
	@Path("/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	
	public User findOne(@PathParam("username") String username) {
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		return dao.getUserByUsername(username);
	}
	
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public void test(String contextpath){
		UserDAO dao = (UserDAO) ctx.getAttribute("userDAO");
		String contextPath = ctx.getRealPath("");
		dao.test(contextPath);
	}
}
