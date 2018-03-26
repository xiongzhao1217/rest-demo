package com.ivydad.rest.demo.test;

/**
 * 缓存锁配置
 * @author xiongzhao
 * @Date 2017/8/23
 */
public class LockConfig {

    /**
     * 轮询锁的时间(毫秒),当设为0时,若未成功获取锁,返回系统繁忙;当超时时任未获取锁,返回系统繁忙
     */
    private Long timeOut;

    /**
     * key在redis里存在的时间，1000S防止死锁
     */
    private Long expireTime;

    /**
     * 获取锁的轮询间隔,再次尝试获取缓存锁的间隔毫秒数
     */
    private Long pollingInterval;

    private Integer count;

    public LockConfig(){
        this.timeOut = 60 * 1000l;
        this.expireTime = 120 * 1000l;
        this.pollingInterval = 100l;
    }

    public Long getTimeOut() {
        return timeOut;
    }

    public void setTimeOut(Long timeOut) {
        this.timeOut = timeOut;
    }

    public Long getExpireTime() {
        return expireTime;
    }

    public void setExpireTime(Long expireTime) {
        this.expireTime = expireTime;
    }

    public Long getPollingInterval() {
        return pollingInterval;
    }

    public void setPollingInterval(Long pollingInterval) {
        this.pollingInterval = pollingInterval;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
