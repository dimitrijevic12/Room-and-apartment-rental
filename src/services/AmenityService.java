package services;

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

import DAO.AmenityDAO;
import DAO.ApartmentDAO;
import beans.Amenity;


@Path("/amenities")
public class AmenityService {
	
	@Context
	ServletContext ctx;
	
	public AmenityService() {
		
	}
	
	@PostConstruct
	public void init() {
		if(ctx.getAttribute("amenitiesDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("amenitiesDAO", new AmenityDAO(contextPath));
		}
		if(ctx.getAttribute("apartmentDAO") == null) { //TODO da li ovo treba ovde?
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("apartmentDAO", new ApartmentDAO(contextPath));
		}
	}
	@GET
	@Path("/all")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Amenity> getAllAmenities(){
		AmenityDAO dao = (AmenityDAO) ctx.getAttribute("amenitiesDAO");
		return dao.findAll();
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Amenity> getAmenities(){
		AmenityDAO dao = (AmenityDAO) ctx.getAttribute("amenitiesDAO");
		return dao.findAllUndeleted();
	}
	
	@POST
	@Path("/write")
	@Produces(MediaType.APPLICATION_JSON)
	public void writeAmenities(){
		AmenityDAO dao = (AmenityDAO) ctx.getAttribute("amenitiesDAO");
		dao.write();
	}

	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Amenity delete(@PathParam("id") long id) {
		ApartmentDAO apartmentDAO = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		AmenityDAO dao = (AmenityDAO) ctx.getAttribute("amenitiesDAO");
		
		if(dao.findAmenity(id)== null) return null;
		
		apartmentDAO.deleteAmenity(id);
		apartmentDAO.write();
		return dao.delete(id);
	}
	
	@POST
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Amenity newAmenity(Amenity amenity) {
		AmenityDAO dao = (AmenityDAO) ctx.getAttribute("amenitiesDAO");
		return dao.save(amenity);
	}
	
	
	@POST
	@Path("/initialize")
	@Produces(MediaType.APPLICATION_JSON)
	public void initialize() {
		AmenityDAO dao = (AmenityDAO) ctx.getAttribute("amenitiesDAO");
		dao.initilazeFile();
	}
}
