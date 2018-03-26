package com.ivydad.rest.demo.test;

import java.lang.annotation.*;

/**
 * 用于注解会产生并发问题的方法
 * @author xiongzhao
 * @Date 2017/7/27
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface CacheLock {

    /**
     * redis 锁key的前缀
     */
    String lockedPrefix() default "";

    /**
     * 轮询锁的时间(毫秒),当设为0时,若未成功获取锁,返回系统繁忙,当超时时任未获取锁,返回系统繁忙
     */
    long timeOut() default 10000;

    /**
     * key在redis里存在的时间，1000S防止死锁
     */
    long expireTime() default 120 * 1000;

    /**
     * 获取锁的轮询间隔,再次尝试获取缓存锁的间隔毫秒数
     */
     long pollingInterval() default 100;


}
