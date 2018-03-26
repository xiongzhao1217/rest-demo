package com.ivydad.rest.demo.po;

import java.io.Serializable;
import java.util.Date;

public class User implements Serializable {

    private static final long serialVersionUID = -626144164254734337l;

    /** 
     * 
     * @Author  qinquan
    **/
    private Integer id;

    /** 
     * 
     * @Author  qinquan
    **/
    private String userId;

    /** 
     * 
     * @Author  qinquan
    **/
    private String custId;

    /** 
     * 
     * @Author  qinquan
    **/
    private String userName;

    /** 
     * 
     * @Author  qinquan
    **/
    private String userTelephone;

    /** 
     * 
     * @Author  qinquan
    **/
    private String password;

    /** 
     * 
     * @Author  qinquan
    **/
    private String imei;

    /** 
     * 
     * @Author  qinquan
    **/
    private String phoneType;

    /** 
     * 
     * @Author  qinquan
    **/
    private String token;

    /** 
     * 
     * @Author  qinquan
    **/
    private Date createTime;

    /** 
     * 
     * @Author  qinquan
    **/
    private String createUser;

    /** 
     * 
     * @Author  qinquan
    **/
    private Date modifyTime;

    /** 
     * 
     * @Author  qinquan
    **/
    private String modifyUser;

    /** 
     * 
     * @Author  qinquan
    **/
    private String userType;

    /** 
     * 
     * @Author  qinquan
    **/
    private String jpushTag;

    /** 
     * 
     * @Author  qinquan
    **/
    private String discuzUserId;

    /** 
     * 
     * @Author  qinquan
    **/
    private String versionFlag;

    /** 
     * 
     * @Author  qinquan
    **/
    private String discuzUserLevel;

    /** 
     * 
     * @Author  qinquan
    **/
    private String discuzUserScore;

    /** 
     * 
     * @Author  qinquan
    **/
    private String logoUrl;

    /** 
     * 
     * @Author  qinquan
    **/
    private Integer logoVersion;

    /** 
     * 
     * @Author  qinquan
    **/
    private String userNick;

    /** 
     * 
     * @Author  qinquan
    **/
    private String userSex;

    /** 
     * 
     * @Author  qinquan
    **/
    private String uid;

    /** 
     * 
     * @Author  qinquan
    **/
    private String pwdSult;

    /** 
     * 
     * @Author  qinquan
    **/
    private Integer isFrozen;

    /** 
     * 
     * @Author  qinquan
    **/
    private Integer signFailCount;

    /** 
     * 
     * @Author  qinquan
    **/
    private String signupIp;

    /** 
     * 
     * @Author  qinquan
    **/
    private String signupIpAddress;

    /** 
     * 用户加密级别，默认为1，level为2时代表exploiter系统的加密方式
     * @Author  qinquan
    **/
    private Integer pwdLevel;

    /** 
     * 
     * @Author  qinquan
    **/
    private String appVersion;

    /** 
     * 
     * @Author  qinquan
    **/
    private String devicePlatform;

    /** 
     * 
     * @Author  qinquan
    **/
    private String avatarUrl;

    /** 
     * 经度
     * @Author  qinquan
    **/
    private String longitude;

    /** 
     * 维度
     * @Author  qinquan
    **/
    private String latitude;

    /** 
     * 身份类型
     * @Author  qinquan
    **/
    private Integer identityType;

