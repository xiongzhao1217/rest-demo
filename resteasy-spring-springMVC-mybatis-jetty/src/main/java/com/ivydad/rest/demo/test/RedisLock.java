package com.ivydad.rest.demo.test;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;

/**
 * 基于redis的setNX的缓存锁
 * @author xiongzhao
 * @Date 2017/8/21
 */
public class RedisLock {

    private static Logger logger = LoggerFactory.getLogger(RedisLock.class);

    /**spring-data-redis的redisTemplate**/
    @Resource
    private RedisTemplate redisTemplate;

    /**key在redis里存在的时间的默认值**/
    private static final long DEFAULT_TIMEOUT = 60 * 1000l;

    /**锁超时时间默认值**/
    private static final long EDFAULT_EXPIRE_TIME = 120 * 1000L;

    /**再次尝试获取缓存锁的间隔毫秒数默认值**/
    private static final long DEFAULT_POLLING_INTERVAL = 100l;

    /**rediskey前缀**/
    private static final String DEFAULT_KEY_PREFIX = "REDIS_LOCK_KEY_UUID_";

    /**轮询锁的时间(毫秒),当设为0时,若未成功获取锁,返回系统繁忙;当超时时任未获取锁,返回系统繁忙**/
    private Long timeOut;

    /**key在redis里存在的时间，1000S防止死锁**/
    private Long expireTime;

    /**获取锁的轮询间隔,再次尝试获取缓存锁的间隔毫秒数**/
    private Long pollingInterval;

    public RedisLock(){

    }

    /**
     * 构造方法
     * @param redisTemplate
     * @param timeOut
     * @param expireTime
     * @param pollingInterval
     */
    public RedisLock(RedisTemplate redisTemplate, Long timeOut, Long expireTime, Long pollingInterval) {
        this.redisTemplate = redisTemplate;
        this.timeOut = timeOut;
        this.expireTime = expireTime;
        this.pollingInterval = pollingInterval;
    }

    private String get(final String key) {
        Object obj = null;
        try {
            obj = redisTemplate.execute(new RedisCallback<Object>() {
                @Override
                public Object doInRedis(RedisConnection connection) throws DataAccessException {
                    StringRedisSerializer serializer = new StringRedisSerializer();
                    byte[] data = connection.get(serializer.serialize(key));
                    connection.close();
                    if (data == null) {
                        return null;
                    }
                    return serializer.deserialize(data);
                }
            });
        } catch (Exception e) {
            logger.error("get redis error, key : {}", key);
        }
        return obj != null ? obj.toString() : null;
    }

    private boolean setNX(final String key, final String value, long expireTime) {
        Object obj = null;
        try {
            obj = redisTemplate.execute(new RedisCallback<Object>() {
                @Override
                public Object doInRedis(RedisConnection connection) throws DataAccessException {
                    StringRedisSerializer serializer = new StringRedisSerializer();
                    Boolean success = connection.setNX(serializer.serialize(key), serializer.serialize(value));
                    connection.expire(serializer.serialize(key),expireTime);
                    connection.close();
                    return success;
                }
            });
        } catch (Exception e) {
            logger.error("setNX redis error, key : {}"+e.getMessage(), e);
        }
        return obj != null ? (Boolean) obj : false;
    }

    private String getSet(final String key, final String value) {
        Object obj = null;
        try {
            obj = redisTemplate.execute(new RedisCallback<Object>() {
                @Override
                public Object doInRedis(RedisConnection connection) throws DataAccessException {
                    StringRedisSerializer serializer = new StringRedisSerializer();
                    byte[] ret = connection.getSet(serializer.serialize(key), serializer.serialize(value));
                    connection.close();
                    return serializer.deserialize(ret);
                }
            });
        } catch (Exception e) {
            logger.error("setNX redis error, key : {}", key);
        }
        return obj != null ? (String) obj : null;
    }

