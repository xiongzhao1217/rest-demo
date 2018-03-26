
------------edit by xiongzhao 2017-06-28---------------

一. 项目集成了spring+springMVC+mybatis,测试url:http://localhost:8080/rest/user/18910085408;http://localhost:8080/restmvc/user/18910085408

二. 项目环境: jdk1.8 + jetty9.2 + spring4.3.7

三. 有六种启动方式

1.加入到jettyServer中启动
注:先下载jetty服务器并配置到intellij中,选择项目即可

2.加入到tomcat方式启动
注:支持jndi以及odbc等数据库连接池方式加载数据源

3.使用maven插件,在项目目录(如resteasy-spring-mybatis-jetty)下运行:mvn jetty:run
注:支持jndi以及odbc等数据库连接池方式加载数据源,
使用jndi需要在WEB-INF下增加jetty-env.xml配置文件,详情见配置文件,同时pom文件需要添加maven插件:jetty-maven-plugin

4.main方法运行war包
注:使用mvn打好war包后运行JettyServer.java类的main方法中的war

5.mian方法运行webapp
注:运行JettyServer.java类的main方法中的webapp

6.直接运行war包
注:使用命令java -jar XXX.war 运行,支持传参



