YUI.add("datatype-date-parse",function(c,b){var a=c.Lang;c.mix(c.namespace("Date"),{parse:function(e){var d=null;if(!(a.isDate(e))){d=new Date(e);}else{return d;}if(a.isDate(d)&&(d!="Invalid Date")&&!isNaN(d)){return d;}else{return null;}}});c.namespace("Parsers").date=c.Date.parse;c.namespace("DataType");c.DataType.Date=c.Date;},"@VERSION@");