package com.ivydad.rest.demo.resource;

import java.util.Optional;
import javax.ws.rs.*;
import javax.annotation.Resource;
import javax.ws.rs.core.MediaType;

import com.ivydad.rest.demo.po.User;
import com.ivydad.rest.demo.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;

/**
 * resteasy资源管理
 * @param
 * @author xiongzhao
 * return
 */
@Path("/rest")
@Controller
public class RestResource {

    @Resource
    UserService userService;

    @GET
    @Path(value = "user/{telephone}")
    @Produces(MediaType.APPLICATION_JSON)
    public User  getUser(@PathParam("telephone") String telephone) {

        System.out.println("----------------springMVC控制器接收到请求....");
        Optional<User> user = Optional.ofNullable(userService.queryMemberList(telephone));
        System.out.println("----------------springMVC控制器处理请求完毕!");
        return user.orElse(new User());
    }
}
