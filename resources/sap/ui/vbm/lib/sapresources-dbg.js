//...........................................................................//
// resources manager object..................................................//

// Author: Ulrich Roegelein

//uses: <saputilities.js>

VBI.ResourceManager = (function () {
   var resourcemanager = {};

   // this is the dummy image used when data is missing......................//      
   resourcemanager.m_DummyData = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA61JREFUeNqsVG1LU2EYvs85bjomsr6YhFQsNagke6FQigoiSQOJ8FM/oT8R9CmoCD/2C4o+FxUFWmFFKNHS2rTMtbmjm3vx7O3Msz1d9/YcXcvhjB643OY5z329PPf9KER0HTgBuOn/rTAwBXxpwp/2W8PD3hsjI3tcmqaKdJpEofBPVXlfSdcpNzXV9+ndu6ZBId4wwdq11tZdjoUFtdjcTMIwKgRC7LC6IBZn+XykT09rQUW5IIR4wAQLvomJmd0+3ynF7SZhWUTr65VNitJ4cewrhUL0ESTP8a98d/fPrvHxM1yhq49o30OiWzgEp6Nqn9KoeI4BmAGeArOKIq7evPnV4fHEVfyOfSIKvSV6wy8V5IadLHimBOAH5oG9x4/ntLY2TzAYbGeCLGDcI3qVRn0TP0qSRDSongv8kgTrmiaOXrmSzmazpeXl5SwTcODpWbh4T/SBHRR3qH4VmAN+APtPnsw1ezxWLBYr6LoeUUWlW/JA8g7RE4PIzDfogp9lgBDwjYVBfe/QUBqriOJJkMyr8t2yC9hcgov361JZI+rjQIBbEfCePp1ztrVZ8Xi8gHgiqVQqoFa6bNPFXTRCCt+3OwtbfVBmLxwOceTy5bL6SCSSAsn3ZDK5qK6gpWpcRCaJJgtSYb2I+OVYVfYH+vuzTW53OXuoXwLBt0QiEVc3Z2XTxRjRsySaw6xyIOp0DmevOJ2lw4ODGaxy9ig8Dyf82CwT1LgwYDuCuXhbqHMW/FJUqufsuwYGcprLZUWjURPqw1AfAHg0xIYDJqlykbpP9CIhXZRqnNjZfwVUqO9F9qwexZOrq6vz+M6PeSupdZrD0Il0nm5TKhY12XPn/AR6zp7NksNRRPZ5zh4EfiBhb/mDoNbFbZwF3kzb1wcPIKadFiWBo6WldPjSpQzyttA5rH7ONM2wvHGongPbRRoHvfKaaMJ2YWe/of7cuQyr5+xxuJw9q49X98RfBDUu1jDdL7FjLS/V233vdLlKhy5ezBqGYSEaNE6C1YekDtrOQbWL5XGicS6uy4NlkoPnz2eEppXVI54Qdw7OIVk7OlsSVLnI8VzgLJ4ikgQX/wy0tLaWs7fVc/aY2r/Ub+eAIhUXaxiq4DTRo4C8OY8NDeU0p1PIvg/hzplDa6a2Gvy6BOyiQwgF45iHm6h3bOy14vX+6ujuzrN6RGKFw+E4YglAfXgr9byatrsxO0V5GFuGR0eLnT09j5H3AAq3+/1+E5+LfGPWU8/rtwADAFTqgB/beBQtAAAAAElFTkSuQmCC";
 
  return resourcemanager;
})();

//  

VBI.Resources = function()
{
   var resources = {};

   resources.m_resourcedata = [];
   resources.m_resourceinstance = [];

   resources.clear = function()
   {
      // clear instances and data............................................//
      resources.m_resourcedata = [];
      resources.m_resourceinstance = [];
   };

   // load the resources specified in the application area...................//

   resources.load = function( dat, ctx )
   {
      // load the json delta data............................................//
      if( dat.Set )
      {
         // todo: process different kinds of set to enable delta
         resources.clear();

         var res = dat.Set.Resource;
         if( jQuery.type( res ) == 'object' )
         {
            resources.m_resourcedata[ res.name ] = res.value;
         }  else
         if( jQuery.type( res ) == 'array' )
         {
            // load from array...............................................//
            for( var nJ = 0, len = res.length; nJ < len; ++nJ )
               resources.m_resourcedata[ res[nJ].name ] = res[nJ].value;
         }
      }
   };

   resources.GetData = function( name )
   {
      return resources.m_resourcedata[ name ];
   };
   
   resources.GetImageBits = function( name, rhls1, rhls2, lcb )
   {
      var ri, nname = name;
      if( rhls1 ) nname+= rhls1;
      if( rhls2 ) nname+= rhls2;

      if( ri = resources.m_resourceinstance[ name ] )
         if( ri.m_Bits )
            return ( [ri.m_Bits, ri.m_Image.naturalWidth, ri.m_Image.naturalHeight] );  // everything created

      // todo: use the color shifted image to be precise, currently the original image is used
      var img = resources.GetImage( name, null, null, lcb );
      if ( img ){
        var imageData = VBI.Utilities.GetImagePixelData( img ).data;
        resources.m_resourceinstance[ name ].m_Bits = imageData;
        return ( [resources.m_resourceinstance[ name ].m_Bits, img.naturalWidth, img.naturalHeight] );
      }
      return null;
   };

   resources.GetImage = function( name, rhls1, rhls2, lcb )
   {
      var ri, rd;
      
      var imgType = "";
      if (name != undefined){
	      var dotPos = name.lastIndexOf(".");
	      if ( dotPos >= 0)
	    	  imgType = "/" +  name.substring(dotPos+1);
      }

      var nname = name;
      if( rhls1 ) nname += rhls1;
      if( rhls2 ) nname += rhls2;
      // the hue shifted image is stored under the name + the rhls1 string + th rhls2 string
      if( ri = resources.m_resourceinstance[ nname ] )
         if( ri.m_Image )
            return ri.m_Image;  // everything created

      // try to create the resource..........................................//
      if( ri )
      {
         // try to parse rhls1...............................................//
         if( rhls1 || rhls2 )
            return ( ri.m_Image = VBI.Utilities.CreateDOMColorShiftedImageFromData( resources.m_resourcedata[ name ], imgType, rhls1, rhls2, lcb ) );

         return ( ri.m_Image = VBI.Utilities.CreateDOMImageFromData( resources.m_resourcedata[ name ], imgType, lcb ) ); 
      } else {
          var bResFound = ( rd = resources.m_resourcedata[ name ] );
          if (!bResFound){
              VBI.m_bTrace && VBI.Trace( "resource not found; default image loaded" );
        	  imgType = '/png';
        	  rd = VBI.ResourceManager.m_DummyData;
          }
          // try to parse rhls1...............................................//
          if( rhls1 || rhls2 ){
              resources.m_resourceinstance[ nname ] = { m_Image: VBI.Utilities.CreateDOMColorShiftedImageFromData(  rd , imgType, rhls1, rhls2, lcb ) };
              return resources.GetImage( name, null, null, lcb ); // Hot Stated Image not yet there, so we take normal one. Will be updated with next onLoad
          }

          return ( resources.m_resourceinstance[ nname ] = { m_Image: VBI.Utilities.CreateDOMImageFromData( rd, imgType, lcb ) } ).m_Image;
      }
   };
   
   return resources;
};



