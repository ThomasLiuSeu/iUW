Proj4js.Proj.tmerc={init:function(){this.e0=Proj4js.common.e0fn(this.es);this.e1=Proj4js.common.e1fn(this.es);this.e2=Proj4js.common.e2fn(this.es);this.e3=Proj4js.common.e3fn(this.es);this.ml0=this.a*Proj4js.common.mlfn(this.e0,this.e1,this.e2,this.e3,this.lat0);},forward:function(p){var l=p.x;var a=p.y;var d=Proj4js.common.adjust_lon(l-this.long0);var e;var x,y;var s=Math.sin(a);var f=Math.cos(a);if(this.sphere){var b=f*Math.sin(d);if((Math.abs(Math.abs(b)-1.0))<.0000000001){Proj4js.reportError("tmerc:forward: Point projects into infinity");return(93);}else{x=.5*this.a*this.k0*Math.log((1.0+b)/(1.0-b));e=Math.acos(f*Math.cos(d)/Math.sqrt(1.0-b*b));if(a<0)e=-e;y=this.a*this.k0*(e-this.lat0);}}else{var g=f*d;var h=Math.pow(g,2);var c=this.ep2*Math.pow(f,2);var i=Math.tan(a);var t=Math.pow(i,2);e=1.0-this.es*Math.pow(s,2);var n=this.a/Math.sqrt(e);var m=this.a*Proj4js.common.mlfn(this.e0,this.e1,this.e2,this.e3,a);x=this.k0*n*g*(1.0+h/6.0*(1.0-t+c+h/20.0*(5.0-18.0*t+Math.pow(t,2)+72.0*c-58.0*this.ep2)))+this.x0;y=this.k0*(m-this.ml0+n*i*(h*(0.5+h/24.0*(5.0-t+9.0*c+4.0*Math.pow(c,2)+h/30.0*(61.0-58.0*t+Math.pow(t,2)+600.0*c-330.0*this.ep2)))))+this.y0;}p.x=x;p.y=y;return p;},inverse:function(p){var a,b;var e;var i;var m=6;var l,j;if(this.sphere){var f=Math.exp(p.x/(this.a*this.k0));var g=.5*(f-1/f);var k=this.lat0+p.y/(this.a*this.k0);var h=Math.cos(k);a=Math.sqrt((1.0-h*h)/(1.0+g*g));l=Proj4js.common.asinz(a);if(k<0)l=-l;if((g==0)&&(h==0)){j=this.long0;}else{j=Proj4js.common.adjust_lon(Math.atan2(g,h)+this.long0);}}else{var x=p.x-this.x0;var y=p.y-this.y0;a=(this.ml0+y/this.k0)/this.a;b=a;for(i=0;true;i++){e=((a+this.e1*Math.sin(2.0*b)-this.e2*Math.sin(4.0*b)+this.e3*Math.sin(6.0*b))/this.e0)-b;b+=e;if(Math.abs(e)<=Proj4js.common.EPSLN)break;if(i>=m){Proj4js.reportError("tmerc:inverse: Latitude failed to converge");return(95);}}if(Math.abs(b)<Proj4js.common.HALF_PI){var s=Math.sin(b);var o=Math.cos(b);var q=Math.tan(b);var c=this.ep2*Math.pow(o,2);var u=Math.pow(c,2);var t=Math.pow(q,2);var v=Math.pow(t,2);a=1.0-this.es*Math.pow(s,2);var n=this.a/Math.sqrt(a);var r=n*(1.0-this.es)/a;var d=x/(n*this.k0);var w=Math.pow(d,2);l=b-(n*q*w/r)*(0.5-w/24.0*(5.0+3.0*t+10.0*c-4.0*u-9.0*this.ep2-w/30.0*(61.0+90.0*t+298.0*c+45.0*v-252.0*this.ep2-3.0*u)));j=Proj4js.common.adjust_lon(this.long0+(d*(1.0-w/6.0*(1.0+2.0*t+c-w/20.0*(5.0-2.0*c+28.0*t-3.0*u+8.0*this.ep2+24.0*v)))/o));}else{l=Proj4js.common.HALF_PI*Proj4js.common.sign(y);j=this.long0;}}p.x=j;p.y=l;return p;}};
