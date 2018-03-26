package com.ivydad.rest.demo.test;

import java.lang.annotation.*;

/**
 * 参数级的注解，用于注解用户账号id等需要线性变更的参数
 * @author xiongzhao
 * @Date 2017/7/27
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface LockedObject {

    //不需要值
}
