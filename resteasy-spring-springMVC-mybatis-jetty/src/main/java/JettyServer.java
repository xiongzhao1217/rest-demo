import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

import java.net.URL;
import java.security.ProtectionDomain;

/**
 * @author xiongzhao
 * @Date 2017/6/27
 */
public class JettyServer {

    @SuppressWarnings("all")
    public static void main(String[] args) throws Exception {

        if(args == null || args.length == 0){
            startRelease();
        }else if("2".equals(args[0])){
            startWebapp();
        }else if("3".equals(args[0])){
            startWar();
        }

    }

    /**
     * 启动部署包
     * @throws Exception
     * @author xionbgzhao
     */
    @SuppressWarnings("all")
    static void startWar() throws Exception{

        Server server = new Server(8180);

        WebAppContext context = new WebAppContext();
        context.setContextPath("/");
        context.setWar("D:\\project\\resteasy-spring-mybatis-jetty.war");
        server.setHandler(context);

        server.start();
        server.join();
    }

    /**
     * 开发过程中使用这个方式启动
     * @throws Exception
     * @author xiongzhao
     */
    @SuppressWarnings("all")
    static void startWebapp() throws Exception{

        Server server = new Server(8280);

        WebAppContext context = new WebAppContext();
//        context.setContextPath("/");
        context.setResourceBase(getWebAppPath());
        context.setParentLoaderPriority(true);
        server.setHandler(context);

        server.start();
        server.join();
    }


    /**
     * 线上部署使用这个方式启动
     * 启动命令:java -jar XXX.war
     * @author xionbgzhao
     * @throws Exception
     */
    @SuppressWarnings("all")
    static void startRelease() throws Exception{

        Integer port=8380;
        Server server=new Server(port);
        ProtectionDomain domain = JettyServer.class.getProtectionDomain();
        URL location = domain.getCodeSource().getLocation();
        WebAppContext webapp = new WebAppContext();
        webapp.setContextPath("/");
        webapp.setWar(location.toExternalForm());
        server.setHandler(webapp);
        server.start();
        server.join();
    }

    /**
     * 获取webApp目录的绝对路径
     * @author xiongzhao
     * @return
     */
    private static String getWebAppPath() {

        String path = JettyServer.class.getResource("/").getFile()
                .replaceAll("/target/(.*)", "")
                + "/src/main/webapp";
        return path;
    }



}