    /** 
     * 对应区号表的id
     * @Author  qinquan
    **/
    private Integer mobilePrefixId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId == null ? null : userId.trim();
    }

    public String getCustId() {
        return custId;
    }

    public void setCustId(String custId) {
        this.custId = custId == null ? null : custId.trim();
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName == null ? null : userName.trim();
    }

    public String getUserTelephone() {
        return userTelephone;
    }

    public void setUserTelephone(String userTelephone) {
        this.userTelephone = userTelephone == null ? null : userTelephone.trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    public String getImei() {
        return imei;
    }

    public void setImei(String imei) {
        this.imei = imei == null ? null : imei.trim();
    }

    public String getPhoneType() {
        return phoneType;
    }

    public void setPhoneType(String phoneType) {
        this.phoneType = phoneType == null ? null : phoneType.trim();
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token == null ? null : token.trim();
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser == null ? null : createUser.trim();
    }

    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }

    public String getModifyUser() {
        return modifyUser;
    }

    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser == null ? null : modifyUser.trim();
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType == null ? null : userType.trim();
    }

    public String getJpushTag() {
        return jpushTag;
    }

    public void setJpushTag(String jpushTag) {
        this.jpushTag = jpushTag == null ? null : jpushTag.trim();
    }

    public String getDiscuzUserId() {
        return discuzUserId;
    }

    public void setDiscuzUserId(String discuzUserId) {
        this.discuzUserId = discuzUserId == null ? null : discuzUserId.trim();
    }

    public String getVersionFlag() {
        return versionFlag;
    }

    public void setVersionFlag(String versionFlag) {
        this.versionFlag = versionFlag == null ? null : versionFlag.trim();
    }

    public String getDiscuzUserLevel() {
        return discuzUserLevel;
    }

    public void setDiscuzUserLevel(String discuzUserLevel) {
        this.discuzUserLevel = discuzUserLevel == null ? null : discuzUserLevel.trim();
    }

    public String getDiscuzUserScore() {
        return discuzUserScore;
    }

    public void setDiscuzUserScore(String discuzUserScore) {
        this.discuzUserScore = discuzUserScore == null ? null : discuzUserScore.trim();
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl == null ? null : logoUrl.trim();
    }

    public Integer getLogoVersion() {
        return logoVersion;
    }

    public void setLogoVersion(Integer logoVersion) {
        this.logoVersion = logoVersion;
    }

    public String getUserNick() {
        return userNick;
    }

    public void setUserNick(String userNick) {
        this.userNick = userNick == null ? null : userNick.trim();
    }

    public String getUserSex() {
        return userSex;
    }

    public void setUserSex(String userSex) {
        this.userSex = userSex == null ? null : userSex.trim();
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid == null ? null : uid.trim();
    }

    public String getPwdSult() {
        return pwdSult;
    }

    public void setPwdSult(String pwdSult) {
        this.pwdSult = pwdSult == null ? null : pwdSult.trim();
    }

    public Integer getIsFrozen() {
        return isFrozen;
    }

    public void setIsFrozen(Integer isFrozen) {
        this.isFrozen = isFrozen;
    }

    public Integer getSignFailCount() {
        return signFailCount;
    }

    public void setSignFailCount(Integer signFailCount) {
        this.signFailCount = signFailCount;
    }

    public String getSignupIp() {
        return signupIp;
    }

    public void setSignupIp(String signupIp) {
        this.signupIp = signupIp == null ? null : signupIp.trim();
    }

    public String getSignupIpAddress() {
        return signupIpAddress;
    }

    public void setSignupIpAddress(String signupIpAddress) {
        this.signupIpAddress = signupIpAddress == null ? null : signupIpAddress.trim();
    }

    public Integer getPwdLevel() {
        return pwdLevel;
    }

    public void setPwdLevel(Integer pwdLevel) {
        this.pwdLevel = pwdLevel;
    }

    public String getAppVersion() {
        return appVersion;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion == null ? null : appVersion.trim();
    }

    public String getDevicePlatform() {
        return devicePlatform;
    }

    public void setDevicePlatform(String devicePlatform) {
        this.devicePlatform = devicePlatform == null ? null : devicePlatform.trim();
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl == null ? null : avatarUrl.trim();
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude == null ? null : longitude.trim();
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude == null ? null : latitude.trim();
    }

    public Integer getIdentityType() {
        return identityType;
    }

    public void setIdentityType(Integer identityType) {
        this.identityType = identityType;
    }

    public Integer getMobilePrefixId() {
        return mobilePrefixId;
    }

    public void setMobilePrefixId(Integer mobilePrefixId) {
        this.mobilePrefixId = mobilePrefixId;
    }
}