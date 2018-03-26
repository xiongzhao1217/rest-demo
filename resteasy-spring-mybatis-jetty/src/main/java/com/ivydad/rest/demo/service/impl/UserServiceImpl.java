package com.ivydad.rest.demo.service.impl;

import com.ivydad.rest.demo.dao.UserMapper;
import com.ivydad.rest.demo.po.User;
import com.ivydad.rest.demo.service.UserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @author xiongzhao
 * @Date 2017/6/26
 */
@Service
public class UserServiceImpl implements UserService {

    @Resource
    UserMapper userMapper;

    @Override
    public User queryMemberList(String userTelephone) {
        return userMapper.queryMemberList(userTelephone);
    }
}
