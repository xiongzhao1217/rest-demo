package com.ivydad.rest.demo.aspect;

import com.ivydad.rest.demo.po.Goods;
import com.ivydad.rest.demo.test.*;
import org.apache.http.client.utils.DateUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Date;

/**
 * 使用spring切面记录api接口日志
 * @author xiongzhao
 * @Date 2017/7/31
 */
@Component
@Aspect
public class RedisLockAspect {

    private  static  final Logger logger = LoggerFactory.getLogger(RedisLockAspect.class);

    @Resource(name = "redisLock")
    RedisLock redisLock;

    /**
     * 申明切入点
     * 此方法的名称需要在各个通知(前置/环绕/后置等)的注解中配置
     */
    @Pointcut("execution (* com.ivydad.rest.demo.service.GoodsService.*(..))")
    private void apiPointCut() {
    }

    //配置controller环绕通知,使用在方法aspect()上注册的切入点
    @Around(value = "apiPointCut()&&@annotation(cacheLock)")
    public Object around(JoinPoint joinPoint, CacheLock cacheLock){

        long startTime = System.currentTimeMillis();

        Object resultValue = null;

        try {

            //获取方法参数
            Object[] arguments = joinPoint.getArgs();

            Goods goods = (Goods) arguments[1];


            /**2获取方法的注解**/
            MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();

            Method method = methodSignature.getMethod();

            Annotation[][] paramAnnotations = method.getParameterAnnotations();

            Object lockedObject = getLockedObject(paramAnnotations,arguments);

            if(StringUtils.isEmpty(lockedObject)){
                throw new RuntimeException("缓存锁的KEY不能为空!");
            }

            String lockKey = cacheLock.lockedPrefix() + lockedObject.toString();

            System.out.println(goods.getId()+"号线程:进入到切面中...");

            /**3.获取redisLock**/
            LockConfig config = new LockConfig();
            config.setTimeOut(cacheLock.timeOut());
            config.setExpireTime(cacheLock.expireTime());
            config.setPollingInterval(cacheLock.pollingInterval());
            config.setCount(goods.getId());
            if(redisLock.lock(lockKey,config)){
                System.out.println(goods.getId()+"号线程:获取锁时间:"+ DateUtils.formatDate(new Date(),"yyyy-MM-dd HH:mm:ss"));
                /**4.执行具体方法**/
                try {
                    resultValue = ((ProceedingJoinPoint) joinPoint).proceed();
                }catch (Exception e){
                    throw new RuntimeException(e.getMessage(),e);
                }finally {
                    /**5.执行完毕释放锁**/
                    Long l = redisLock.unlock(lockKey);
                    System.out.println(goods.getId()+"号线程:处理完成:"+l+"次!处理完毕时间:"+ DateUtils.formatDate(new Date(),"yyyy-MM-dd HH:mm:ss"));
                }
            }else {
                System.out.println("============等待锁超时!");
            }

        } catch (Throwable e) {
            e.printStackTrace();
        }

        return resultValue;
    }



    private Object getLockedObject(Annotation[][] annotations,Object[] args) throws IllegalAccessException,NoSuchFieldException{
        if(null == args || args.length == 0){
            throw new RuntimeException("方法参数为空，没有被锁定的对象");
        }

        if(null == annotations || annotations.length == 0){
            throw new RuntimeException("没有被注解的参数");
        }
        //不支持多个参数加锁，只支持第一个注解为lockedObject或者lockedComplexObject的参数
        for(int i = 0;i < annotations.length;i++){
            for(int j = 0;j < annotations[i].length;j++){
                /**匹配LockedComplexObject注解**/
                if(annotations[i][j] instanceof LockedComplexObject){//注解为LockedComplexObject
                    try {
                        String fieldName = ((LockedComplexObject)annotations[i][j]).field();

                        Object obj = args[i];

                        Field field = obj.getClass().getDeclaredField(fieldName);

                        // 这里设置访问权限为true
                        field.setAccessible(true);

                        Object a = field.get(obj);

                        return a;
                    } catch ( SecurityException | IllegalAccessException  e) {
                        throw new RuntimeException("注解对象中没有该属性" + ((LockedComplexObject)annotations[i][j]).field());
                    }
                }
                /**匹配LockedObject注解**/
                if(annotations[i][j] instanceof LockedObject){
                    return args[i];
                }
            }
        }

        /**没有匹配到注解返回错误信息**/
        throw new RuntimeException("请指定被锁定参数");
    }



}
