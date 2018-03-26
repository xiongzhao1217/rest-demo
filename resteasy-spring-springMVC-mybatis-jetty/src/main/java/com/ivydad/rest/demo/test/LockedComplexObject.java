package com.ivydad.rest.demo.test;

import java.lang.annotation.*;

/**
 * 参数级的注解，用于注解自定义类型的参数
 * @author xiongzhao
 * @Date 2017/7/27
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface LockedComplexObject {

    /**
     * 含有成员变量的复杂对象中需要加锁的成员变量，如一个用户账户对象的账号id
     */
    String field() default "uuid";
}
