package com.ivydad.rest.demo.service.impl;

import com.ivydad.rest.demo.po.Goods;
import com.ivydad.rest.demo.service.GoodsService;
import com.ivydad.rest.demo.test.CacheLock;
import com.ivydad.rest.demo.test.LockedComplexObject;
import com.ivydad.rest.demo.test.LockedObject;
import org.springframework.stereotype.Service;

/**
 * @author xiongzhao
 * @Date 2017/7/27
 */
@Service
public class GoodsServiceImpl implements GoodsService {

    private static int success = 0;

    @Override
    @CacheLock(lockedPrefix="REDIS_KEY_")
    public Goods reduceStock(String uuid, @LockedComplexObject(field = "uuid") Goods goods) {
        System.out.println(goods.getId()+"号线程:开始执行业务方法...");
        goods.setStock(goods.getStock() - 1);
        try {
            Thread.sleep(5000l);
        }catch (Exception e){

        }
        success++;
//        System.out.println("剩余库存:" + goods.getStock());
//        System.out.println("成功执行:"+success+"次");
        return goods;
    }



    @Override
    @CacheLock(lockedPrefix="REDIS_KEY_")
    public void reduceStock2(@LockedObject String uuid) {
        System.out.println("剩余库存:" + 88);
    }

    @Override
    public void reduceStock3(Integer a) {
        System.out.println("a===="+a);
    }
}
