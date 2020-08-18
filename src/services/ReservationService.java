package services;

import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import DAO.CommentDAO;
import DAO.ReservationDAO;
import DAO.UserDAO;
import beans.Comment;
import beans.Reservation;
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
}
