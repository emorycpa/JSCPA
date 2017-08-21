<cfxml variable="trumbaXML" caseSensitive="yes">
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:x-trumba="http://schemas.trumba.com/rss/x-trumba"
    xmlns:x-microsoft="http://schemas.microsoft.com/x-microsoft"
    xmlns:xCal="urn:ietf:params:xml:ns:xcal">
    <xsl:output method="text" omit-xml-declaration="yes" media-type="application/json" />
    <xsl:param name="responce" />
    <xsl:param name="message" />
    <xsl:param name="refresh" />
    <xsl:param name="num" />
    <xsl:param name="url" />
    <xsl:template match="/">
        <xsl:text>{</xsl:text>
        <xsl:text>"configuration" : {</xsl:text>
        <xsl:call-template name="get-configuration" />
        <xsl:text>} ,</xsl:text>
        <xsl:if test="error">
            <xsl:text>"error" : true ,</xsl:text>
        </xsl:if>
        <xsl:text>"trumba" : {</xsl:text>
        <xsl:apply-templates mode="rss" select="//rss/channel"/>
        <xsl:text>}</xsl:text>
        <xsl:text>}</xsl:text>
    </xsl:template>
    <xsl:template name="get-configuration">
        <xsl:text>"response" : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="$responce"/>
        </xsl:call-template>
        <xsl:text> , </xsl:text>
        <xsl:text>"message" : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="$message"/>
        </xsl:call-template>
        <xsl:text> , </xsl:text>
        <xsl:text>"refresh" : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="$refresh"/>
        </xsl:call-template>
        <xsl:text> , </xsl:text>
        <xsl:text>"number" : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="$num"/>
        </xsl:call-template>
        <xsl:text> , </xsl:text>
        <xsl:text>"url" : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="$url"/>
        </xsl:call-template>
    </xsl:template>
    <xsl:template match="channel" mode="rss">
        <xsl:apply-templates select="title" mode="node-to-name-value" />
        <xsl:apply-templates select="description" mode="node-to-name-value" />
        <xsl:apply-templates select="link" mode="node-to-name-value" />
        <xsl:apply-templates select="language" mode="node-to-name-value" />
        <xsl:apply-templates select="lastBuildDate" mode="node-to-name-value" />
        <xsl:text>"xcal" : {</xsl:text>
        <xsl:for-each select="xCal:*">
            <xsl:apply-templates select="." mode="node-to-name-value">
                <xsl:with-param name="name" select="local-name(.)"/>
                <xsl:with-param name="last" select="string(position() = last())"/>
            </xsl:apply-templates>
        </xsl:for-each>
        <xsl:text>} , </xsl:text>
        <!--<xsl:apply-templates mode="node-to-name-value" select="*[local-name() != 'image'][local-name() != 'item']"/>-->
        <xsl:apply-templates mode="feed-image" select="image"/>
        <xsl:text>"items" : [</xsl:text>
        <xsl:choose>
            <xsl:when test="string(number($num)) != 'NaN'">
                <xsl:for-each select="item">
                    <xsl:if test="(number($num) &gt; position()) or (number($num) = position())">
                        <xsl:apply-templates mode="feed-item" select=".">
                            <xsl:with-param name="last" select="string(number($num) = position() or position() = last())"/>
                        </xsl:apply-templates>
                    </xsl:if>
                </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
                <xsl:for-each select="item">
                    <xsl:apply-templates mode="feed-item" select=".">
                        <xsl:with-param name="last" select="string(position() = last())"/>
                    </xsl:apply-templates>
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text>]</xsl:text>
    </xsl:template>
    <xsl:template match="node()" mode="feed-item">
        <xsl:param name="last"/>
        <xsl:text>{</xsl:text>
        <!--<xsl:apply-templates mode="node-to-name-value" select="*[local-name() != 'title'][local-name() != 'customfield']"/><xsl:apply-templates mode="node-to-name-value" select="xCal:description" />-->
        <xsl:text>"last": "</xsl:text>
        <xsl:value-of select="$last"/>
        <xsl:text>",</xsl:text>
        <xsl:apply-templates select="description" mode="node-to-name-value" />
        <xsl:apply-templates select="link" mode="node-to-name-value" />
        <xsl:apply-templates select="category" mode="node-to-name-value" />
        <xsl:apply-templates select="pubDate" mode="node-to-name-value" />
        <xsl:apply-templates select="guid" mode="node-to-name-value" />
        <xsl:text>"trumba" : {</xsl:text>
        <xsl:for-each select="x-trumba:*">
            <xsl:apply-templates select="." mode="node-to-name-value">
                <xsl:with-param name="name">
                    <xsl:choose>
                        <xsl:when test="local-name(.) = 'customfield'">
                            <xsl:value-of select="@name" />
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="local-name(.)" />
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:with-param>
                <xsl:with-param name="last" select="string(position() = last())"/>
            </xsl:apply-templates>
        </xsl:for-each>
        <xsl:text>} , </xsl:text>
        <xsl:text>"xcal" : {</xsl:text>
        <xsl:for-each select="xCal:*">
            <xsl:apply-templates select="." mode="node-to-name-value">
                <xsl:with-param name="name" select="local-name(.)"/>
                <xsl:with-param name="last" select="string(position() = last())"/>
            </xsl:apply-templates>
        </xsl:for-each>
        <xsl:text>} , </xsl:text>
        <xsl:apply-templates mode="node-to-name-value" select="title">
            <xsl:with-param name="last" select="'true'"/>
        </xsl:apply-templates>
        <xsl:text>}</xsl:text>
        <xsl:if test="$last != 'true'">
            <xsl:text>,</xsl:text>
        </xsl:if>
    </xsl:template>
    <xsl:template match="node()" mode="feed-image">
        <xsl:param name="last"/>
        <xsl:text>"image" : {</xsl:text>
        <xsl:for-each select="*">
            <xsl:apply-templates mode="node-to-name-value" select=".">
                <xsl:with-param name="last" select="string(position() = last())"/>
            </xsl:apply-templates>
        </xsl:for-each>
        <xsl:text>}</xsl:text>
        <xsl:if test="$last != 'true'">
            <xsl:text>,</xsl:text>
        </xsl:if>
    </xsl:template>
    <xsl:template match="*" mode="node-to-name-value">
        <xsl:param name="last"/>
        <xsl:param name="name"/>
        <xsl:choose>
            <xsl:when test="string($name) != ''">
                <xsl:call-template name="escape-js-string">
                    <xsl:with-param name="text-string" select="$name"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="escape-js-string">
                    <!--<xsl:with-param name="text-string" select="local-name(.)"/>-->
                    <xsl:with-param name="text-string" select="name(.)"/>
                </xsl:call-template>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text> : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="."/>
        </xsl:call-template>
        <xsl:if test="$last != 'true'">
            <xsl:text>,</xsl:text>
        </xsl:if>
    </xsl:template>
    <xsl:template name="js-value">
        <xsl:param name="value-to-convert" />
        <xsl:choose>
            <xsl:when test="string(number($value-to-convert)) != 'NaN'">
                <xsl:value-of select="$value-to-convert"/>
            </xsl:when>
            <xsl:when test="translate($value-to-convert, 'TRUE', 'true') = 'true'">
                <xsl:text>true</xsl:text>
            </xsl:when>
            <xsl:when test="translate($value-to-convert, 'FALSE', 'false') = 'false'">
                <xsl:text>false</xsl:text>
            </xsl:when>
            <xsl:when test="string($value-to-convert) = ''">
                <xsl:text>null</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="escape-js-string">
                    <xsl:with-param name="text-string" select="$value-to-convert"/>
                </xsl:call-template>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template name="escape-js-string">
        <xsl:param name="text-string"/>
        <xsl:text>"</xsl:text>
        <xsl:call-template name="replace">
            <xsl:with-param name="text">
                <xsl:call-template name="replace">
                    <xsl:with-param name="text">
                        <xsl:call-template name="replace">
                            <xsl:with-param name="text">
                                <xsl:call-template name="replace">
                                    <xsl:with-param name="text">
                                        <xsl:call-template name="replace">
                                            <xsl:with-param name="text" select="translate($text-string,'&#xA;&#xD;&#x9;', '   ')"/>
                                            <xsl:with-param name="replace">
                                                <xsl:text>\</xsl:text>
                                            </xsl:with-param>
                                            <xsl:with-param name="by">
                                                <xsl:text>\\</xsl:text>
                                            </xsl:with-param>
                                        </xsl:call-template>
                                    </xsl:with-param>
                                    <xsl:with-param name="replace">
                                        <xsl:text>/</xsl:text>
                                    </xsl:with-param>
                                    <xsl:with-param name="by">
                                        <xsl:text>\/</xsl:text>
                                    </xsl:with-param>
                                </xsl:call-template>
                            </xsl:with-param>
                            <xsl:with-param name="replace">
                                <xsl:text>"</xsl:text>
                            </xsl:with-param>
                            <xsl:with-param name="by">
                                <xsl:text>\"</xsl:text>
                            </xsl:with-param>
                        </xsl:call-template>
                    </xsl:with-param>
                    <xsl:with-param name="replace">
                        <xsl:text>&lt;</xsl:text>
                    </xsl:with-param>
                    <xsl:with-param name="by">
                        <xsl:text disable-output-escaping="yes">&lt;</xsl:text>
                    </xsl:with-param>
                </xsl:call-template>
            </xsl:with-param>
            <xsl:with-param name="replace">
                <xsl:text>&amp;</xsl:text>
            </xsl:with-param>
            <xsl:with-param name="by">
                <xsl:text disable-output-escaping="yes">&amp;</xsl:text>
            </xsl:with-param>
        </xsl:call-template>
        <xsl:text>"</xsl:text>
    </xsl:template>
    <xsl:template name="replace">
        <xsl:param name="text"/>
        <xsl:param name="replace"/>
        <xsl:param name="by"/>
        <xsl:choose>
            <xsl:when test="contains($text, $replace)">
                <xsl:value-of select="substring-before($text,$replace)"/>
                <xsl:value-of select="$by"/>
                <xsl:call-template name="replace">
                    <xsl:with-param name="text" select="substring-after($text,$replace)"/>
                    <xsl:with-param name="replace" select="$replace"/>
                    <xsl:with-param name="by" select="$by"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$text"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
