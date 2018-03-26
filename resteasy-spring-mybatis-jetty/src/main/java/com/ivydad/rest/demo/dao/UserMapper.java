package com.ivydad.rest.demo.dao;

import com.ivydad.rest.demo.po.User;

public interface UserMapper {


    /**
     * 手机号查询用户信息
     * @param userTelephone
     * @return
     */
    User queryMemberList(String userTelephone);

}