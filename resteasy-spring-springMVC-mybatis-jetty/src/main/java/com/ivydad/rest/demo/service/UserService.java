package com.ivydad.rest.demo.service;

import com.ivydad.rest.demo.po.User;

/**
 * @author xiongzhao
 * @Date 2017/6/26
 */
public interface UserService {

    /**
     * 手机号查询用户信息
     * @param userTelephone
     * @return
     */
    User queryMemberList(String userTelephone);
}