</cfxml>

<cfxml variable="feedXML" caseSensitive="yes">
    <xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns=""
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:thumbnail="http://search.yahoo.com/mrss/">
    <xsl:output media-type="application/json" method="text" omit-xml-declaration="yes"/>
    <xsl:param name="responce"/>
    <xsl:param name="message"/>
    <xsl:param name="refresh"/>
    <xsl:param name="num"/>
    <xsl:param name="url"/>
    <xsl:template match="/">
        <xsl:text>{</xsl:text>
        <xsl:text>"configuration" : {</xsl:text>
        <xsl:call-template name="get-configuration"/>
        <xsl:text>} ,</xsl:text>
        <xsl:if test="error">
            <xsl:text>"error" : true ,</xsl:text>
        </xsl:if>
        <xsl:text>"feed" : {</xsl:text>
        <xsl:apply-templates mode="feed" select="//rss/channel | //atom:feed"/>
        <xsl:text>}</xsl:text>
        <xsl:text>}</xsl:text>
    </xsl:template>
    <xsl:template match="*" mode="feed">
        <xsl:text>"feedUrl" : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="$url"/>
        </xsl:call-template>
        <xsl:text> , </xsl:text>
        <xsl:apply-templates mode="node-to-name-value" select="title"/>
        <xsl:apply-templates mode="node-to-name-value" select="description|subtitle">
            <xsl:with-param name="name" select="'description'"/>
        </xsl:apply-templates>
        <xsl:apply-templates mode="node-to-name-value" select="link[not(@rel) or (@rel and @rel = 'self')]"/>
        <xsl:apply-templates mode="node-to-name-value" select="author/name">
            <xsl:with-param name="name" select="'author'"/>
        </xsl:apply-templates>
        <xsl:apply-templates mode="node-to-name-value" select="language"/>
        <xsl:apply-templates mode="node-to-name-value" select="lastBuildDate"/>
        <xsl:apply-templates mode="feed-image" select="image"/>
        <xsl:text>"entries" : [</xsl:text>
        <xsl:choose>
            <xsl:when test="string(number($num)) != 'NaN'">
                <xsl:for-each select="item">
                    <xsl:if test="(number($num) &gt; position()) or (number($num) = position())">
                        <xsl:apply-templates mode="rss-feed-item" select=".">
                            <xsl:with-param name="last" select="string((number($num) = position()) or (position() = last()))"/>
                        </xsl:apply-templates>
                    </xsl:if>
                </xsl:for-each>
                <xsl:for-each select="atom:entry">
                    <xsl:if test="(number($num) &gt; position()) or (number($num) = position())">
                        <xsl:apply-templates mode="atom-feed-item" select=".">
                            <xsl:with-param name="last" select="string((number($num) = position()) or (position() = last()))"/>
                        </xsl:apply-templates>
                    </xsl:if>
                </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
                <xsl:for-each select="item">
                    <xsl:apply-templates mode="rss-feed-item" select=".">
                        <xsl:with-param name="last" select="string(position() = last())"/>
                    </xsl:apply-templates>
                </xsl:for-each>
                <xsl:for-each select="atom:entry">
                    <xsl:apply-templates mode="atom-feed-item" select=".">
                        <xsl:with-param name="last" select="string(position() = last())"/>
                    </xsl:apply-templates>
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text>]</xsl:text>
    </xsl:template>
    <xsl:template match="node()" mode="rss-feed-item">
        <xsl:param name="last"/>
        <xsl:text>{</xsl:text>
        <xsl:apply-templates mode="node-to-name-value" select="description">
            <xsl:with-param name="name" select="'content'"/>
        </xsl:apply-templates>
        <xsl:apply-templates mode="node-to-name-value" select="link"/>
        <xsl:apply-templates mode="node-to-name-value" select="category"/>
        <xsl:apply-templates mode="node-to-name-value" select="pubDate">
            <xsl:with-param name="name" select="'publishedDate'"/>
        </xsl:apply-templates>
        <xsl:apply-templates mode="node-to-name-value" select="guid"/>
        <xsl:apply-templates mode="content-Snippet" select="description/text()"/>
        <xsl:apply-templates mode="node-to-name-value" select="title">
            <xsl:with-param name="last" select="'true'"/>
        </xsl:apply-templates>
        <xsl:text>}</xsl:text>
        <xsl:if test="$last != 'true'">
            <xsl:text>,</xsl:text>
        </xsl:if>
    </xsl:template>
    <xsl:template match="node()" mode="atom-feed-item">
        <xsl:param name="last"/>
        <xsl:text>{</xsl:text>
        <xsl:choose>
            <xsl:when test="atom:summary and not(atom:content)">
                <xsl:text>"content" : </xsl:text>
                <xsl:call-template name="js-value">
                    <xsl:with-param name="value-to-convert">
                        <xsl:apply-templates select="atom:summary/node()" mode="serialize" />
                    </xsl:with-param>
                </xsl:call-template>
                <xsl:text> , </xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>"content" : </xsl:text>
                <xsl:call-template name="js-value">
                    <xsl:with-param name="value-to-convert">
                        <xsl:apply-templates select="atom:content/node()" mode="serialize" />
                    </xsl:with-param>
                </xsl:call-template>
                <xsl:text> , </xsl:text>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:if test="atom:summary">
            <xsl:text>"summary" : </xsl:text>
            <xsl:call-template name="js-value">
                <xsl:with-param name="value-to-convert">
                    <xsl:apply-templates select="atom:summary/node()" mode="serialize" />
                </xsl:with-param>
            </xsl:call-template>
            <xsl:text> , </xsl:text>
        </xsl:if>
        <xsl:if test="thumbnail:content/@url">
            <xsl:text>"thumbnail": </xsl:text>
            <xsl:call-template name="escape-js-string">
                <xsl:with-param name="text-string" select="thumbnail:content/@url"/>
            </xsl:call-template>
            <xsl:text> , </xsl:text>
        </xsl:if>
        <xsl:text>"link" : </xsl:text>
        <xsl:choose>
            <xsl:when test="atom:link[not(@rel)]/@href">
                <xsl:call-template name="js-value">
                    <xsl:with-param name="value-to-convert" select="atom:link[not(@rel)]/@href" />
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="atom:link[@rel = 'alternate' and @type='text/html']/@href">
                <xsl:call-template name="js-value">
                    <xsl:with-param name="value-to-convert" select="atom:link[@rel = 'alternate' and @type='text/html']/@href" />
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="js-value">
                    <xsl:with-param name="value-to-convert" select="atom:link[1]/@href" />
                </xsl:call-template>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text> , </xsl:text>
        <xsl:if test="atom:category">
            <xsl:text>"category":[</xsl:text>
                <xsl:for-each select="atom:category/@term">
                    <xsl:call-template name="js-value">
                        <xsl:with-param name="value-to-convert" select="." />
                    </xsl:call-template>
                    <xsl:if test="position() != last()">
                        <xsl:text> , </xsl:text>
                    </xsl:if>
                </xsl:for-each>
            <xsl:text>],</xsl:text>
        </xsl:if>
        
        
        <xsl:text>"dc" : {</xsl:text>
        <xsl:for-each select="dc:*">
            <xsl:apply-templates select="." mode="node-to-name-value">
                <xsl:with-param name="name">
                    <xsl:choose>
                        <xsl:when test="local-name(.) = 'customfield'">
                            <xsl:value-of select="@name" />
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="local-name(.)" />
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:with-param>
                <xsl:with-param name="last" select="string(position() = last())"/>
            </xsl:apply-templates>
        </xsl:for-each>
        <xsl:text>} , </xsl:text>
        <xsl:choose>
            <xsl:when test="not(atom:publish) and atom:updated">
                <xsl:apply-templates mode="node-to-name-value" select="atom:updated">
                    <xsl:with-param name="name" select="'publishedDate'"/>
                </xsl:apply-templates>
            </xsl:when>
            <xsl:otherwise>
                <xsl:apply-templates mode="node-to-name-value" select="atom:publish">
                    <xsl:with-param name="name" select="'publishedDate'"/>
                </xsl:apply-templates>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:choose>
            <xsl:when test="atom:summary and not(atom:content)">
                <xsl:apply-templates mode="content-Snippet" select="atom:summary"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:apply-templates mode="content-Snippet" select="atom:content"/>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:apply-templates mode="node-to-name-value" select="atom:title">
            <xsl:with-param name="last" select="'true'"/>
            <xsl:with-param name="name" select="'title'"/>
        </xsl:apply-templates>
        <xsl:text>}</xsl:text>
        <xsl:if test="$last != 'true'">
            <xsl:text>,</xsl:text>
        </xsl:if>
    </xsl:template>
    <xsl:template match="*" mode="serialize">
        <xsl:text>&lt;</xsl:text>
        <xsl:value-of select="name()"/>
        <xsl:apply-templates select="@*" mode="serialize" />
        <xsl:choose>
            <xsl:when test="node()">
                <xsl:text>&gt;</xsl:text>
                <xsl:apply-templates mode="serialize" />
                <xsl:text>&lt;/</xsl:text>
                <xsl:value-of select="name()"/>
                <xsl:text>&gt;</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text> /&gt;</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template match="@*" mode="serialize">
        <xsl:text> </xsl:text>
        <xsl:value-of select="name()"/>
        <xsl:text>="</xsl:text>
        <xsl:value-of select="."/>
        <xsl:text>"</xsl:text>
    </xsl:template>
    <xsl:template match="text()" mode="serialize">
        <xsl:value-of select="."/>
    </xsl:template>
    <xsl:template match="node()" mode="content-Snippet">
        <xsl:param name="last"/>
        <xsl:text>"contentSnippet" : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert">
                <xsl:call-template name="substring-120">
                    <xsl:with-param name="fullstring">
                        <xsl:choose>
                            <xsl:when test="self::*">
                                <xsl:call-template name="node-to-long-string">
                                    <xsl:with-param name="node" select="."/>
                                </xsl:call-template>
                            </xsl:when>
                            <xsl:when test="self::text()">
                                <xsl:value-of select="self::text()"/>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="''"/>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:with-param>
                </xsl:call-template>
            </xsl:with-param>
        </xsl:call-template>
        <xsl:if test="$last != 'true'">
            <xsl:text>,</xsl:text>
        </xsl:if>
    </xsl:template>
    <xsl:template name="node-to-long-string">
        <xsl:param name="node"/>
        <xsl:choose>
            <xsl:when test="self::text()">
                <xsl:value-of select="."/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:for-each select="descendant::node()">
                    <xsl:call-template name="node-to-long-string">
                        <xsl:with-param name="node" select="."/>
                    </xsl:call-template>
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template name="substring-120">
        <xsl:param name="fullstring"/>
        <xsl:choose>
            <xsl:when test="string-length($fullstring) &lt; 120">
                <xsl:value-of select="$fullstring"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="substring-120-function">
                    <xsl:with-param name="substring-before-content" select="''"/>
                    <xsl:with-param name="substring-after-content" select="$fullstring"/>
                </xsl:call-template>
                <xsl:text> ...</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template name="substring-120-function">
        <xsl:param name="substring-before-content"/>
        <xsl:param name="substring-after-content"/>
        <xsl:choose>
            <xsl:when test="string-length($substring-before-content) &lt; 120">
                <xsl:choose>
                    <xsl:when test="(string-length($substring-before-content) + string-length(substring-before( concat( $substring-after-content, ' ' ) , ' ' ))) &lt; 120">
                        <xsl:call-template name="substring-120-function">
                            <xsl:with-param name="substring-before-content" select="concat($substring-before-content, ' ', substring-before( concat( $substring-after-content, ' ' ) , ' ' ))"/>
                            <xsl:with-param name="substring-after-content" select="substring-after( concat( $substring-after-content, ' ' ) , ' ' )"/>
                        </xsl:call-template>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="$substring-before-content"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$substring-before-content"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template match="node()" mode="feed-image">
        <xsl:param name="last"/>
        <xsl:text>"image" : {</xsl:text>
        <xsl:for-each select="*">
            <xsl:apply-templates mode="node-to-name-value" select=".">
                <xsl:with-param name="last" select="string(position() = last())"/>
            </xsl:apply-templates>
        </xsl:for-each>
        <xsl:text>}</xsl:text>
        <xsl:if test="$last != 'true'">
            <xsl:text>,</xsl:text>
        </xsl:if>
    </xsl:template>
    <xsl:template name="get-configuration">
        <xsl:text>"response" : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="$responce"/>
        </xsl:call-template>
        <xsl:text> , </xsl:text>
        <xsl:text>"message" : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="$message"/>
        </xsl:call-template>
        <xsl:text> , </xsl:text>
        <xsl:text>"refresh" : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="$refresh"/>
        </xsl:call-template>
        <xsl:text> , </xsl:text>
        <xsl:text>"number" : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="$num"/>
        </xsl:call-template>
        <xsl:text> , </xsl:text>
        <xsl:text>"url" : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="$url"/>
        </xsl:call-template>
    </xsl:template>
    <xsl:template match="*" mode="node-to-name-value">
        <xsl:param name="last"/>
        <xsl:param name="name"/>
        <xsl:choose>
            <xsl:when test="string($name) != ''">
                <xsl:call-template name="escape-js-string">
                    <xsl:with-param name="text-string" select="$name"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="escape-js-string">
                    <!--<xsl:with-param name="text-string" select="local-name(.)"/>-->
                    <xsl:with-param name="text-string" select="name(.)"/>
                </xsl:call-template>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text> : </xsl:text>
        <xsl:call-template name="js-value">
            <xsl:with-param name="value-to-convert" select="."/>
        </xsl:call-template>
        <xsl:if test="$last != 'true'">
            <xsl:text>,</xsl:text>
        </xsl:if>
    </xsl:template>
    <xsl:template name="js-value">
        <xsl:param name="value-to-convert"/>
        <xsl:choose>
            <xsl:when test="string(number($value-to-convert)) != 'NaN'">
                <xsl:value-of select="$value-to-convert"/>
            </xsl:when>
            <xsl:when test="translate($value-to-convert, 'TRUE', 'true') = 'true'">
                <xsl:text>true</xsl:text>
            </xsl:when>
            <xsl:when test="translate($value-to-convert, 'FALSE', 'false') = 'false'">
                <xsl:text>false</xsl:text>
            </xsl:when>
            <xsl:when test="string($value-to-convert) = ''">
                <xsl:text>null</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="escape-js-string">
                    <xsl:with-param name="text-string" select="$value-to-convert"/>
                </xsl:call-template>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template name="escape-js-string">
        <xsl:param name="text-string"/>
        <xsl:text>"</xsl:text>
        <xsl:call-template name="replace">
            <xsl:with-param name="text">
                <xsl:call-template name="replace">
                    <xsl:with-param name="text">
                        <xsl:call-template name="replace">
                            <xsl:with-param name="text">
                                <xsl:call-template name="replace">
                                    <xsl:with-param name="text">
                                        <xsl:call-template name="replace">
                                            <xsl:with-param name="text" select="translate($text-string,'&#xA;&#xD;&#x9;', '   ')"/>
                                            <xsl:with-param name="replace">
                                                <xsl:text>\</xsl:text>
                                            </xsl:with-param>
                                            <xsl:with-param name="by">
                                                <xsl:text>\\</xsl:text>
                                            </xsl:with-param>
                                        </xsl:call-template>
                                    </xsl:with-param>
                                    <xsl:with-param name="replace">
                                        <xsl:text>/</xsl:text>
                                    </xsl:with-param>
                                    <xsl:with-param name="by">
                                        <xsl:text>\/</xsl:text>
                                    </xsl:with-param>
                                </xsl:call-template>
                            </xsl:with-param>
                            <xsl:with-param name="replace">
                                <xsl:text>"</xsl:text>
                            </xsl:with-param>
                            <xsl:with-param name="by">
                                <xsl:text>\"</xsl:text>
                            </xsl:with-param>
                        </xsl:call-template>
                    </xsl:with-param>
                    <xsl:with-param name="replace">
                        <xsl:text>&lt;</xsl:text>
                    </xsl:with-param>
                    <xsl:with-param name="by">
                        <xsl:text disable-output-escaping="yes">&lt;</xsl:text>
                    </xsl:with-param>
                </xsl:call-template>
            </xsl:with-param>
            <xsl:with-param name="replace">
                <xsl:text>&amp;</xsl:text>
            </xsl:with-param>
            <xsl:with-param name="by">
                <xsl:text disable-output-escaping="yes">&amp;</xsl:text>
            </xsl:with-param>
        </xsl:call-template>
        <xsl:text>"</xsl:text>
    </xsl:template>
    <xsl:template name="replace">
        <xsl:param name="text"/>
        <xsl:param name="replace"/>
        <xsl:param name="by"/>
        <xsl:choose>
            <xsl:when test="contains($text, $replace)">
                <xsl:value-of select="substring-before($text,$replace)"/>
                <xsl:value-of select="$by"/>
                <xsl:call-template name="replace">
                    <xsl:with-param name="text" select="substring-after($text,$replace)"/>
                    <xsl:with-param name="replace" select="$replace"/>
                    <xsl:with-param name="by" select="$by"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$text"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
