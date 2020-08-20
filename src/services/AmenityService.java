package services;

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

import DAO.AmenityDAO;
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
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Amenity> getAmenities(){
		AmenityDAO dao = (AmenityDAO) ctx.getAttribute("amenitiesDAO");
		return dao.findAll();
	}
	
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public void writeAmenities(){
		AmenityDAO dao = (AmenityDAO) ctx.getAttribute("amenitiesDAO");
		dao.write();
	}

	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Amenity delete(@PathParam("id") long id) {
		AmenityDAO dao = (AmenityDAO) ctx.getAttribute("amenitiesDAO");
		return dao.delete(id);
	}
}
