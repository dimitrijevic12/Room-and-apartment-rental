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
import DAO.ReservationDAO;
import DAO.UserDAO;
import beans.Apartment;
import beans.Reservation;
import beans.ReservationStatus;
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
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getReservations(){
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		return dao.getAll();
	}
	
	@GET
	@Path("/withApartment")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getResevationsWithApartment(){
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		initApartmentDAO();
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		
		return dao.getAllWithApartment(apartmentDAO);
	}
	
	@GET
	@Path("/host/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getReservationsForHost(@PathParam("username") String username){
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		initApartmentDAO();
		ApartmentDAO apartmentDao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		
		return dao.getReservationsForHost(username, apartmentDao);
	}
	
	@GET
	@Path("/guest/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Reservation> getReservationForGuest(@PathParam("username") String username){
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		initApartmentDAO();
		ApartmentDAO apartmentDao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		return dao.getReservationForGuest(username, apartmentDao);
	}
	
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	
	public Reservation findOne(@PathParam("id") long id) {
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		initApartmentDAO();
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		return dao.findReservation(id,apartmentDAO);
	}
	
	
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Reservation newReservation(Reservation reservation){
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		return dao.save(reservation);
	}
	
	@POST
	@Path("/initialize")
	@Produces(MediaType.APPLICATION_JSON)
	public void initialize(String contextpath){
		initApartmentDAO();
		initUserDAO();
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		ApartmentDAO apartmentdao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		dao.initilazeFile(new ArrayList<Apartment>(apartmentdao.getAll()), new ArrayList<User>(userDAO.getAllUndeletedRoles(Role.GUEST)));
	}
	
	@PUT
	@Path("{id}/{status}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	
	public Reservation update(@PathParam("id") long id,@PathParam("status") ReservationStatus status) {
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		Reservation result = findOne(id);
		ReservationStatus oldStatus = result.getStatus();
		result.setStatus(status);
		if(status.equals(ReservationStatus.ACCEPTED) ) {
			initApartmentDAO();
			ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
			apartmentDAO.removeAvailableDates(result.getCheckInDate(), result.getNightCount(), result.getApartmentId());
			apartmentDAO.write();
		}else if(oldStatus.equals(ReservationStatus.ACCEPTED) && (status.equals(ReservationStatus.DENIED) || status.equals(ReservationStatus.CANCELED) || status.equals(ReservationStatus.COMPLETED))) {
			initApartmentDAO();
			ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
			apartmentDAO.addAvailableDates(result.getCheckInDate(), result.getNightCount(), result.getApartmentId());
			
			apartmentDAO.write();
		}
		dao.write();
		return result;
	}
	
	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Reservation delete(@PathParam("id") long id) {
		ReservationDAO dao = (ReservationDAO) ctx.getAttribute("reservationDAO");
		return dao.delete(id);
	}
}