</cfxml>

<cfset namespace = 'candlerAdmissions' />

<cfif structKeyExists(url, 'calendar')>
    
    <cfset calendarwebname = url.calendar />
    
    <cfif structKeyExists(url,"num")>
        <cfset feednumber = url.num />
    <cfelse>
        <cfset feednumber = "" />
    </cfif>
    
    
    
    <cfset trumbaurl = "http://www.trumba.com/calendars/#calendarwebname#.rss?xcal=1" />
    
    <cfif structKeyExists(url, "25live")>
        <cfset trumbaurl = "http://25livepub.collegenet.com/calendars/#calendarwebname#.rss?xcal=1" />
    </cfif>
    
    
    <cfif structKeyExists(url,"startdate") and IsDate(url.startdate)>
        <cfset trumbaurl = trumbaurl & "&#DateFormat(ParseDateTime(url.startdate), 'yyyymmdd')#" />
    </cfif>
    
    <cfset id = Hash(namespace & "trubmajson" & trumbaurl & feednumber)/>
    
    <cfif structKeyExists(url,"clearCache") and url.clearCache IS 'true'>
        <cfset CacheRemove(id) />
    </cfif>
    
    <cfset cachedJSON = cacheGet(id) />
    
    <cfif isNull(cachedJSON)>
        <cftry>
            <cfhttp url="#trumbaurl#" method="GET" resolveurl="Yes" throwOnError="Yes" timeout="5"/>
            <cfset xmlData = xmlParse(CFHTTP.FileContent) />
            <cfif feednumber IS NOT "" and Val(feednumber) GT ArrayLen(XmlSearch(xmlData, "/rss/channel/item"))>
                <cfhttp url="#trumbaurl#&month=18" method="GET" resolveurl="Yes" throwOnError="Yes" timeout="5"/>
                <cfset xmlData = xmlParse(CFHTTP.FileContent) />
            </cfif>
            <cfset xmlResponce = 200 />
            <cfset xmlMessage = "" />
            <cfcatch type="any">
                <cfxml variable="xmlData">
                    <error>Error trying to get feed</error>
                </cfxml>
                <cfset xmlResponce = 500 />
                <cfset xmlMessage = cfcatch.message & cfcatch.detail />
            </cfcatch>
        </cftry>
        
        <cfif structKeyExists(url ,"refreshInterval") AND IsValid("integer" , url.refreshInterval)>
            <cfset sec =  Val(url.refreshInterval) />
            <cfset refreshInterval = CreateTimeSpan(0, 0, 0, sec ) />
        <cfelse>
            <cfset refreshInterval = CreateTimeSpan(1, 0, 0, 0) />
        </cfif>
        
        <cfif xmlResponce IS 200>
            <cfset refreshIntervalDate = now() + refreshInterval />
        <cfelse>
            <cfset refreshIntervalDate = now() />
        </cfif>
        
        <cfset refreshIntervalDateStr = dateFormat(refreshIntervalDate , "yyyy-mm-dd") & " " & timeformat(refreshIntervalDate, "HH:MM:SS") />
        
        <!---<cffile action="read" file="#GetDirectoryFromPath(GetCurrentTemplatePath())#transform-trubma.xml" variable="xmlTrans"/>--->
        <cfset xmlTrans = trumbaXML />
        
        <cfset xmlParams = StructNew() />
        <cfset xmlParams["responce"] = ToString(xmlResponce) />
        <cfset xmlParams["message"] = ToString(xmlMessage) />
        <cfset xmlParams["refresh"] =  ToString(refreshIntervalDateStr) />
        <cfset xmlParams["num"] =  ToString(feednumber) />
        <cfset xmlParams["url"] = ToString(trumbaurl) />
        
        <cfset cachedJSON = XmlTransform(xmlData, xmlTrans, xmlParams) />
        
        <cfset cachePut( id , cachedJSON, refreshInterval) />
    </cfif>
    
    <cfif structKeyExists(url,"callback") && structKeyExists(url,"context")>
        <cfcontent reset="true" type="application/json"><cfoutput>#url.callback#.call(#url.context#,#cachedJSON#,#cachedJSON#.responseStatus,#cachedJSON#.responseDetails);</cfoutput></cfcontent>
    <cfelseif structKeyExists(url,"callback")>
        <cfcontent reset="true" type="application/json"><cfoutput>#url.callback#(#cachedJSON#);</cfoutput></cfcontent>
    <cfelse>
        <cfcontent reset="true" type="application/json"><cfoutput>#cachedJSON#</cfoutput></cfcontent>
    </cfif>