    /**
     * 获得 lock.
     * 实现思路: 主要是使用了redis 的setnx命令,缓存了锁.
     * reids缓存的key是锁的key,所有的共享, value是锁的到期时间(注意:这里把过期时间放在value了,没有时间上设置其超时时间)
     * 执行过程:
     * 1.通过setnx尝试设置某个key的值,成功(当前没有这个锁)则返回,成功获得锁
     * 2.若第1步没有获取锁,则不断尝试轮询获取锁,如果过了超时时间仍然没有获取锁,则返回false(因此在使用时应根据具体业务,合理设置timeout的值,避免出现返回false的情况)
     * 标注:方法使用synchronized修饰的目的:当并发很高时,把压力放在业务系统,而不全部放在redis
     * @return true/false
     * @throws InterruptedException in case of thread interruption
     * @author xiongzhao
     */
    public synchronized boolean lock(String lockKey,LockConfig config){

        if(StringUtils.isEmpty(lockKey)){
            throw new RuntimeException("缓存锁的KEY不能为空!");
        }

        lockKey = DEFAULT_KEY_PREFIX + lockKey;

        /**1.redis配置初始化**/
        if(config == null){
            config = new LockConfig();
            if(this.getTimeOut() != null){
                config.setTimeOut(this.getTimeOut());
            }else {
                config.setTimeOut(RedisLock.DEFAULT_TIMEOUT);
            }

            if(this.getExpireTime() != null){
                config.setExpireTime(this.getExpireTime());
            }else {
                config.setExpireTime(RedisLock.EDFAULT_EXPIRE_TIME);
            }

            if(this.getPollingInterval() != null){
                config.setPollingInterval(this.getPollingInterval());
            }else {
                config.setPollingInterval(RedisLock.DEFAULT_POLLING_INTERVAL);
            }

        }

        /**2.尝试轮询获取缓存锁**/
        long beginTime = System.currentTimeMillis();

        long nowTime = beginTime;

        while (beginTime + config.getTimeOut() >= nowTime) {
            if (this.setNX(lockKey, "", config.getExpireTime()/1000)) {
                return true;
            }

            System.out.println(config.getCount()+"号线程:轮询获取锁中...");

            try {
                Thread.sleep(config.getPollingInterval());
            }catch (Exception e){
                logger.error(e.getMessage(),e);
            }

            nowTime = System.currentTimeMillis();

        }
        return false;
    }

    /**
     * 获得 lock.
     * 实现思路: 主要是使用了redis 的setnx命令,缓存了锁.
     * reids缓存的key是锁的key,所有的共享, value是锁的到期时间(注意:这里把过期时间放在value了,没有时间上设置其超时时间)
     * 执行过程:
     * 1.通过setnx尝试设置某个key的值,成功(当前没有这个锁)则返回,成功获得锁
     * 2.若第1步没有获取锁,则不断尝试轮询获取锁,如果过了超时时间仍然没有获取锁,则返回false(因此在使用时应根据具体业务,合理设置timeout的值,避免出现返回false的情况)
     * 标注:方法使用synchronized修饰的目的:当并发很高时,把压力放在业务系统,而不全部放在redis
     * @return true/false
     * @throws InterruptedException in case of thread interruption
     * @author xiongzhao
     */
    public boolean lock(String lockKey){
        lockKey = DEFAULT_KEY_PREFIX + lockKey;
        return lock(lockKey,null);
    }


    /**
     * 释放锁
     * @param lockKey
     * @author xiongzhao
     */
    public Long unlock(String lockKey) {
        lockKey = DEFAULT_KEY_PREFIX + lockKey;

        final String key = lockKey;
        Object obj = redisTemplate.execute(new RedisCallback<Object>() {
            @Override
            public Object doInRedis(RedisConnection connection) throws DataAccessException {
                StringRedisSerializer serializer = new StringRedisSerializer();
//                boolean b = connection.expire(serializer.serialize(key),0);
                Long b = connection.del(serializer.serialize(key));
                connection.close();
                return b;
            }
        });

        return (Long)obj;
//        redisTemplate.expire(lockKey,0, TimeUnit.SECONDS);
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

    public RedisTemplate getRedisTemplate() {
        return redisTemplate;
    }

    public void setRedisTemplate(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
}
