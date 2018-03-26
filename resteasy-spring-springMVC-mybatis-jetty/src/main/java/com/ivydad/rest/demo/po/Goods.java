package com.ivydad.rest.demo.po;

/**
 * @author xiongzhao
 * @Date 2017/7/27
 */
public class Goods {

    /**
     * 商品id
     */
    private Integer id;

    /**
     * 商品uuid
     */
    private String uuid;

    /**
     * 商品名称
     */
    private String goodsName;

    /**
     * 商品库存
     */
    private Integer stock;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
