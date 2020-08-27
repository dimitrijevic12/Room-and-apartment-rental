package services;

import java.util.ArrayList;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.DELETE;
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
import beans.Reservation;
import beans.Role;
import beans.User;

@Path("/reservations")
public class ReservationService {

	@Context
	ServletContext ctx;
	
	public ReservationService() {
		
	}
	
	@PostConstruct
	public void init() {
		if(ctx.getAttribute("reservationDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("reservationDAO", new ReservationDAO(contextPath));
		}
		if(ctx.getAttribute("apartmentDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("apartmentDAO", new ApartmentDAO(contextPath));
		}
		if(ctx.getAttribute("userDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
			//moguce resenje: u konstruktoru userDAO izbaciti load i pozvati je kao posebnu metodu
		}
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getReservations(){
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		return dao.getAll();
	}
	
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	
	public Reservation findOne(@PathParam("id") long id) {
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		return dao.findReservation(id);
	}
	
	
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public void test(String contextpath){
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		dao.write();
	}
	
	@POST
	@Path("/initialize")
	@Produces(MediaType.APPLICATION_JSON)
	public void initialize(String contextpath){
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		ApartmentDAO apartmentdao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		dao.initilazeFile(new ArrayList<Apartment>(apartmentdao.getAll()), new ArrayList<User>(userDAO.getAllUndeletedRoles(Role.GUEST)));
	}
	
	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Reservation delete(@PathParam("id") long id) {
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		return dao.delete(id);
	}
}
