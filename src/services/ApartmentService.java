package services;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.glassfish.jersey.media.multipart.FormDataParam;

import DAO.AmenityDAO;
import DAO.ApartmentDAO;
import DAO.CommentDAO;
import DAO.ReservationDAO;
import DAO.UserDAO;
import beans.Amenity;
import beans.Apartment;
import beans.Comment;
import beans.Role;
import beans.User;

@Path("/apartments")
public class ApartmentService {
	
	@Context
	ServletContext ctx;
	
	public ApartmentService() {
		
	}
	
	@PostConstruct
	public void init() {
		if(ctx.getAttribute("apartmentDAO") == null) {
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
	
	
	private void initAmenityDAO() {
		if(ctx.getAttribute("amenitiesDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("amenitiesDAO", new AmenityDAO(contextPath));
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
	public Collection<Apartment> getApartments(){
		ApartmentDAO dao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		
		return dao.getAll();
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	
	public Apartment findOne(@PathParam("id") Long id) {
		ApartmentDAO dao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
/*		initAmenityDAO();
		AmenityDAO amenityDao = (AmenityDAO) ctx.getAttribute("amenitiesDAO");
		
		Apartment apartment = dao.findApartment(id);
		List<Amenity> amenities = amenityDao.findAmenitiesById(apartment.getAmenitiesIds());
		apartment.setAmenities(amenities);
*/		
		return dao.findApartment(id);
	}
	
	
	@GET
	@Path("/comments/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Comment> getCommentsByApartment(@PathParam("id") Long id){
		initCommentDAO();
		CommentDAO commentDao = (CommentDAO) ctx.getAttribute("commentDAO");

		return commentDao.findCommentsByApartment(id);
	}
	
	@GET
	@Path("/host/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Apartment> getHostApartments(@PathParam("username") String username){
		ApartmentDAO dao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		return dao.getHostApartments(username);
	}
	
	@GET
	@Path("/active")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Apartment> getActiveApartments(){
		ApartmentDAO dao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		return dao.getActiveApartments();
	}
	
	@POST
	@Path("/initialize")
	@Produces(MediaType.APPLICATION_JSON)
	public void initialize() {
		initAmenityDAO();
		initUserDAO();
		ApartmentDAO dao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		AmenityDAO amenityDAO = (AmenityDAO) ctx.getAttribute("amenitiesDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		dao.initilazeFile(new ArrayList<User>(userDAO.getAllUndeletedRoles(Role.HOST)), new ArrayList<Amenity>(amenityDAO.findAll()));
	}
	
	
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public void test() {
		ApartmentDAO dao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		dao.write();
	}
	
	
	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Apartment delete(@PathParam("id") Long id) {
		initCommentDAO();
		initReservationDAO();
		
		ApartmentDAO dao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("commentDAO");
		ReservationDAO reservationDAO = (ReservationDAO) ctx.getAttribute("reservationDAO");
		
		commentDAO.deleteCommentForApartment(id);
		
		reservationDAO.deleteReservationsForApartment(id);
		
		return dao.delete(id);
	}
	
	@POST
	@Path("/images")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes({MediaType.MULTIPART_FORM_DATA})
	public void uploadImages(@FormDataParam("image") InputStream fileInputStream) throws IOException {
		ApartmentDAO dao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		dao.saveImages(fileInputStream);
	}
	
}
