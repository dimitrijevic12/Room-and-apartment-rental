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

import DAO.CommentDAO;
import beans.Comment;

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
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Comment> getComments(){
		CommentDAO dao = (CommentDAO) ctx.getAttribute("commentDAO");
		return dao.getAll();
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	
	public Comment findOne(@PathParam("id") Long id) {
		CommentDAO dao = (CommentDAO) ctx.getAttribute("commentDAO");
		return dao.findComment(id);
	}
	
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public void test() {
		CommentDAO dao = (CommentDAO) ctx.getAttribute("commentDAO");
		String contextPath = ctx.getRealPath("");
		dao.write(contextPath);
	}
}