<cfelseif structKeyExists(url, 'feed') and IsValid('URL', url.feed)>
    
    <cfset feedurl = url.feed />
    
    <cfif structKeyExists(url,"num")>
        <cfset feednumber = url.num />
    <cfelse>
        <cfset feednumber = "" />
    </cfif>
    
    <cfset id = Hash(namespace & "feedjson" & feedurl & feednumber)/>
    
    <cfif structKeyExists(url,"clearCache") and url.clearCache IS 'true'>
        <cfset CacheRemove(id) />
    </cfif>
    
    <cfset cachedJSON = cacheGet(id) />
    
    <cfif isNull(cachedJSON)>
        
        <cftry>
            <cfhttp url="#feedurl#" method="GET" resolveurl="Yes" throwOnError="Yes" timeout="5" />
            <cfset xmlData = xmlParse(CFHTTP.FileContent) />
            <cfset xmlResponce = 200 />
            <cfset xmlMessage = "" />
            <cfcatch type="any">
                <cfxml variable="xmlData">
                    <error>Error trying to get feed</error>
                </cfxml>
                <cfset xmlResponce = 500 />
                <cfset xmlMessage = cfcatch.message & cfcatch.detail />
            </cfcatch>
        </cftry>
        
        <cfif structKeyExists(url ,"refreshInterval") AND IsValid("integer" , url.refreshInterval)>
            <cfset sec =  Val(url.refreshInterval) />
            <cfset refreshInterval = CreateTimeSpan(0, 0, 0, sec ) />
        <cfelse>
            <cfset refreshInterval = CreateTimeSpan(1, 0, 0, 0) />
        </cfif>
        
        <cfif xmlResponce IS 200>
            <cfset refreshIntervalDate = now() + refreshInterval />
        <cfelse>
            <cfset refreshIntervalDate = now() />
        </cfif>
        
        <cfset refreshIntervalDateStr = dateFormat(refreshIntervalDate , "yyyy-mm-dd") & " " & timeformat(refreshIntervalDate, "HH:MM:SS") />
        
        <!---<cffile action="read" file="#GetDirectoryFromPath(GetCurrentTemplatePath())#transform-feed.xml" variable="xmlTrans"/>--->
        <cfset xmlTrans = feedXML />
        
        <cfset xmlParams = StructNew() />
        <cfset xmlParams["responce"] = ToString(xmlResponce) />
        <cfset xmlParams["message"] = ToString(xmlMessage) />
        <cfset xmlParams["refresh"] =  ToString(refreshIntervalDateStr) />
        <cfset xmlParams["num"] =  ToString(feednumber) />
        <cfset xmlParams["url"] = ToString(feedurl) />
        
        <cfset cachedJSON = XmlTransform(xmlData, xmlTrans, xmlParams) />
        
        <cfset cachePut( id , cachedJSON, refreshInterval) />
    </cfif>
    
    <cfif structKeyExists(url,"callback") && structKeyExists(url,"context")>
        <cfcontent reset="true" type="application/json"><cfoutput>#url.callback#.call(#url.context#,#cachedJSON#,#cachedJSON#.responseStatus,#cachedJSON#.responseDetails);</cfoutput></cfcontent>
    <cfelseif structKeyExists(url,"callback")>
        <cfcontent reset="true" type="application/json"><cfoutput>#url.callback#(#cachedJSON#);</cfoutput></cfcontent>
    <cfelse>
        <cfcontent reset="true" type="application/json"><cfoutput>#cachedJSON#</cfoutput></cfcontent>
    </cfif>
<cfelse>
    <cfcontent reset="true" type="application/json"><cfoutput>{"responseStatus":"Mode or URL not specified","responseDetails":500,"responseData":{}}</cfoutput></cfcontent>
</cfif>