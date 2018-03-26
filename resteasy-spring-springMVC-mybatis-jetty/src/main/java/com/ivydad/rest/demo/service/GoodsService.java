package com.ivydad.rest.demo.service;


import com.ivydad.rest.demo.po.Goods;
import com.ivydad.rest.demo.test.LockedObject;

/**
 * @author xiongzhao
 * @Date 2017/7/27
 */
public interface GoodsService {

    Goods reduceStock(String uuid,Goods goods);


    void reduceStock2(String uuid);


    void reduceStock3(Integer a);

}
