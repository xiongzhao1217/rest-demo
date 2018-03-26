package com.ivydad.rest.demo.resource;

import java.util.Optional;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.annotation.Resource;

import com.ivydad.rest.demo.po.User;
import com.ivydad.rest.demo.service.UserService;
import org.springframework.stereotype.Controller;

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
    @Produces("application/json")
    public User  getUser(@PathParam("telephone") String telephone) {

        System.out.println("------------------spring+restEasyServlet接收到请求....");
        Optional<User> user = Optional.ofNullable(userService.queryMemberList(telephone));
        System.out.println("------------------spring+restEasyServlet请求处理完毕!");
        return user.orElse(new User());
    }



}
