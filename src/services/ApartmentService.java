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

import DAO.ApartmentDAO;
import beans.Apartment;

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
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Apartment> getComments(){
		ApartmentDAO dao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		return dao.getAll();
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	
	public Apartment findOne(@PathParam("id") Long id) {
		ApartmentDAO dao = (ApartmentDAO) ctx.getAttribute("apartmentDAO");
		return dao.findApartment(id);
	}
}
