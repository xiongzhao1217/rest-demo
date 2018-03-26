package com.ivydad.rest.demo.controller;

import com.ivydad.rest.demo.po.Goods;
import com.ivydad.rest.demo.service.GoodsService;
import com.ivydad.rest.demo.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

/**
 * SpringMVC控制器
 * @param
 * @author xiongzhao
 * return
 */
@Controller
@RequestMapping(value = {"/mvc"})
public class UserController{

    Logger log = LoggerFactory.getLogger(UserController.class);

    public static int a = 0;

    @Resource
    UserService userService;

    @Resource
    GoodsService goodsService;

    /**
     * 登录页面的逻辑，此处是跳转到布客网的SSO
     * 单点登录系统
     * @param model
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = {"/user"}, method = {RequestMethod.GET, RequestMethod.POST})
    public String login(ModelMap model, HttpServletRequest request, HttpServletResponse response) {

        model.put("user", userService.queryMemberList("18910085408"));
        model.put("nowTime", new Date());
        return "/home";
    }



    @RequestMapping(value = {"/goods"}, method = {RequestMethod.GET, RequestMethod.POST})
    public String goods(ModelMap model, HttpServletRequest request, HttpServletResponse response) {

        a++;

        Goods goods = new Goods();

        goods.setId(a);

        goods.setGoodsName("明贵在偷笑");
        goods.setUuid("fgtd5g4sd4frew4rtfg56df7f");
        goods.setStock(100);
        System.out.println(a+"号线程:进入到controller中...");
        goodsService.reduceStock(goods.getUuid(), goods);
//        goodsService.reduceStock2("xiongzhaouuid");
//        goodsService.reduceStock3(5);

        model.put("user", userService.queryMemberList("18910085408"));
        model.put("nowTime", new Date());
        return "/home";
    }

}
