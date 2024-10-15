<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html>
        <head>
            <title>Shopping Cart</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    padding: 20px;
                }
                h1, h2 {
                    color: #333;
                }
                input[type="text"], button {
                    padding: 10px;
                    margin-top: 10px;
                }
                ul {
                    list-style-type: none;
                }
                li {
                    background-color: #fff;
                    padding: 10px;
                    margin-bottom: 8px;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <h1>SHOPPING CART</h1>
            <h2>FIRSTNAME: <span><xsl:value-of select="cart/customer/fname"/></span></h2>
            <h2>LASTNAME: <span><xsl:value-of select="cart/customer/lname"/></span></h2>
            <h2>PHONENUMBER: <span><xsl:value-of select="cart/customer/phoneno"/></span></h2>
            <h2>ADDRESS: <span><xsl:value-of select="cart/customer/address"/></span></h2>
            <h2>CAPTCHA: <span><xsl:value-of select="cart/customer/capcha"/></span></h2>

            <h2>ITEMS:</h2>
            <ul>
                <xsl:for-each select="cart/items/item">
                    <li>
                        <xsl:value-of select="name"/> - Quantity: <xsl:value-of select="quantity"/>
                    </li>
                </xsl:for-each>
            </ul>
        </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
