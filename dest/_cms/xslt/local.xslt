<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" extension-element-prefixes="date-converter" version="1.0"
	xmlns:date-converter="http://www.hannonhill.com/dateConverter/1.0/"
	xmlns:xalan="http://xml.apache.org/xalan">
	<!-- written by Emily Porter, Office of Information Technology, Emory University for Emory News Center -->
	<!-- outputs date in this format:
        April 3, 2011 
        Feb. 25, 2011
        This is a test
    -->
	<xsl:template name="ap_date_any">
		<xsl:param name="date_source"/>
		<xsl:value-of select="date-converter:convertDate(number($date_source))"/>
	</xsl:template>
	<xsl:template name="ap_date_any_year">
		<xsl:param name="date_source"/>
		<xsl:value-of select="date-converter:convertDateYear(number($date_source))"/>
	</xsl:template>
	<xsl:template name="ap_date">
		<xsl:value-of select="date-converter:convertDate(number(start-date))"/>
	</xsl:template>
	<xsl:template name="ap_date_modified">
		<xsl:value-of select="date-converter:convertDate(number(last-modified))"/>
	</xsl:template>
	<xsl:template name="ap_date_year">
		<xsl:value-of select="date-converter:convertDateYear(number(start-date))"/>
	</xsl:template>
	<!-- used by today's news -->
	<xsl:template name="ap_date_currenttime">
		<xsl:value-of select="date-converter:convertDate(number(@current-time))"/>
	</xsl:template>
	<!-- Xalan component for date conversion from CMS date format to RSS 2.0 pubDate format -->
	<xalan:component functions="convertDate,convertDateYear" prefix="date-converter">
		<xalan:script lang="javascript"> 
            function convertDate(date) { 
            var d = new Date(date); 
            var month= String(d.getUTCMonth() + 101);
            
			<!-- jan starts at 0, add one. add 100 for extra digits --> 
            var month2 = month.substr(1); 
			<!-- trims out first character. (1) = start at second char, output rest. converts to 2 digit format -->
            var month3 = '';
            if (month2 == '01') {month3 = 'Jan.'};
            if (month2 == '02') {month3 = 'Feb.'};
            if (month2 == '03') {month3 = 'March'};
            if (month2 == '04') {month3 = 'April'};
            if (month2 == '05') {month3 = 'May'};
            if (month2 == '06') {month3 = 'June'};
            if (month2 == '07') {month3 = 'July'};
            if (month2 == '08') {month3 = 'Aug.'};
            if (month2 == '09') {month3 = 'Sep.'};
            if (month2 == '10') {month3 = 'Oct.'};
            if (month2 == '11') {month3 = 'Nov.'};
            if (month2 == '12') {month3 = 'Dec.'};
            var day= String(d.getUTCDate()); 
            var showdate = month3 + " " + day; 
            return showdate; } 
            
            
            function convertDateYear(date) { 
            var d = new Date(date); 
            var month= String(d.getUTCMonth() + 101);
            
			<!-- jan starts at 0, add one. add 100 for extra digits --> 
            var month2 = month.substr(1); 
			<!-- trims out first character. (1) = start at second char, output rest. converts to 2 digit format -->
            var month3 = '';
            if (month2 == '01') {month3 = 'Jan.'};
            if (month2 == '02') {month3 = 'Feb.'};
            if (month2 == '03') {month3 = 'March'};
            if (month2 == '04') {month3 = 'April'};
            if (month2 == '05') {month3 = 'May'};
            if (month2 == '06') {month3 = 'June'};
            if (month2 == '07') {month3 = 'July'};
            if (month2 == '08') {month3 = 'Aug.'};
            if (month2 == '09') {month3 = 'Sep.'};
            if (month2 == '10') {month3 = 'Oct.'};
            if (month2 == '11') {month3 = 'Nov.'};
            if (month2 == '12') {month3 = 'Dec.'};
            var day= String(d.getUTCDate()); 
            var year = String(d.getUTCFullYear());
            var showdate = month3 + " " + day + ", " + year; 
            return showdate; } 
        
		</xalan:script>
	</xalan:component>
</xsl:stylesheet>