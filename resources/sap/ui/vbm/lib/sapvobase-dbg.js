//...........................................................................//
// VisualObjects namespace...................................................//

// Author: Ulrich Roegelein


//...........................................................................//
// visual objects are the items that can be placed in a scene................//
// they support full databinding to the visual business datacontext..........//
//...........................................................................//

// jQuery.sap.declare("VBI.VisualObjects.Object");

//...........................................................................//
// bindable functions for VOS................................................//


VBI.Utilities.SceneBindDesignSpotBoxSize = function( ocb )
{
   var scene = this.m_Scene;

   // only when the scale is changeable......................................//
   if( ocb.m_Design && ( ocb.m_Hit == VBI.HTBOXHANDLE ) && this.m_Scale.IsChangeable( scene.m_Ctx ) )
   {
      // lower handles are not supported, due they would modify the position.//
      // current implementation ensures that position is kept................//
      // precisely...........................................................//
      if( ocb.m_Handle > 6 )  
         return;

      // get the current non scaled values...................................//
      var zf = scene.GetCurrentZoomFactors();
      var nsx = ocb.m_ClientX/zf[0];
      var nsy = ocb.m_ClientY/zf[1];

      // get the current bounding box........................................//
      var bb = ocb.m_DhOrig[0];
      var midX = ( bb[0] + bb[2] )/2.0;
      var wh = (bb[2] - bb[0])/2.0;    // half of original width
      var h = ( bb[3] - bb[1] );       // height

      var fx = 1.0, fy = 1.0;
      switch( ocb.m_Handle )
      {
         case 1:
            fy = Math.abs( nsy - bb[3] ) / h; 
            break;
         case 2:
            fy = Math.abs( nsy - bb[3] ) / h; 
            // fall through
         case 5:
            fx = Math.abs( nsx - midX ) / wh; 
            break;
         case 0:
            fy = Math.abs( nsy - bb[3] ) / h; 
            // fall through
         case 3:
            fx = Math.abs( nsx - midX ) / wh; 
            break;
      }

      var scale = ocb.m_ScaleOrig.slice( 0 );
      scale[0] *= fx;
      scale[1] *= fy;

      // set the new scale...................................................//
      this.m_Scale.SetValueVector( scene.m_Ctx, scale );
   }
};

VBI.Utilities.SceneBindDesignBoxBoxSize = function( keepratio, ocb )
{
   var scene = this.m_Scene;

   // only when the scale is changeable................................//
   if( ocb.m_Design && ( ocb.m_Hit == VBI.HTBOXHANDLE ) && this.m_Scale.IsChangeable( scene.m_Ctx ) )
   {
      // get the current non scaled values...................................//
      var zf = scene.GetCurrentZoomFactors();
      var nsx = ocb.m_ClientX/zf[0];
      var nsy = ocb.m_ClientY/zf[1];

      // get the current bounding box........................................//
      var bb = ocb.m_DhOrig[0];
      var midX = ( bb[0] + bb[2] )/2.0;
      var midY = ( bb[1] + bb[3] )/2.0;
      var wh = (bb[2] - bb[0])/2.0;    // half of original width
      var hh = ( bb[3] - bb[1] )/2.0;  // height

      var fx = 1.0, fy = 1.0;
      switch( ocb.m_Handle )
      {
         case 0:
         case 2:
         case 6:
         case 8:
            fx = Math.abs( nsx - midX ) / wh;
            fy = Math.abs( nsy - midY ) / hh; 
            // when keeping the ratio we use the max of both.................//
            if( keepratio ) fx = fy = Math.max( fx, fy );
            break;
         case 1:
         case 7:
            fy = Math.abs( nsy - midY ) / hh;
            if( keepratio ) fx = fy;   // here we keep the ratio.............//
            break;
         case 3:
         case 5:
            fx = Math.abs( nsx - midX ) / wh; 
            if( keepratio ) fy = fx;   // here we keep the ratio.............//
            break;
      }

      var scale = ocb.m_ScaleOrig.slice( 0 );
      scale[0] *= fx;
      scale[1] *= fy;

      // set the new scale...................................................//
      this.m_Scale.SetValueVector( scene.m_Ctx, scale );
   }
};

VBI.Utilities.SceneBindMeterRadiusDesignBoxSize = function( ocb )
{
   // determine a meter dimensioned radius...................................//
   var scene = this.m_Scene;
   if( ocb.m_Design )
   {
      // determine the center point information..............................//
      var center = this.m_Pos.GetValueVector( scene.m_Ctx );
      var cur = scene.GetPosFromPoint( [ ocb.m_ClientX, ocb.m_ClientY, 0 ] );

      // 0 1 2
      // 3 4 5
      // 6 7 8
      var r = 0;
      switch( ocb.m_Handle )
      {
         case 1:
         case 7:
            r = VBI.MathLib.Distance( VBI.MathLib.DegToRad( center ), VBI.MathLib.DegToRad( [ center[0], cur[1] ] ) );
            break;
         case 3:
         case 5:
            r = VBI.MathLib.Distance( VBI.MathLib.DegToRad( center ), VBI.MathLib.DegToRad( [ cur[0], center[1] ] ) );
            break;
      }

      // set the radius......................................................//
      this.m_Radius.SetValueFloat( scene.m_Ctx, Math.abs( r ) );
   }
};

VBI.Utilities.SceneBindRadiusDesignBoxSize = function( ocb )
{
   // determines a pixel size radius.........................................//
   var scene = this.m_Scene;
   if( ocb.m_Design )
   {
      // determine the center point information..............................//
      var centerpos = this.m_Pos.GetValueVector( scene.m_Ctx );
      var centerpt = scene.GetPointFromPos( centerpos );

      // 0 1 2
      // 3 4 5
      // 6 7 8
      var r = 0;
      switch( ocb.m_Handle )
      {
         case 1:
         case 7:
            r = ( centerpt[1] - ocb.m_ClientY ); // zf[1];     // in non zoomed pixel space
            break;
         case 3:
         case 5:
            r = ( centerpt[0] - ocb.m_ClientX ); // zf[0];     // in non zoomed pixel space
            break;
      }

      // set the radius......................................................//
      this.m_Radius.SetValueFloat( scene.m_Ctx, Math.abs( r ) );
   }
};

VBI.Utilities.SceneBindPosArrayDesignBoxSize = function( ocb )
{
   var scene = this.m_Scene;
   if( ocb.m_Design )
   {
      // determine the new point information.................................//
      var pos = scene.GetPosFromPoint( [ ocb.m_ClientX, ocb.m_ClientY, 0 ] );

      var minX = Number.MAX_VALUE; 
      var maxX = -Number.MAX_VALUE; 
      var minY = Number.MAX_VALUE; 
      var maxY = -Number.MAX_VALUE; 

      // determine min max from the original positions.......................//
      var apos = ocb.m_PosOrig.slice(0);
      var nJ, len = apos.length / 3, idx;
      for( nJ = 0; nJ < len; ++nJ )
      {
         idx = nJ * 3;
         if( minX > apos[ idx ] ) 
            minX = apos[ idx ];
         if( maxX < apos[ idx ] ) 
            maxX = apos[ idx ];
         if( minY > apos[ idx + 1] ) 
            minY = apos[ idx + 1];
         if( maxY < apos[ idx + 1 ] ) 
            maxY = apos[ idx + 1];
      }

      // 0,1,2
      // 3,4,5
      // 6,7,8

      // geo coordinate system goes from left to right but from bottom up....//
      var ax = 0, fx = 1;
      var ay = 0, fy = 1;
      switch( ocb.m_Handle )
      {
         case 0:
            ax = maxX; fx = ( pos[0] - maxX ) / ( minX - maxX );
            // fall through 
         case 1:
            ay = minY; fy = ( pos[1] - minY ) / ( maxY - minY );
            break;
         case 2:
            ay = minY; fy = ( pos[1] - minY ) / ( maxY - minY );
            // fall through 
         case 5:
            ax = minX; fx = ( pos[0] - minX ) / ( maxX - minX );
            break;
         case 6:
            ay = maxY; fy = ( pos[1] - maxY ) / ( minY - maxY );
            // fall through 
         case 3:
            ax = maxX; fx = ( pos[0] - maxX ) / ( minX - maxX );
            break;
         case 8:
            ax = minX; fx = ( pos[0] - minX ) / ( maxX - minX );
            // fall through 
         case 7:
            ay = maxY; fy = ( pos[1] - maxY ) / ( minY - maxY );
            break;
      }

      // all handles should be moved.........................................//
      for( nJ = 0; nJ < len; ++nJ )
      {
         var idx = nJ * 3;
         apos[ idx ] = ax + (apos[ idx ] - ax ) * fx;
         apos[ idx + 1] = ay + (apos[ idx + 1] - ay ) * fy;
      }
      this.m_Pos.SetValueVector( scene.m_Ctx, apos );
   }
};

VBI.Utilities.BackupFont = function(dc)
{
	dc.m_BackupFont=[];
	
	dc.m_BackupFont.m_font         = dc.m_font         = dc.font;
	dc.m_BackupFont.m_fillStyle    = dc.fillStyle;
	dc.m_BackupFont.m_strokeStyle  = dc.strokeStyle;
	dc.m_BackupFont.m_textAlign    = dc.textAlign;
	dc.m_BackupFont.m_textBaseline = dc.textBaseline;
};

VBI.Utilities.RestoreFont = function(dc)
{
	dc.m_font         = dc.font         = dc.m_BackupFont.m_font;
	dc.fillStyle    = dc.m_BackupFont.m_fillStyle;
	dc.strokeStyle  = dc.m_BackupFont.m_strokeStyle;
	dc.textAlign    = dc.m_BackupFont.m_textAlign;
	dc.textBaseline = dc.m_BackupFont.m_textBaseline;
};

VBI.Utilities.SetTextAttributes = function( dc, newFont, newFillStyle, newStrokeStyle, newAlign, newTextBaseline )
{
	  if ((newFont != undefined) && (dc.m_font != newFont)){
		  dc.m_font = dc.font = newFont;
	  }
	  dc.fillStyle    = newFillStyle;
	  dc.strokeStyle  = newStrokeStyle;
	  dc.textAlign    = newAlign;
	  dc.textBaseline = newTextBaseline;
};

VBI.Utilities.SetFont = function( dc, newFont )
{
	  if ((newFont != undefined) && (dc.m_font != newFont)){
		  dc.m_font = dc.font = newFont;
	  }
};

VBI.Label = function( label, recalc, posarray, rcbox, aIO )
{
   this.m_bAligned = false;
   this.m_aIO = aIO;
   this.m_rcBox = rcbox;
   this.m_Text = label.labeltext;
   this.m_BgColor = label.bgColor;
   this.m_Align = label.Align;
   this.m_Padding = 2;
   this.m_PosArray = posarray;          // the position ( positionarray ) of the VO Instance calculated in RenderInstance
   
   this.m_Pos = [];                        // the calculated position of the labeltext
   this.m_Width = 0;
   this.m_Height = 0;
   this.m_LabelTextColor = [];
   if ( ! recalc )                         // predefined positions only if no recalc method available
   {
      var nLen = Math.floor( this.m_PosArray.pa.length / 3 ) * 3;
      for ( var nH = 0; nH < aIO.length; nH++ )
      {
         var aTmp = [];
         for ( var nI = 0; nI < nLen; nI+=3 )
         {
            var pt = [this.m_PosArray.pa[nI] + aIO[nH], this.m_PosArray.pa[nI + 1]];
            aTmp.push(pt);
         }
         this.m_Pos.push( aTmp );
      }
   }
   
   
   this.CalculateLabelPos = recalc;
   
   
   this.GetLabelTextColor = function( )
   {
      if ( !this.m_LabelTextColor.length )
      {
         var rgba = VBI.Types.string2rgba( this.m_BgColor );
         if ( rgba[3] == 0 && rgba[4] == 1 )    //transparent background
         {
            this.m_LabelTextColor[0] = "#FFFFFF";
            this.m_LabelTextColor[1] = "#000000";
         }
         else
         {
            // calculate brightness difference to get the best contrast
            var idxText = ( 299 * 250 +  587 * 250 +  114 * 250) / 1000.0;
            var idxBgCol = ( 299 * rgba[0] +  587 * rgba[1] +  114 * rgba[2]) / 1000.0;
            if ( Math.abs( idxBgCol - idxText ) <= 125.0 )
               this.m_LabelTextColor[0] = "#000000";
            else
               this.m_LabelTextColor[0] = "#FAFAFA";
         }
      }
      return  this.m_LabelTextColor;
   };
   
   
   this.SetDimensions = function( preconfiguredDC )
   {
      if (  !this.m_Width ||  !this.m_Height )
      {
         var substrings = this.m_Text.split(/\r\n/);
         var nMaxLength = 0;
         var nMaxIdx = 0;
         var nLineHeight = VBI.Utilities.RemToPixel( 0.75 );
         for( var nJ = 0; nJ < substrings.length; nJ++ )
         {
            var ntmp = substrings[nJ].length;
            if ( ntmp > nMaxLength )
            {
               nMaxLength = ntmp;
               nMaxIdx = nJ;
            }
         }

         this.m_Width = preconfiguredDC.measureText(substrings[nMaxIdx]).width + this.m_Padding * 2;
         this.m_Height = nLineHeight * substrings.length + this.m_Padding * 2;
      }

   };
   
   this.AlignLabel = function()
   {
      if ( !this.m_bAligned && this.m_rcBox )
      {
         for ( var nI = 0; nI < this.m_Pos.length; nI++ )   // loop over all Positions 
         {
            for ( var nJ = 0; nJ < this.m_Pos[nI].length; nJ++ )
            {
               var pt = this.m_Pos[nI][nJ];

               switch( this.m_Align )
               {
               case 0:
                  pt[0] -= this.m_Width / 2;
                  pt[1] -= ( this.m_rcBox[3] - this.m_rcBox[1] ) / 2 + this.m_Height / 2;
                  break;
               case 1:
                  pt[0] -= this.m_Width / 2;
                  pt[1] -= ( this.m_rcBox[3] - this.m_rcBox[1] )  + this.m_Height;
                  break;
               case 2:
                  pt[0] += ( this.m_rcBox[2] - this.m_rcBox[0] ) / 2;
                  pt[1] -= ( this.m_rcBox[3] - this.m_rcBox[1] )  + this.m_Height;
                  break;
               case 3:
                  pt[0] += ( this.m_rcBox[2] - this.m_rcBox[0] ) / 2;
                  pt[1] -= ( this.m_rcBox[3] - this.m_rcBox[1] ) / 2  + this.m_Height / 2;
                  break;
               case 4:
                  pt[0] += ( this.m_rcBox[2] - this.m_rcBox[0] ) / 2;
                  break;
               case 5:
                  pt[0] -= ( this.m_Width / 2 );
                  break;
               case 6:
                  pt[0] -= ( this.m_rcBox[2] - this.m_rcBox[0] ) / 2 + this.m_Width;
                  break;
               case 7:
                  pt[0] -= ( this.m_rcBox[2] - this.m_rcBox[0] ) / 2 + this.m_Width;
                  pt[1] -= ( this.m_rcBox[3] - this.m_rcBox[1] ) / 2  + this.m_Height / 2;
                  break;
               case 8:
                  pt[0] -= ( this.m_rcBox[2] - this.m_rcBox[0] ) / 2 + this.m_Width;
                  pt[1] -= ( this.m_rcBox[3] - this.m_rcBox[1] )  + this.m_Height;
                  break;
               default:
                  break;
               }
               if ( !this.CalculateLabelPos)
                  pt[0] += this.m_aIO[nJ];
            }
         }
      }
      this.m_bAligned = true;
   };
   
   this.clear = function()
   { 
      this.CalculateLabelPos = null;
      this.m_Pos = null;  
      this.m_PosArray = null;
      this.m_rcBox = null;
      this.m_aIO = null;
      this.m_LabelTextColor = null;
   };
   
   return this;
};

VBI.DnDInfo = function(  )
{
   var dndInfo = {};    // create the object
   dndInfo.m_datasource = null;
   dndInfo.m_boundtype = null;
   dndInfo.m_type = [];
   
   dndInfo.clear = function()
   {
      for( var nJ = 0; nJ < dndInfo.m_type.length; ++nJ )
         dndInfo.m_type[nJ].clear();
      if ( dndInfo.m_boundtype )
         dndInfo.m_boundtype.clear();
      if ( dndInfo.m_datasource )
         dndInfo.m_datasource.clear();
      dndInfo.m_datasource = null;
      dndInfo.m_boundtype = null;
      dndInfo.m_type = [];
   };

   // load from json parsed object
   dndInfo.load = function( dat, ctx, inst  )
   {
      if( dat )
      {

         if( jQuery.type( dat ) == 'array' )
         {
            // load the vo array.............................................//
            for( var nJ = 0; nJ < dat.length; ++nJ )
            {
               if( jQuery.type( dat[nJ] ) == 'object' )  
               {
                  if ( dat[nJ].datasource )
                  {
                     dndInfo.m_datasource  = new VBI.NodeProperty( dat[nJ], 'datasource', inst.m_DataSource, ctx );
                     dndInfo.m_boundtype  =  new VBI.AttributeProperty( dat[nJ], 'type', dndInfo.m_datasource, ctx );
                  }
                  else
                     dndInfo.m_type.push( new VBI.AttributeProperty( dat[nJ], 'type', null, ctx ) );

               }
            }
         }
         else if( jQuery.type( dat ) == 'object' )
         {
            if ( dat.datasource )
            {
               dndInfo.m_datasource  = new VBI.NodeProperty( dat, 'datasource', inst.m_DataSource, ctx );
               dndInfo.m_boundtype  =  new VBI.AttributeProperty( dat, 'type', dndInfo.m_datasource, ctx );
            }
            else
               dndInfo.m_type.push( new VBI.AttributeProperty( dat, 'type', null, ctx ) );
         }
      }
      
   };
   dndInfo.getItemArray = function( ctx )
   {
      var aValue = [];
      if ( dndInfo.m_datasource )
      {
         var ds = dndInfo.m_datasource;
         var nCurNde;
         if ( nCurNde = ds.GetCurrentNode( ctx ) )
         {
            for( var nS = 0; nS < nCurNde.m_dataelements.length; ++nS )
            {
               ds.Select( nS );
               aValue.push( dndInfo.m_boundtype.GetValueString( ctx ) );
            }
         }
      }
      if ( dndInfo.m_type.length )
      {
         for( var nS = 0; nS < dndInfo.m_type.length; ++nS )
            aValue.push( dndInfo.m_type[nS].GetValueString( ctx ) );
      }
      return aValue;
   };
   return dndInfo;
};

//...........................................................................//
// vo properties.............................................................//

VBI.NodeProperty = function( dat, name, pnp, ctx )
{
   // a datanode can be bound or not.........................................//
   // in both cases a data node is referenced................................//
   var path = null;
   if( !(path = dat[ name ] ))
      path = dat[ name +".bind" ];

   this.m_NPath = path.split(".");           // store the data source path...//
   this.m_Path = path.split(".");            // store the original data path.//
   this.m_PNP = pnp;                         // store the parentnodeproperty.//
   this.m_nCurElement = 0;                   // current element index........//
   this.m_CurElement = null;                 // current element instance.....//

   // determine the real parent node for this node...........................//
   // and the relative path of this node to the parents node.................//

   // update members.........................................................//
   this.m_DTN = ctx.m_DataTypeProvider.FindTypeNodeFromPath( this.m_Path );

   // determine the real responsible node parent.............................//
   var tmp = this;
   while( tmp = tmp.m_PNP )
   {
      if( ctx.m_DataTypeProvider.isParentOf( tmp.m_DTN, this.m_DTN ) )
      {
         // adjust the path..................................................//
         var nJ, tmppath = tmp.m_DTN.GetPath();
         for( nJ = 0; nJ < tmppath.length; ++nJ )
         {
            if( this.m_NPath[0] == tmppath[nJ] )
               this.m_NPath.splice(0,1);    // remove first
            else                  
               break;
         }
         break;
      }
   }
   this.m_PNP = tmp;

   //........................................................................//   
   // data change notification...............................................//

   this.NotifyDataChange = function( ctx )
   { 
      // current element instance is lazy determined later, therefore reset..//
      // when data has changed...............................................//
      this.m_CurElement = null;  

      // update members......................................................//
      this.m_DTN = ctx.m_DataTypeProvider.FindTypeNodeFromPath( this.m_Path );
   };

   this.clear = function()
   { 
      // clear the node property.............................................//
      this.m_PNP = null;         // reset parent node property
      this.m_CurElement = null;  // reset current element reference
      this.m_DTN = null;         // reset data type node reference
      this.m_NPath = null;       // reset adjusted node path
      this.m_Path = null;        // reset original node path         
   };

   //........................................................................//
   // helper functions.......................................................//

   this.GetCurrentElement = function( ctx )
   {
      if( this.m_CurElement ) 
         return this.m_CurElement;              // return the cached element.//

      var dn = this.GetCurrentNode( ctx );
      if( !dn ) return null;
      
      // cache the current iterated element..................................//
      return ( this.m_CurElement = dn.m_dataelements[ this.m_nCurElement ] );
   };

   this.GetIndexedElement = function( ctx, idx )
   {
      var dn = this.GetCurrentNode( ctx );
      if( !dn ) return null;
      return dn.m_dataelements[ idx ];
   };

   this.GetCurrentNode = function( ctx )
   {
      var dn = null;
      if( this.m_PNP )
      {
         // there is a parent, get the right index there.....................//
         var de = this.m_PNP.GetCurrentElement( ctx );
         dn = de.FindNodeFromPath( this.m_NPath );
      } else
      {
         // determine the datanode directly..................................//
         dn = ctx.m_DataProvider.FindNodeFromPath( this.m_NPath );
      }
      return dn;
   };

   // this is the selection iterator.........................................//
   // and is just set to be able to iterate over elements....................//

   this.Select = function( idx )
   {
      // reset current element first, determine the current element when.....//
      // necessary again.....................................................//
      this.m_CurElement = null;
      this.m_nCurElement = idx;
   };

   // edit mode handling.....................................................//
   // current edit mode state is stored on element level.....................//

   this.SetEditMode = function( ctx, mode )
   {
      var de;
      if( de = this.GetCurrentElement( ctx ) )
         de.m_EditMode = mode;
   };

   this.GetEditMode = function( ctx )
   {
      var de;
      if( ( de = this.GetCurrentElement( ctx ) ) && ( de.m_EditMode != undefined ) )
         return de.m_EditMode;

      return VBI.EMHandle;     // handle mode is the default...//
   };

   // diagnostics............................................................//

   this.IsElementSelected = function( ctx )
   {
      var de;
      if( de = this.GetCurrentElement( ctx ) )
         return de.IsSelected();

      return false;
   };

   this.SetSelected = function( ctx, bSelect )
   {
      // todo: set the selection state in the current selected item..........// 
      return;
   };

   return this;
};

//...........................................................................//
// bindable attribute object.................................................//

VBI.AttributeProperty = function( dat, name, pnp, ctx, def )
{
   var val;

   // store a default value..................................................//
   this.m_DefaultValue = def;

   if( val = dat[ name ] )
   {
      // there is no binding, use the specified name.........................//
      this.m_Name = name;
      this.m_Value = val;
   } else
   if( val = dat[ name + ".bind" ] )
   {
      this.m_PNP = pnp;      
      this.m_Name = name;
      this.m_RelBind = val.split(".");   // relative binding path............//
      this.m_AbsBind = val.split(".");   // absoulte original binding path...//

      // determine the datatype attribute....................................//
      this.m_DTA = ctx.m_DataTypeProvider.FindTypeAttributeFromPath( this.m_AbsBind );

      // determine the real parent node and the relative the binding path....//
      var tmp = this;
      while( tmp = tmp.m_PNP )
      {
         if( ctx.m_DataTypeProvider.isParentOf( tmp.m_DTN, this.m_DTA ) )
         {
            // adjust the path...............................................//
            var nJ, tmppath = tmp.m_DTN.GetPath();
            for( nJ = 0; nJ < tmppath.length; ++nJ )
            {
               if( this.m_RelBind[0] == tmppath[nJ] )
                  this.m_RelBind.splice(0,1);    // remove first
               else                  
                  break;   
            }
            break;
         }
      }
      this.m_PNP = tmp;
   }
   
   // data change notification...............................................//

   this.NotifyDataChange = function( ctx )
   {
      // data in the datacontext has changed.................................//
      // determine the new datatype attribute when...........................//
      if( this.m_AbsBind )
         this.m_DTA = ctx.m_DataTypeProvider.FindTypeAttributeFromPath( this.m_AbsBind );
   };

   this.clear = function()
   { 
      // clear the attribute properties......................................//
      this.m_PNP = null;            // reset the parent
      this.m_DTA = null;            // reset the type reference
      this.m_DefaultValue = null;

      // delete optional properties..........................................//
      if( this.m_Name ) this.m_Name = null;
      if( this.m_Value ) this.m_Value = null;
      if( this.m_PNP ) this.m_PNP = null;
      if( this.m_RelBind ) this.m_RelBind = null;
      if( this.m_AbsBind ) this.m_AbsBind = null;
   };

   this.IsChangeable = function( ctx )
   {
      var attrib;
      if( attrib = this.GetAttributeObject( ctx ) )
         return attrib.IsChangeable();
      return false;
   };

   //........................................................................//
   // data access............................................................//

   this.GetAttributeObject = function( ctx )
   {
      // this can only be called when binding is valid, in this case.........//
      // the data attribute is delivered.....................................//
      if( this.m_RelBind )
      {
         if( this.m_PNP )  // relative node property
            return this.m_PNP.GetCurrentElement( ctx ).FindAttributeFromPath( this.m_RelBind );
         else 
            return ctx.m_DataProvider.FindAttributeFromPath( this.m_RelBind );
      }
      return null;
   };

   this.GetValueFloat = function( ctx )
   {
      // when this is an explicit property then return it immediately........//
      if( this.m_Value ) 
         return VBI.Types.string2float( this.m_Value );

      if( this.m_RelBind )
      {
         var attrib;
         if( attrib = this.GetAttributeObject( ctx ) )
         {
            if( attrib.m_dta.m_Type == VBI.Types.st_float )
               return attrib.m_Value;
            if( attrib.m_dta.m_Type == VBI.Types.st_string )
               return VBI.Types.string2float( attrib.m_Value ) ;
            if( attrib.m_dta.m_Type == VBI.Types.st_long )
               return VBI.Types.long2float( attrib.m_Value );
            if( attrib.m_dta.m_Type == VBI.Types.st_bool )
               return attrib.m_Value ? 1.0 : 0.0;

            // todo: do other conversions here
         }
      }

      return this.m_DefaultValue;
   };

   this.GetValueString = function( ctx )
   {
      // when this is an explicit property then return it immediately........//
      if( this.m_Value ) 
         return this.m_Value;

      if( this.m_RelBind )
      {
         var attrib;
         if( attrib = this.GetAttributeObject( ctx ) )
         {
            if( attrib.m_dta.m_Type == VBI.Types.st_string )
               return attrib.m_Value;
            else
               return attrib.GetStringValue();
         }
      };

      return this.m_DefaultValue;
   };

   this.GetValueLong = function( ctx )
   {
      if( this.m_Value ) 
         return VBI.Types.string2long( this.m_Value );

      if( this.m_RelBind )
      {
         var attrib;
         if( attrib = this.GetAttributeObject( ctx ) )
         {
            if( attrib.m_dta.m_Type == VBI.Types.st_long )
               return attrib.m_Value;
            if( attrib.m_dta.m_Type == VBI.Types.st_bool )
               return attrib.m_Value;
            if( attrib.m_dta.m_Type == VBI.Types.st_string )
               return VBI.Types.string2long( attrib.m_Value );
            if( attrib.m_dta.m_Type == VBI.Types.st_float )
               return VBI.Types.float2long( attrib.m_Value );

            // todo: do other conversions here
         }
         
      };
      
      return this.m_DefaultValue;
   };

   this.GetValueBool = function( ctx )
   {
      if( this.m_Value )
         return VBI.Types.string2bool( this.m_Value );

      if( this.m_RelBind )
      {
         var attrib;
         if( attrib = this.GetAttributeObject( ctx ) )
         {
            if( attrib.m_dta.m_Type == VBI.Types.st_bool )
               return attrib.m_Value;
            if( attrib.m_dta.m_Type == VBI.Types.st_string )
               return VBI.Types.string2bool( attrib.m_Value );

            // todo: do other conversions here

         }
      };
      
      return this.m_DefaultValue;
   };

   this.GetValueVector = function( ctx )
   {
      // when this is an explicit property then return it immediately........//
      if( this.m_Value )
         return VBI.Types.string2vector( this.m_Value );

      if( this.m_RelBind )
      {
         var attrib;
         if( attrib = this.GetAttributeObject( ctx ) )
         {
            if( ( attrib.m_dta.m_Type == VBI.Types.st_vector)  || ( attrib.m_dta.m_Type == VBI.Types.st_vectorarray ) )
               return attrib.m_Value;
            if( attrib.m_dta.m_Type == VBI.Types.st_string )
               return VBI.Types.string2vector( attrib.m_Value );

            // todo: do other conversions here
         }
      }
      
      return this.m_DefaultValue;
   };

   this.GetValueColor = function( ctx )
   {
      // when this is an explicit property then return it immediately........//
      if( this.m_Value )
         return VBI.Types.string2color( this.m_Value );

      if( this.m_RelBind )
      {
         // assume that the data is already a color..........................//
         var attrib;
         if( attrib = this.GetAttributeObject( ctx ) )
         {
            if( ( attrib.m_dta.m_Type == VBI.Types.st_color  ) )
               return attrib.m_Value;
            if( attrib.m_dta.m_Type == VBI.Types.st_string )
               return VBI.Types.string2color( attrib.m_Value );

            // todo: do other conversions here
         }
      }
     
      return this.m_DefaultValue;
   };

   //........................................................................//
   // modification functions.................................................//

   this.SetValueVector = function( ctx, val )
   {
      // when this is an explicit property then return it immediately........//
      if( this.m_Value )
         return null;      // only bound properties can be changed...........// 

      if( this.m_RelBind )
      {
         var attrib;
         if( attrib = this.GetAttributeObject( ctx ) )
         {
            if( ( attrib.m_dta.m_Type == VBI.Types.st_vector)  || ( attrib.m_dta.m_Type == VBI.Types.st_vectorarray ) )
               attrib.set( val );
            if( attrib.m_dta.m_Type == VBI.Types.st_string )
               attrib.set( VBI.Types.float2string( val ) );
         }
      }
      
      return null;
   };

   this.SetValueFloat = function( ctx, val )
   {
      // when this is an explicit property then return it immediately........//
      if( this.m_Value )
         return null;      // only bound properties can be changed...........// 

      if( this.m_RelBind )
      {
         var attrib;
         if( attrib = this.GetAttributeObject( ctx ) )
         {
            if( ( attrib.m_dta.m_Type == VBI.Types.st_float) )
               attrib.set( val );
            else
            if( ( attrib.m_dta.m_Type == VBI.Types.st_long) )
               attrib.set( VBI.Types.float2long( val ) );
            else
            if( attrib.m_dta.m_Type == VBI.Types.st_string )
               attrib.set( VBI.Types.float2string( val ) );
         }
      }
      
      return null;
   };

   // diagnostics............................................................//
   this.IsBound = function()
   {
      return this.m_RelBind ? true : false;
   };
   
   return this;
};

//...........................................................................//
// visual objects............................................................//

VBI.VisualObjects = function()
{
   // namespace constants....................................................//
   VBI.EMHandle = 0;                              // handle edit mode
   VBI.EMBox =  1;                                // box edit mode

   VBI.HTHANDLE = 0;                              // hit on design handle
   VBI.HTBOX = 1;                                 // hit in box
   VBI.HTBOXHANDLE = 2;                           // hit on boxhandle

   var visualobjects = {};
   visualobjects.vbiclass = "VisualObjects"; 

   //........................................................................//
   // class factory mapping for objects......................................//

   visualobjects.Factory = 
   {
      "{00100000-2012-0004-B001-64592B8DB964}" : function(){ return new  VBI.VisualObjects.Spot();       },
      "{00100000-2012-0004-B001-C46BD7336A1A}" : function(){ return new  VBI.VisualObjects.Route();      },
      "{00100000-2013-0004-B001-7EB3CCC039C4}" : function(){ return new  VBI.VisualObjects.Circle();     }, // circle
      "{00100000-2013-0004-B001-686F01B57873}" : function(){ return new  VBI.VisualObjects.CircleDist(); }, // distant circle
      "{00100000-2012-0004-B001-383477EA1DEB}" : function(){ return new  VBI.VisualObjects.Pie();        },
      "{00100000-2012-0004-B001-BFED458C3076}" : function(){ return new  VBI.VisualObjects.Box();        },
      "{00100000-2012-0004-B001-F311DE491C77}" : function(){ return new  VBI.VisualObjects.Area();       }, // area
      "{00100000-2012-0004-B001-E180770E8A12}" : function(){ return new  VBI.VisualObjects.HeatMap();    }, // heatmap
      "{00100000-2012-0070-1000-35762CF28B6B}" : function(){ return new  VBI.VisualObjects.Dummy();      }, // collada
      "{00100000-2014-0004-B001-9F1B43BE944A}" : function(){ return new  VBI.VisualObjects.Route();      }, // ext link
      "{00100000-2014-0004-BDA8-87B904609063}" : function(){ return new  VBI.VisualObjects.Area();       }, // ext area
      "{00100000-2012-0004-B001-2297943F0CE6}" : function(){ return new  VBI.VisualObjects.Container();  }, // chartcontainer      
      
      // 2D controls.........................................................// 
      "{00100000-2013-1000-1100-50059A6A47FA}" : function(){ return new  VBI.VisualObjects.Caption();    },  // caption ( sectionheader )
      "{00100000-2013-1000-3700-AD84DDBBB31B}" : function(){ return new  VBI.VisualObjects.Label();      },  // label
      "{00100000-2013-1000-2400-D305F7942B98}" : function(){ return new  VBI.VisualObjects.Link();       },  // link
      "{00100000-2013-1000-2200-6B060A330B2C}" : function(){ return new  VBI.VisualObjects.Image();      },  // image
      "{00100000-2013-1000-1200-855B919BB0E9}" : function(){ return new  VBI.VisualObjects.Button();     },  // button
   };

   // class factory instance creation........................................//
   visualobjects.Factory.CreateInstance = function( clsid )
   {
      return visualobjects.Factory[ clsid ]();
   };

   //........................................................................//
   // base class for visual objects..........................................//
   
   VBI.VisualObjects.Base =
   {
      // vo properties.......................................................//
      m_Props : null,
      m_Scene : null,               // scene backreference...................//

      m_BB : [],                    // bounding box of the master object.....//
      m_IO : [],                    // offsets of master for round world.....//

      m_colorHot : 'rgba( 240, 171, 0, 0.5 )',        // hot color
      m_defaultColor : 'rgba( 255, 0, 0, 1.0 )',      // default color
      m_defaultTooltip : '',                          // default tooltip
      
      // members for Labeltext ..............................................//
      m_defaultLabeltext : '',                        // default labeltext
      m_defaultLabelBgCol : 'RGBA(200,200,200,200)',
      m_Label : [], 

      // design mode members.................................................//
      m_DH : [],                    // designmode handles....................//
      m_szHandle : 8,               // designmode handle size
      m_Track : null,               // track object
      m_DragSourceInfo : null,
      m_DropTargetInfo : null,
      
      LoadDragDropInfo : function( dat, ctx, inst )
      {
         if( dat.DragSource && dat.DragSource.DragItem )
         {
            inst.m_DragSourceInfo = new VBI.DnDInfo;
            inst.m_DragSourceInfo.load( dat.DragSource.DragItem, ctx, inst );
         }
         if( dat.DropTarget && dat.DropTarget.DropItem )
         {
            inst.m_DropTargetInfo = new VBI.DnDInfo;
            inst.m_DropTargetInfo.load( dat.DropTarget.DropItem, ctx, inst );
         }

      },
      
      // base loading of common properties...................................//
      BaseLoad : function( dat, ctx, inst )
      {
         VBI.m_bTrace && VBI.Trace("BaseLoad");

         inst.m_Props.push( inst.m_HotScale = new VBI.AttributeProperty( dat, 'hotScale', inst.m_DataSource, ctx, [ 1.0, 1.0, 1.0 ] ) );
         inst.m_Props.push( inst.m_HotDeltaColor = new VBI.AttributeProperty( dat, 'hotDeltaColor', inst.m_DataSource, ctx, null ) );
         inst.m_Props.push( inst.m_SelectColor = new VBI.AttributeProperty( dat, 'selectColor', inst.m_DataSource, ctx, null ) );
         inst.m_Props.push( inst.m_FxSize = new VBI.AttributeProperty( dat, 'fxsize', inst.m_DataSource, ctx, true ) );
         inst.m_Props.push( inst.m_FxDir = new VBI.AttributeProperty( dat, 'fxdir', inst.m_DataSource, ctx ) );
         inst.m_Props.push( inst.m_Entity = new VBI.AttributeProperty( dat, 'entity', inst.m_DataSource, ctx, null ) );
         
         inst.m_Props.push( inst.m_Labeltext = new VBI.AttributeProperty( dat, 'labelText', inst.m_DataSource, ctx, inst.m_defaultLabeltext ) );
         inst.m_Props.push( inst.m_LabelBgCol = new VBI.AttributeProperty( dat, 'labelBgColor', inst.m_DataSource, ctx, inst.m_defaultLabelBgCol ) );
         inst.m_Props.push( inst.m_LabelPos = new VBI.AttributeProperty( dat, 'labelPos', inst.m_DataSource, ctx ) );
         inst.m_Props.push( inst.m_DragData = new VBI.AttributeProperty( dat, 'dragdata', inst.m_DataSource, ctx, null ) );
         
         this.LoadDragDropInfo( dat, ctx, inst );         
         
      },

      //.....................................................................//
      // common message handling base functions..............................//

      BaseMousemove : function( event )
      {
         VBI.m_bTrace && VBI.Trace("BaseMousemove");

         // do not handle mouse moves in tracking mode.......................//
         // to prevent from flickering.......................................//
         if( this.m_Track )
            return false;

         if( !this.GetHitArray )
            return false;

         // determine the instances that are hit.............................//
         var hits = this.GetHitArray( event.offsetX, event.offsetY );

         // set the hot item.................................................//
         if( hits.length > 0 )
         {
            var scene = this.m_Scene;

            // this can be a design handle as well...........................//
            if (scene.InternalSetHotItem( this, hits[0] ))
            {
                // when the instance has a tooltip then set it...............//
                if( !hits[0].m_Design && this.m_Tooltip )
                {
                   scene.SetToolTip( this.getTooltip( scene.m_Ctx , hits[0] ));
                }

                // determine the current cursor dependent on the hit.........//
                var cursor;
                if( cursor = this.DetailCursor( event, hits[0] ) )
                   scene.SetCursor( cursor );
            }
         }

         return hits.length > 0 ? true : false;
      },

      BaseContextmenu : function( event )
      {
         VBI.m_bTrace && VBI.Trace("BaseContextmenu");

         if( !this.GetHitArray )
            return false;

         // determine the instances that are hit.............................//
         var hits = this.GetHitArray( event.offsetX, event.offsetY );

         // set the hot item.................................................//
         if( hits.length > 0 )
         {
            var scene = this.m_Scene, hn = hits[0];
            var myIndex = this.GetDataIndex(hn.m_Index);
            var ele = this.m_DataSource.GetIndexedElement( scene.m_Ctx, myIndex );

            var action, actions = scene.m_Ctx.m_Actions;

            // check for design handle context menu subscription.............//
            if( actions && hn.m_Design && ( hn.m_Hit == VBI.HTHANDLE ) )
            {
               // check if action is subscribed..............................//
               if( action = actions.findAction( "HandleContextMenu", scene, this ) )
               {
                  var params = scene.GetEventVPCoordsObj( event );
                  params.handle = hn.m_Handle.toString();
                  this.m_Scene.m_Ctx.FireAction( action, scene, this, ele, params );

                  // prevent from default handling...........................//
                  event.preventDefault();
                  return true;
               }
            }

            // before we can fire the context menu, check the instance for...//
            // click, a detailed contextmenu can be in an edge or a waypoint.//

            if( this.DetailContextmenu( event, ele, hits[0] ) )
            {
               event.preventDefault();
               return true;
            }

            // check for subscribed action and raise it......................//
            if( actions )
            {
               // check if action is subscribed..............................//
               if( action = actions.findAction( "ContextMenu", scene, this ) ){
                  this.m_Scene.m_Ctx.FireAction( action, scene, this, ele, scene.GetEventVPCoordsObjWithScene( event ) );
                  event.preventDefault();
                  return true;
               }
            }

            // always prevent from default handling when there was a hit.....//
            event.preventDefault();
         }

         return false;
      },

      //.....................................................................//
      // action finding......................................................//

      BaseFindAction : function( name )
      {
         // check if the edge click is subscribed............................//
         var scene = this.m_Scene, actions = scene.m_Ctx.m_Actions;
         return actions ? actions.findAction( name, scene, this ) : null;
      },
      
      //.....................................................................//
      // common event raising................................................//
      
      BaseClick : function( event )
      {
         VBI.m_bTrace && VBI.Trace("BaseClick");

         if( !this.GetHitArray )
            return false;

         var scene = this.m_Scene;
         var hits = this.GetHitArray( event.offsetX, event.offsetY );

         // set the hot item and raise click event...........................//
         if( !hits.length )
            return false;
         var myIndex = this.GetDataIndex( hits[0].m_Index );

         // set the datanode iterator to the hit element....................//
         this.m_DataSource.Select( myIndex );

         scene.RenderAsync( false );  // trigger async rendering....................//

         // determine the data element of the instance that is hit...........//
         // and process selection............................................//
         // shift-key adds selection.........................................//
         // ctrl-key toggle selection........................................//
         // for touch events we always toggle selection state................//

         var ele;
         if( ele = this.m_DataSource.GetIndexedElement( scene.m_Ctx, myIndex ) )
         {
            if( ( event.type.indexOf( "touch" ) >= 0 ) || (event.type.indexOf( "pointer" ) >= 0 ) )
               ele.Select( this.IsSelected( scene.m_Ctx ) ? false : true );
            else
            if( event.shiftKey == true )     // add it to the selection
               ele.Select( true );
            else
            if( event.ctrlKey  == true )     // toggle the current selection
               ele.Select( this.IsSelected( scene.m_Ctx ) ? false : true );
            else
            {
               // and select the single one..................................//
               ele.GlobalSingleSelect();
            }
            if (scene.m_PreassembledData)
            	scene.UpdatePreData4Selected( this.m_nPreDataIndex, this.GetInternalIndex(hits[0].m_Index ));
         }

         // when the position is changeable the click should toggle the......//
         // selection mode between box and handle, clicks are not fired......//
         if( this.IsPosChangeable( scene.m_Ctx ) )
         {
            // determine new edit mode.......................................//
            var em = this.m_DataSource.GetEditMode( scene.m_Ctx ) == VBI.EMHandle ? VBI.EMBox : VBI.EMHandle;
            VBI.m_bTrace && VBI.Trace( "SetEditMode: " + em );

            this.m_DataSource.SetEditMode( scene.m_Ctx, em );
            event.preventDefault();
            return true;
         }

         // before we can fire the click, check the instance for detailed....//
         // click, a detailed click can be a click in an edge or waypoint....//

         if( this.DetailClick( event, ele, hits[0] ) )
         {
            event.preventDefault();
            return true;
         }

         // check for subscribed action and fire event.......................//
         var actions;
         if( actions = scene.m_Ctx.m_Actions )
         {
            var action;
            if( action = actions.findAction( "Click", scene, this ) )
            {
               this.m_Scene.m_Ctx.FireAction( action, scene, this, ele, scene.GetEventVPCoordsObj( event ) );
               event.preventDefault();
               return true;
            }
         }
         
      	 return false;
      },

      // base routine for hit testing the bounding boxes in the right order..//
      // with taking care about round world behavior.........................//
      // the returned information is an array of hit information objects.....//
      BaseHitTest : function( nsx, nsy, ocb )
      {
         var tmp, hits = [];

         // returns an array of objects, containing the index and............//
         // other detailed hit data..........................................//
         // hit testing must be done in the reverse order....................//
         // a callback object is used to define the params of the detail hit.//
         // test.............................................................//
         var ptInRect = VBI.Utilities.PtInRect;

         //..................................................................//
         // do hit testing on all design handles first.......................//
         // the ocb is filled with the required hit information..............//

         var hi = { };  // hit information...................................//
         if( this.BaseDesignHitTest( nsx, nsy, hi ) )
         {
            // design handle hit found.......................................//
            hits.push( hi );
            return hits;
         }

         for( var nJ = this.m_BB.length - 1; nJ >= 0; --nJ )            // loop for data bound instances
         {
            if( tmp = this.m_BB[ nJ ] )
            for( var nK = this.m_IO[ nJ ].length - 1; nK >= 0; --nK )   // loop for round world instances
            {
               var off = this.m_IO[ nJ ][ nK ];
               if( !ptInRect( [ nsx - off, nsy ], tmp ) )
                  continue;

               // hit test fits..............................................//
               // do detail hittest using callback...........................//
               if( ocb )
               {
                  // do call back, transform coord to master instance........//
                  var ret = ocb.m_cb( ocb, nJ, nsx - off, nsy);
            	  
                  if( ret && ret.m_hit > 0 )             // this is a hit
                  {
                     hits.push( { m_Index: nJ, m_Entity: this.GetEntity(nJ,this.m_Scene.m_Ctx), m_Detail: ret } );
                     if( ret.m_hit == 1 )  // 1: true hit, 2: diffuse hit (e.g. transparent objects )
                    	 return hits;
                  }
               }
            }
         }
         return hits;
      },

      // clear the vo........................................................//
      clear : function()
      { 
         // call the clear on the properties.................................//
         if( this.m_Props )
         {
            for( var nJ = 0; nJ < this.m_Props.length; ++nJ )
               this.m_Props[nJ].clear();
          
            // destroy the props array.......................................//
            this.m_Props = null;
         }

         // clear drag and drop info
         if( this.m_DragSourceInfo )
         {
            this.m_DragSourceInfo.clear();
            this.m_DragSourceInfo = null;
         }
         if( this.m_DropTargetInfo )
         {
            this.m_DropTargetInfo.clear();
            this.m_DropTargetInfo = null;
         }
         
         // reset the backreference..........................................//
         this.m_Scene = null;

         // reset objects....................................................//
         this.m_Track = null;

         // cleararrays......................................................//
         this.m_BB = null;
         this.m_IO = null;
         this.m_DH = null;    
         
         if( this.m_Label )
         {
            for ( var nJ = 0; nJ < this.m_Label.length; ++nJ )
               this.m_Label[nJ].clear();
            this.m_Label = [];
         }
      },

      // load the basic properties of a visual object........................//
      load : function( instance, dat, ctx )
      { 
         // non bindable properties
         if( dat.id )
            instance.m_ID = dat.id;

         // load generic properties here.....................................//
         this.m_Props = [];
         this.m_DragSourceInfo = null;
         this.m_DropTargetInfo = null;         
      },

      NotifyDataChange : function( ctx )
      {   
         // iterate through properties and update them due data has changed..//
         if( this.m_Props )
         {
            for( var nJ = 0, len = this.m_Props.length; nJ < len; ++nJ )
               this.m_Props[nJ].NotifyDataChange( ctx ); 
         }
         
         // set an additional marker for all vos even when not used..........//
         this.m_bChanged = true; 
      },

      IsPosChangeable : function( ctx )
      {
         // determine if position is changeable..............................//
         if( this.m_Pos )
            return this.m_Pos.IsChangeable( ctx );
         return false;
      },

      IsSelected : function( ctx )
      {
         if( this.m_DataSource )
            return this.m_DataSource.IsElementSelected( ctx );

         return false;
      },

      IsHandleMode : function()
      {
         // checks the current state if handles should be displayed for......//
         // editing..........................................................//
         return this.m_DataSource.GetEditMode( this.m_Scene.m_Ctx ) == VBI.EMHandle ? true : false;
      },

      IsBoxMode : function()
      {
         // checks the current state if a box should be displayed for........//
         // editing..........................................................//
            return this.m_DataSource.GetEditMode( this.m_Scene.m_Ctx ) == VBI.EMBox ? true : false;
      },
      
      IsDataAccepted : function( event )
      {
         
         var scene = this.m_Scene;

         // do nothing when tracking is active...............................//
         if( this.m_Track )
         {
            VBI.m_bTrace && VBI.Trace( "Error: Track object should be already gone");
            return false;
         }

         if( !this.GetHitArray )
            return false;

         // determine the instances that are hit.............................//
         var hit, hits = this.GetHitArray( event.offsetX, event.offsetY );

         if( hits.length && ( hit = hits[0] ).m_Design )
         {
            return false;
         }

         
         if( hits.length && scene.m_DragInfo )
         {
            this.m_DataSource.Select( hit.m_Index  );
            if ( this.m_DropTargetInfo )
            {
               var ctx = scene.m_Ctx;
               var aDropItems = this.m_DropTargetInfo.getItemArray(ctx);
               var aDragItems = scene.m_DragInfo.aItems;
               
               for(var nJ = 0; nJ < aDropItems.length; ++nJ ) 
               {
                  if ( aDragItems.indexOf(aDropItems[nJ]) != -1 )   
                  {
                     try
                     {
                        event.dataTransfer.dropEffect = 'copy';
                        event.stopPropagation();
                        event.preventDefault();

                     } catch( err )
                     {
                        // just trace the message...........................................//
                        VBI.m_bTrace && VBI.Trace( "Warning: sapvobase.IsDataAccepted exception occured: " + err.message );
                     }

                     return hit;
                  }
               }
            }
         }
         return false;
      },
            
      GetEntity : function( nIndex, ctx)
      {
    	  this.m_DataSource.Select( nIndex );
    	  return this.m_Entity.GetValueString( ctx );
      },
      
      IsHot : function( idx )
      {
         // returns true only when the object itself is hot..................//
         // when design handles are hit no hot state is reported.............//
         var scene = this.m_Scene, hi = scene.m_HotItem;

         // a VO is hot when there is an entity match........................//
         if( hi.m_Entity && hi.m_Entity == this.m_Entity.GetValueString( scene.m_Ctx ) )
            return true;

         // the index does not fit...........................................//
         if( !hi.m_HitObj || hi.m_Index != idx )
            return false;
         
         // it is not a hot design handle....................................//
         if( hi.m_Design )
            return false;

         // the vo does not fit..............................................//
         if( hi.m_VO != this )
            return false;

         // when no action is subscribed we do not show it as hot............//
//         if( !(actions = this.m_Scene.m_Ctx.m_Actions) || !actions.findAction( null, this.m_Scene, this ) )
//            return false;

         return true;
      },
      
      InternalChangeHotItem: function(oldIndex,newIndex){
    	  
      }, 
      
      IsClusterable: function(){
    	  return false;
      },
      
      GetDataIndex: function(BBIndex){
    	  return BBIndex;  // overwritten for clusterable VOs
      },
      
      GetInternalIndex: function(BBIndex){
    	  return BBIndex;  // overwritten for clusterable VOs
      },      
      
      ShowGrid: function( canvas, dc, preAssembledData ){
    	  // Shows the clustering grid on spots, for most VOs function does nothing
      },
      
	  getTooltip: function (ctx, hitObj )
	  {
         this.m_DataSource.Select( hitObj.m_Index );
         return  this.m_Tooltip.GetValueString( ctx ) ;
	  },      

	  getLabelData: function( bRecalc )
	  {
	     if ( bRecalc )
	     {
	        for (var nJ = 0; nJ < this.m_Label.length; nJ++ )
	        {
	           var lb = this.m_Label[nJ];
	           if ( lb.CalculateLabelPos && lb.m_PosArray.pa.length > 0 )
	           {
	              lb.m_Pos = [];    
	              for ( var nK = 0; nK < lb.m_aIO.length; nK++ )
	              {
	                 
	                 var aPositions = this.CalculateLabelPos( this.m_Scene, lb.m_PosArray, lb.m_aIO[nK] );
	                 if ( aPositions && aPositions.length > 0 )
	                    lb.m_Pos.push(aPositions);
	              }
	              lb.m_bAligned = false;
	           } 
	          
	           
	        }
	           
	        
	     }
	     return this.m_Label;
	  },
	  
      //.....................................................................//
      // design mode rendering...............................................//

      BaseRender : function( canvas, dc )
      {
         // when there are no design handles to render, return immediately...//
         var ldh = this.m_DH.length;

         if( !ldh )
            return;  // return immediately, no design handles available......//

         var tmp, tdx, tdy;
         var size = this.m_szHandle, hsize = size/2, sqdistance = 1.5 * size * size;
         var fs = dc.fillStyle;
         var fillShared =  'rgba(255,132,0,1.0)';     // shared handle
         var fillUnique =  'rgba(188,54,24,1.0)';     // unique handle
         var fillHot = 'rgba( 240, 171, 0, 1.0 )';    // hot handle

         var hi = this.m_Scene.m_HotItem;

         // render the design mode handles...................................//
         // only when subsequent handles are near a shared handle is rendered//
         // this is not correct in general due the handles should be arranged//
         // in a quadtree and aggregated there...............................//
         // to be done when the quadtree is working fine.....................//

         var aHandles, xy, bSharedHandle = false;
         for( var nJ = 0 ; nJ < ldh; ++nJ )
         {
            if( !(aHandles = this.m_DH[ nJ ] ) )
               continue;   // no design handles specified for this instance..//

            // even for design handles respect round world behavior..........//
            for( var nK = 0, lio = this.m_IO[nJ].length ; nK < lio; ++nK )
            {
               // transform to round world...................................//
               dc.setTransform( 1.0, 0.0, 0.0, 1.0, this.m_IO[nJ][nK], 0.0 );

               if( aHandles.m_EditMode == VBI.EMBox )
               {
                  // render the design box...................................//
                  if( aHandles.length == 1 )
                  {
                     xy = aHandles[ 0 ];       // xy must be a box...........//
                     VBI.Utilities.DrawDesignRect( dc, this.DesignGetActiveBoxHandles( nJ ), xy );
                  }
               } else
               // todo: add a else statement here
               {
                  dc.fillStyle = fillUnique;
                  dc.lineWidth = 1;

                  // render the design handles...............................//
                  tmp = null;                      // reset temp point

                  if( bSharedHandle )
                  { 
                     dc.fillStyle = fillUnique;    // reset fill color
                     bSharedHandle = false;        // rest shared handle state
                  }

                  for( var nL = 0, lh = aHandles.length; nL < lh; ++nL )
                  {
                     xy = aHandles[ nL ];

                     // first check for hot handle...........................//
                     var hot = ( hi.m_VO == this && hi.m_Index == nJ && hi.m_Design && hi.m_HitObj && hi.m_HitObj.m_Handle == nL );

                     // when the distance is too small between projected.....//
                     // points skip rendering................................//

                     if( tmp && (  ( ( tdx = ( tmp[0] - xy[0] ) ) * tdx ) +
                                   ( ( tdy = ( tmp[1] - xy[1] ) ) * tdy ) ) < sqdistance )
                     {
                        // rerender the last handle with a different fill....//
                        // style using same coordinates......................//
                        if( !bSharedHandle )
                        {
                           bSharedHandle = true;

                           dc.fillStyle = hot ? fillShared : fillHot;
                           dc.fill();
                        }
                        continue;
                     }

                     // the last rendered item was a shared handle, reset....//
                     // props................................................//
                     if( bSharedHandle )
                     {
                        dc.fillStyle = fillUnique;
                        bSharedHandle = false;
                     }

                     // first check for hot handle...........................//
                     if( hot )
                        dc.fillStyle = fillHot;       // reset fill color

                     // render it............................................//
                     dc.beginPath();                  
                     dc.rect( xy[0] - hsize, xy[1] - hsize, size, size );
                     dc.closePath();
                     dc.fill();

                     if( hot )
                        dc.fillStyle = fillUnique;       // reset fill color

                     // store the tmp........................................//
                     tmp = xy;  
                  }
               }
            }
         }

         // reset style and transforms.......................................//
         dc.fillStyle = fs; 
         dc.setTransform( 1.0, 0.0, 0.0, 1.0, 0.0, 0.0 );
      },

      //.....................................................................//
      // design mode mouse processing........................................//

      BaseDesignHitTest : function( nsx, nsy, hi )
      {
         // hi ( hit info ) gets:
         // m_Index ( vo instance )
         // m_Handle ( handle index )
         // m_NsX ( non scaled x position )
         // m_NsY ( non scaled y position )
         // return true when hit is detected

         VBI.m_bTrace && VBI.Trace( "BaseDesignHitTest nsx:" + nsx + " nsy:" + nsy + " instance:" + this.m_ID );

         var ldh = this.m_DH.length;
         if( !ldh ) 
            return false;           // no design handles at all..............//

         var size = this.m_szHandle, hsize = size/2.0;
         var PtInRect = VBI.Utilities.PtInRect;

         // reset hi.........................................................//
         if( hi.m_Handle ) 
            delete hi.m_Handle;

         // check the design mode handles....................................//
         // start from the end, which is the reverse rendering sequence......//
         var aHandles, xy;
         for( var nJ = ldh; nJ >= 0; --nJ )
         {
            if( !(aHandles = this.m_DH[ nJ ] ) )
               continue;

            for( var nK = 0; nK < this.m_IO[nJ].length; ++nK )
            {
               var dx = this.m_IO[nJ][nK];

               // check with respect to round world behavior.................//
               if( aHandles.m_EditMode == VBI.EMHandle )
               {
                  VBI.m_bTrace && VBI.Trace( "BaseDesignHitTest Handle" );
                  for( var nL = 0, len = aHandles.length; nL < len; ++nL )
                  {
                     xy = aHandles[nL];
                     if( PtInRect( [ nsx - dx, nsy ], [ xy[0] - hsize, xy[1] - hsize, xy[0] + hsize, xy[1] + hsize  ] ) )
                     {
                        VBI.m_bTrace && VBI.Trace( "BaseDesignHitTest Handle Hit! Index:" + nJ +" Handle: " + nL );
                        hi.m_Index = nJ;
                        hi.m_Design = true;        // flag indicating design handle hit
                        hi.m_Hit = VBI.HTHANDLE;   // hit on handle
                        hi.m_Handle = nL;
                        hi.m_NsX = nsx;      // store current non scaled x
                        hi.m_NsY = nsy;      // store current non scaled y
                        return true;
                     }
                  }
               } else
               if( aHandles.m_EditMode == VBI.EMBox )
               {
                  VBI.m_bTrace && ( aHandles.length > 1 || aHandles.length == 0 ) && VBI.Trace( "Error: Box edit mode must fill one rectangle only" );
                  xy = aHandles[0];
                  VBI.m_bTrace && VBI.Trace( "BaseDesignHitTest Box" );

                  // check for sizer handles.................................//
                  var r2 = 9;
                  var w = xy[2] - xy[0];
                  var h = xy[3] - xy[1];

                  var wh = w/2;
                  var hh = h/2;

                  // determine the active box design handles.................//
                  var adh = this.DesignGetActiveBoxHandles( nJ );

                  // fill corner arcs........................................//
                  for( var x = 0; x < 3; ++x )
                     for( var y = 0; y < 3; ++y )
                     {
                        // skip inactive handles.............................// 
                        if( x == 1 && y == 1 ) continue;
                        if( !adh[ y * 3 + x ] ) continue;

                        var ax = xy[0] + x * wh - (nsx - dx );
                        var ay = xy[1] + y * hh - (nsy);
                        if( ( ax * ax + ay * ay ) < r2 )
                        {
                           // 0 1 2          -->y * 3 + x
                           // 3 4 5
                           // 6 7 8
                           hi.m_Index = nJ;
                           hi.m_Handle = y * 3 + x;
                           hi.m_Design = true;           // flag indicating design handle hit
                           hi.m_Hit = VBI.HTBOXHANDLE;   // it is a box scaling handle
                           hi.m_NsX = nsx;               // store current non scaled x
                           hi.m_NsY = nsy;               // store current non scaled y
                           return true;
                        }
                     }

                  // check for content hit...................................//
                  if( PtInRect( [ nsx - dx, nsy ], xy ) )
                  {
                     VBI.m_bTrace && VBI.Trace( "BaseDesignHitTest Box Hit! Index:" + nJ );
                     hi.m_Index = nJ;
                     hi.m_Handle = -1;
                     hi.m_Design = true;    // flag indicating design handle hit
                     hi.m_Hit = VBI.HTBOX;  // it the box itself
                     hi.m_NsX = nsx;        // store current non scaled x
                     hi.m_NsY = nsy;        // store current non scaled y
                     return true;
                  }
               }
            }
         }
         return false;
      },

      // base implementation for all visual objects..........................//
      DesignHandleDrag : function( ocb, event )
      {
         var scene = this.m_Scene;

         VBI.m_bTrace && VBI.Trace( "DesignHandleDrag" );

         // trace invalid input mode state...................................//
         VBI.m_bTrace && ( scene.m_nInputMode != VBI.InputModeTrackObject) && VBI.Trace("Error: DesignHandleDrag wrong input mode: " + scene.m_nInputMode );

         // select the right datasource element and set the data.............//
         this.m_DataSource.Select( ocb.m_Index  );

         // determine the new point information..............................//
         var pos = scene.GetPosFromPoint( [ ocb.m_ClientX, ocb.m_ClientY, 0 ] );
         var posold = scene.GetPosFromPoint( [ ocb.m_ClientStartX, ocb.m_ClientStartY, 0 ] );

         if( this.IsPosChangeable( scene.m_Ctx ) )
         {
            // modify the position or the position array.....................//
            // get the complete data from the context........................//

            // do a clone before modification to get the modified flag in....//
            // data provider set correctly...................................//
            
            var apos = this.m_Pos.GetValueVector( scene.m_Ctx ).slice(0);
            var aposold = ocb.m_PosOrig;

            if( ocb.hasOwnProperty( 'm_Handle' ) )
            {
               VBI.m_bTrace && VBI.Trace( "DesignHandleDrag Handle");

               // scene.SetToolTip( pos[0] + ";" + pos[1] );
               if( ocb.m_Hit == VBI.HTHANDLE )
               {
                  var idx = ocb.m_Handle * 3;
                  // only one handle is moved................................//
                  apos[ idx ] = pos[0];        // modify x
                  apos[ idx + 1 ] = pos[1];    // modify y
                  this.m_Pos.SetValueVector( scene.m_Ctx, apos );
               } else
               if( ocb.m_Hit == VBI.HTBOXHANDLE )
               {
                  // we are tracking the box handle..........................//
                  // 0 1 2
                  // 3 4 5
                  // 6 7 8

                  // do box sizing on the object.............................//
                  if( this.DesignBoxSize )
                     this.DesignBoxSize( ocb ); 

                  // scaling is required.....................................//
               } else
               if( ocb.m_Hit == VBI.HTBOX )
               {
                  VBI.m_bTrace && VBI.Trace( "DesignHandleDrag Box" );

                  // calculate the modification in position space............//
                  var dposx = ( pos[0] - posold[0] );
                  var dposy = ( pos[1] - posold[1] );

                  // all handles should be moved.............................//
                  for( var nJ = 0, len = apos.length / 3; nJ < len; ++nJ )
                  {
                     // scene.SetToolTip( pos[0] + ";" + pos[1] );

                     var idx = nJ * 3;
                     apos[ idx ] = aposold[ idx ] + dposx;            // modify x
                     apos[ idx + 1 ] = aposold[ idx + 1 ] + dposy;    // modify y
                  }
                  this.m_Pos.SetValueVector( scene.m_Ctx, apos );
               }
            }
         }

         // render again.....................................................//
         scene.RenderAsync(true);
      },

      DesignHandleDrop : function( ocb, event )
      {
         var scene = this.m_Scene;

         // trace invalid input mode state...................................//
         VBI.m_bTrace && ( scene.m_nInputMode != VBI.InputModeTrackObject) && VBI.Trace("Error: DesignHandleDrop wrong input mode: " + scene.m_nInputMode );

         // check for design handle context menu subscription.............//
         var action, actions = scene.m_Ctx.m_Actions;
         if( actions && ocb.m_Design )
         {
            // the action is raised whenever a design action has stopped..//
            // for the instanced type.....................................//
            // check if action is subscribed..............................//
            if( action = actions.findAction( "HandleMoved", scene, this ) )
            {
               var ele;
               if( ele = this.m_DataSource.GetIndexedElement( scene.m_Ctx, ocb.m_Index ) )
               {
                  var params = scene.GetEventVPCoordsObj( event );
                  params.handle = ocb.m_Handle.toString();
                  params.mode = ocb.m_Hit.toString();
                  scene.m_Ctx.FireAction( action, scene, this, ele, params );
               }
            }
         }

         // set the input mode back to default mode..........................//
         scene.SetInputMode( VBI.InputModeDefault );
         scene.RenderAsync( true );

         return true;      // the base does just nothing yet, maybe fire event
      },

      DesignHandleEnd : function( ocb, event )
      {
         // tracking has ended...............................................//
         this.m_Track.UnHook();
         this.m_Track = null;
      },

      DesignGetActiveBoxHandles : function( idx )
      {
         // return the valid box handles in design mode......................//
         return [ 1, 1, 1, 1, 0, 1, 1, 1, 1 ];
      },

      //.....................................................................//
      // event handlers......................................................//

      onsapsecclick : function( event )
      {
         return this.BaseContextmenu( event );
      },

      onsapclick : function( event )
      {
         return this.BaseClick( event );
      },

      onsapmove : function( event )
      {
         return this.BaseMousemove( event );
      },

      onsapup : function( event )
      {
         if( !this.m_Track )
            return false;

         // stop tracking and reset tracking object..........................//
         this.m_Track.UnHook();
         this.m_Track = null;
      },

      onsapdrop : function( event )
      {
         VBI.m_bTrace && VBI.Trace( "onsapdrop in base " + event.type);
         var hit;
         if ( hit = this.IsDataAccepted( event ) )
         {
            var scene = this.m_Scene;
            var myIndex = this.GetDataIndex(hit.m_Index);
            var ele = this.m_DataSource.GetIndexedElement( scene.m_Ctx, myIndex );

            var action, actions = scene.m_Ctx.m_Actions;

            // check for subscribed action and raise it......................//
            if( actions )
            {
               // check if action is subscribed..............................//
               if( action = actions.findAction( "Drop", scene, this ) )
               {
                  this.m_Scene.m_Ctx.FireAction( action, scene, this, ele, scene.GetEventDropObjWithScene( event ) );
                  event.preventDefault();
                  return true;
               }
            }
            return false;
         }
         return false;
      },
      
      onsapdrag : function( event )
      {
         VBI.m_bTrace && VBI.Trace( "onsapdrag in base " + event.type);
         
         if ( this.IsDataAccepted( event ) ){
            return true;
         }
         return false;

      },
      
      onsapdown : function( event )
      {
         VBI.m_bTrace && VBI.Trace( "onsapdown in base " + event.type);

         var scene = this.m_Scene;

         // do nothing when tracking is active...............................//
         if( this.m_Track )
         {
            VBI.m_bTrace && VBI.Trace( "Error: Track object should be already gone");
            return true;
         }

         if( !this.GetHitArray )
            return false;

         // determine the instances that are hit.............................//
         var hit, hits = this.GetHitArray( event.offsetX, event.offsetY );

         if( hits.length && ( hit = hits[0] ).m_Design )
         {
            // and start tracking............................................//
            VBI.m_bTrace && VBI.Trace("Start Tracking on " + this.m_ID + " caused by " + event.type);

            this.m_DataSource.Select( hit.m_Index  );

            // a design handle is hit........................................//
            // apply additional callbacks and props to the hit object........//
            hit.m_CBDrag = this.DesignHandleDrag.bind( this );
            hit.m_CBDrop = this.DesignHandleDrop.bind( this );
            hit.m_CBEnd = this.DesignHandleEnd.bind( this );
            hit.m_ClientStartX = event.offsetX;
            hit.m_ClientStartY = event.offsetY;

            // store the original position and handles array due only deltas //
            // would cause numerical instabilities...........................//
            hit.m_PosOrig = this.m_Pos.GetValueVector( scene.m_Ctx ).slice(0);

            scene.SetInputMode( VBI.InputModeTrackObject );
            scene.SetCursor( this.DetailCursor( event, hit ) );

            // notify the control about start of tracking....................//
            // the application can append additional info....................//
            if( this.DesignBeginDrag )
               this.DesignBeginDrag( hit );

            this.m_Track = new scene.DesignTrack( hit );

            event.stopPropagation();
            event.preventDefault();
            return true;
         }
         
         if( hits.length )
         {
            this.m_DataSource.Select( hit.m_Index  );
            if ( this.m_DragSourceInfo )
            {
               var ctx = scene.m_Ctx;
               var aDragItems = this.m_DragSourceInfo.getItemArray(ctx);
               if ( aDragItems.length )
               {
                  scene.m_DragInfo = {};
                  scene.m_DragInfo.aItems = aDragItems;
                  scene.m_DragInfo.strInstance = this.m_DataSource.m_Path + "." + this.m_DataSource.m_nCurElement;
                  scene.m_DragInfo.strScene = this.m_Scene.m_ID;
                  scene.m_DragInfo.strID = this.m_ID;
                  scene.m_DragInfo.strExtData = this.m_DragData.GetValueString( scene.m_Ctx );
                  scene.m_DragInfo.bDragStart = false;
                  return true;
               }
            }
            
         }
         return false;
      },

      // overridable functions...............................................//
      // that can be overridden in specific situations.......................//

      DetailClick : function( event, ele, hit )
      { 
         return false;
      },

      DetailContextmenu : function( event, ele, hit )
      { 
         return false;
      },

      DetailCursor : function( event, hit )
      {
         if( hit.m_Design )
         {
            if( hit.m_Hit == VBI.HTBOXHANDLE )
            {
               var cursor = ['nw-resize', 'n-resize' , 'ne-resize', 
                             'w-resize', '' ,          'e-resize', 
                             'sw-resize', 's-resize' , 'se-resize' ];
               return cursor[hit.m_Handle];
            } else
            if( hit.m_Hit == VBI.HTBOX )
            {
               return 'move';
            }
         }
         // todo: other cursors..............................................//
         return 'pointer';
      },

      // base helper functions...............................................//
      GetSelectColor : function( ctx, orgColor )
      {
         var res, rhls;
         // determine the select color shift.................................//
         if( rhls = this.m_SelectColor.GetValueString( ctx ) )
         {
            // try to parse rhls.............................................//
            if( res = VBI.Types.string2rhls( rhls ) )
            {
               // we need to convert the original color to a number array....//
               var acol;
               if( acol = VBI.Types.color2array( orgColor ) )
               {
                  var hls = VBI.Utilities.RGB2HLS( acol[0], acol[1], acol[2] );
                  var rgb = VBI.Utilities.HLS2RGB( hls[0] + res[0] , hls[1] * res[1], hls[2] * res[2] );

                  // assemble the rgba string and cut range..................//
                  return 'rgba(' + Math.min( Math.round( rgb[0] ), 255 ) + "," + Math.min( Math.round( rgb[1] ), 255 ) + "," + Math.min( Math.round( rgb[2] ), 255 ) + "," + Math.min( (res[3] * acol[3]).toString(), 1.0 ) + ')';
               }
            } else
            // try to parse explicit color...................................//
            if( res = VBI.Types.string2color( rhls ) )
            {
               return res;
            }
         }

         return orgColor;  // return the original color......................//
      },
      
      GetHotColor : function( ctx, orgColor )
      {
         var res, rhls;
         // determine the delta color shift..................................//
         if( rhls = this.m_HotDeltaColor.GetValueString( ctx ) )
         {
            // try to parse rhls.............................................//
            if( res = VBI.Types.string2rhls( rhls ) )
            {
               // we need to convert the original color to a number array....//
               var acol;
               if( acol = VBI.Types.color2array( orgColor ) )
               {
                  var hls = VBI.Utilities.RGB2HLS( acol[0], acol[1], acol[2] );
                  var rgb = VBI.Utilities.HLS2RGB( hls[0] + res[0] , hls[1] * res[1], hls[2] * res[2] );

                  // assemble the rgba string and cut range..................//
                  return 'rgba(' + Math.min( Math.round( rgb[0] ), 255 ) + "," + Math.min( Math.round( rgb[1] ), 255 ) + "," + Math.min( Math.round( rgb[2] ), 255 ) + "," + Math.min( (res[3] * acol[3]).toString(), 1.0 ) + ')';
               }
            } else
            // try to parse explicit color...................................//
            if( res = VBI.Types.string2color( rhls ) )
            {
               return res;
            }
         }

         return this.m_colorHot; // return the default hot color.............//
      },

      GetHotScale : function( ctx )
      {
         var ret;
         // determine the hot scale multiplicator............................//
         if( ret = this.m_HotScale.GetValueVector( ctx ) )
            return ret;

         return [1.0,1.0,1.0];
      },
      
      RectSelect : function( selectionRect )
      {
         var tmp, offSelectionRect, hits = []; 
         
         for( var nJ = this.m_BB.length - 1; nJ >= 0; --nJ )            // loop for data bound instances
         {
            if( tmp = this.m_BB[ nJ ] )
            for( var nK = this.m_IO[ nJ ].length - 1; nK >= 0; --nK )   // loop for round world instances
            {
               var off = this.m_IO[ nJ ][ nK ];
               offSelectionRect = [ selectionRect[0] - off, selectionRect[1], selectionRect[2] - off, selectionRect[3]  ];
               if (tmp[0] >= offSelectionRect[0] && tmp[1] >= offSelectionRect[1] &&
                   tmp[2] <= offSelectionRect[2] && tmp[3] <= offSelectionRect[3] )
                  hits.push( nJ );
                  
            }
         }
         return hits;
      },
      
      

      GetLabel: function( ctx )
      {
         var label = {};
         var text = this.m_Labeltext.GetValueString(ctx);
         if ( text )
         {
            label.labeltext = text;
            label.bgColor = this.m_LabelBgCol.GetValueColor( ctx );
            label.Align = this.m_LabelPos.GetValueLong( ctx );
            return label;
         }
         else
            return null;
         
      },

};

   //........................................................................//
   // spot object............................................................//

   VBI.VisualObjects.Spot =  function()
   {
      // instance constants..................................................//
      this.m_fHotScale = 1.2;
      
      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx ); 

         // load bindable properties.........................................//
         this.m_Props.push( this.m_DataSource = new VBI.NodeProperty( dat, 'datasource', null, ctx ) );
         this.m_Props.push( this.m_Pos = new VBI.AttributeProperty( dat, 'pos', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_Image = new VBI.AttributeProperty( dat, 'image', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_ImageSelected = new VBI.AttributeProperty( dat, 'imageSelected', this.m_DataSource, ctx, null ) );
         this.m_Props.push( this.m_Icon = new VBI.AttributeProperty( dat, 'icon', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_Text = new VBI.AttributeProperty( dat, 'text', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_Tooltip = new VBI.AttributeProperty( dat, 'tooltip', this.m_DataSource, ctx, this.m_defaultTooltip ) );
         this.m_Props.push( this.m_Scale = new VBI.AttributeProperty( dat, 'scale', this.m_DataSource, ctx, [ 1.0, 1.0, 1.0 ] ) );
         this.m_Props.push( this.m_Alignment = new VBI.AttributeProperty( dat, 'alignment', this.m_DataSource, ctx, "5" ) );

         // load shared properties...........................................//
         this.BaseLoad( dat, ctx, this );
      };

      this.DetailHitTest = function( ocb, nIndex, nsx, nsy )
      {
         var iname, bHot, bSelected;
         var ctx = ocb.m_Ctx ;
         
         var myIndex = nIndex;
         var hotColor = null;
         var selectColor = null;
         bHot = this.IsHot( myIndex, ctx );
         
         if (this.bUsePreData) 
    	 {
        	 myIndex = this.m_BBRefs[nIndex];
    		 var InstancesOfVO = this.m_Scene.m_PreassembledData[this.m_nPreDataIndex];
    		 var myInst = InstancesOfVO[myIndex];
    		 iname = myInst.im;
    		 if (bHot) hotColor = myInst.hcol;
    		 bSelected = myInst.s;
    	 } else
   		 {
             this.m_DataSource.Select( myIndex );
             iname = this.m_Image.GetValueString( ctx );
             if (bHot) hotColor = this.m_HotDeltaColor.GetValueString( ctx );
             bSelected = this.IsSelected( ctx );
             if (bSelected) selectColor = this.m_HotDeltaColor.GetValueString( ctx );
   		 }

         var image, alpha = 0;
         if( image = ctx.GetResources().GetImageBits( iname, hotColor, selectColor ) )
         {
            var imageData = image[0];
            var rc = this.m_BB[ nIndex ]; // get bounds rect
            
            var width = rc[2] - rc[0]; 
            var height = rc[3] - rc[1];
            var ix = Math.floor( ( nsx - rc[0] ) / width * image[1] );
            var iy = Math.floor( ( nsy - rc[1] ) / height * image[2] );

            alpha = imageData[ ( iy * image[1] + ix ) * 4 + 3 ];
         }
         return ( alpha > 0 ) ?  { m_hit : ( alpha == 255 ? 1 : 2 ) } : null;
      };

      this.GetHitArray = function( x, y )
      {
         // determine the array of instances that are hit....................//
         // x and y are the canvas relative coordinates......................//
         var zf = this.m_Scene.GetCurrentZoomFactors();

         // bounding boxes are defined always in non stretched canvas........//
         // coordinates, therefore transform them............................//
         var nsx = x / zf[0];
         var nsy = y / zf[1];

         var ocb = { m_cb: this.DetailHitTest.bind( this ), m_Ctx: this.m_Scene.m_Ctx  }; 

         // call base function for bounds check..............................//
         return this.BaseHitTest( nsx, nsy, ocb );
      };

      this.ShowGrid = function( canvas, dc, preAssembledData )
      {
    	  // shows the clustering grid if applicable
          if (preAssembledData != undefined)
    	  {
              var scene = this.m_Scene;
              var ctx = scene.m_Ctx;
              var cntInstances = 0;
              var nElements = preAssembledData.length;
              for ( var nJ = 0; nJ < nElements; ++ nJ )
           	  {
              	var elem = preAssembledData[nJ];
                  if ( elem.cellColor != undefined )
                  	this.ShowGridCell( canvas, scene, dc, elem);            	
          	}
    	  }
      };
      
      // render the single instance..........................................//
      this.RenderThisInstance = function( elem, nIndex, nOrgIndex, dc )
      // , pos, image, text, scale, hot )
      {
         VBI.m_bTrace && VBI.Trace( "Spot: RenderInstance" );
         var scene = this.m_Scene;
         var image = scene.m_Ctx .GetResources().GetImage( ( elem.s && elem.simag) ? elem.simag : elem.im, elem.s ? elem.scol : null, elem.h ? elem.hcol : null, scene.RenderAsync.bind( scene ) );
         var scale = elem.sc;
         var text = elem.tx;
         var clustertext = elem.ct;
         if( !image ) return false; // when image is not available do nothing......//

         // determine the location where to render the main instance.........//
         var xy = [ elem[0], elem[1] ];
         var zf = scene.GetCurrentZoomFactors();

         // determine the master box.........................................//
         var width = image.naturalWidth / zf[0] * scale[0];
         var height = image.naturalHeight / zf[1] * scale[1], originalHeight = height;
         if( elem.h )
         {
            // determine the hot scale.......................................//
        	if (elem.hscale != undefined){
                width = width * elem.hscale[0] ;
                height = height * elem.hscale[1] ;
        	}
         }
        	 
         var left = xy[0] - width / 2;
         var top = xy[1] - height;

         // store the bounding box as a rectangle as array...................//
         // with [left, top, right, bottom]..................................//
         // calc and store the instance offsets..............................//
         var aIO = this.m_IO[ nIndex ] = scene.GetInstanceOffsets( this.m_BB[ nIndex ] = [ left, top, left + width, top + height ] );
         this.m_BBRefs.push(nOrgIndex);
         
         this.m_BB[ nIndex ].nI = nOrgIndex;
         // collect design handles...........................................//
         if( this.IsPosChangeable( scene.m_Ctx ) )
         {
            var aDH = this.m_DH[ nIndex ] = [];
            if( this.IsHandleMode() )
            {
               aDH.m_EditMode = VBI.EMHandle;
               aDH.push( xy );
            } else
            if( this.IsBoxMode() )
            {
               // just push the box points to the design handle array........//
               aDH.m_EditMode = VBI.EMBox;
               aDH.push( this.m_BB[ nIndex ] );
            }
         }

         // render the images................................................//
         if( text )
        	 VBI.Utilities.SetTextAttributes( dc, ( Math.floor( height / 2.8 ) ).toString() +  "px Arial", "rgba( 0, 0, 0, 1.0 )", "rgba( 0, 0, 0, 1.0 )", "center");

         for( var nJ = 0; nJ < aIO.length; ++nJ )
         {
            var offset = aIO[ nJ ];
            dc.drawImage( image, left + offset, top, width, height );

            if( text )
               dc.fillText( text, left + offset + width/2, top + height / 2.2 );
         }

         if( clustertext )
         {
        	 var fontSize = Math.floor( originalHeight / elem.fs );
        	 VBI.Utilities.SetTextAttributes(dc, ( fontSize ).toString() +  "px " + elem.f, elem.fc, elem.fc, "left" );       	 

	         for( var nJ = 0; nJ < aIO.length; ++nJ )
	         {
	            var offset = aIO[ nJ ];
                dc.fillText( clustertext, width + left + offset + elem.fo, top + ( height + fontSize / 1.5 ) / 2.0 );	         
             }
         }

         return true;
      };      
      
      // render the single instance..........................................//
      this.RenderInstance = function( nIndex, dc, pos, image, text, scale, hot, label )
      {
         VBI.m_bTrace && VBI.Trace( "Spot: RenderInstance" );
         if( !image ) return; // when image is not available do nothing......//


         var scene = this.m_Scene;

         // determine the location where to render the main instance.........//
         var xy = scene.GetPointFromPos( pos, true );
         var zf = scene.GetCurrentZoomFactors();

         // determine the master box.........................................//
         var width = image.naturalWidth / zf[0] * scale[0];
         var height = image.naturalHeight / zf[1] * scale[1];
         if( hot )
         {
            // determine the hot scale.......................................//
            var hs = this.GetHotScale( scene.m_Ctx );
            width = Math.round( width * hs[0] );
            height = Math.round( height * hs[1] );
         }
         
         var left;
         var top;
         
         // adjust left and top according to alignment specified
         var al = parseInt( this.m_Alignment.GetValueString(scene.m_Ctx) );
         switch( al )
         {
         case 0:
            left = xy[0] - width / 2;
            top  = xy[1] - height / 2;
            break;
         case 8:
            left = xy[0];
            top  = xy[1];
            break;
         case 1:
            left = xy[0] - width / 2;
            top  = xy[1];
            break;
         case 2:
            left = xy[0] - width;
            top  = xy[1];
            break;
         case 3:
            left = xy[0] - width;
            top  = xy[1] - height / 2;
            break;
         case 4:
            left = xy[0] - width;
            top  = xy[1] - height;
            break;
         case 6:
            left = xy[0];
            top  = xy[1] - height;
            break;
         case 7:
            left = xy[0];
            top  = xy[1] - height / 2;
            break;
         case 5:            
         default:
            left = xy[0] - width / 2;
            top  = xy[1] - height;
            break;
         }         
         
         // simple cluster testing
         /*
         var a = this.m_BB;
         for( var nT = 0, lT = a.length; nT < lT ; ++nT ) 
         {
            var rc2 = a[ nT ];
            if( !rc2 ) continue; 

            // determine whether the two provided rectangles intersect each other.....//
            if( !(   rc2[0] >  (left + width) || rc2[2] < left || 
                     rc2[3] < top || rc2[1] > ( top + height)    ) )
              {
                  this.m_BB[ nIndex ] = null;
                  this.m_IO[ nIndex ] = [0];
                  
                  
                  if( rc2.c ) return;
                  // fill arc......................................................// 
                  var nW;
                  dc.beginPath();
                  dc.arc( rc2[0] + ( rc2[2] - rc2[0] ) / 2, rc2[1] + (nW = ( rc2[3] - rc2[1] ) / 2), nW * 1.4, 0 , 2 * Math.PI );
                  dc.closePath();
                  
                  // draw border line..............................................//
                  dc.stroke();
                  rc2.c = 1;
                  return;
              }
         }
         */                 
         // end testing
         
         // store the bounding box as a rectangle as array...................//
         // with [left, top, right, bottom]..................................//
         // calc and store the instance offsets..............................//
         var aIO = this.m_IO[ nIndex ] = scene.GetInstanceOffsets( this.m_BB[ nIndex ] = [ left, top, left + width, top + height ] );

         // collect design handles...........................................//
         if( this.IsPosChangeable( scene.m_Ctx ) )
         {
            var aDH = this.m_DH[ nIndex ] = [];
            if( this.IsHandleMode() )
            {
               aDH.m_EditMode = VBI.EMHandle;
               aDH.push( xy );
            } else
            if( this.IsBoxMode() )
            {
               // just push the box points to the design handle array........//
               aDH.m_EditMode = VBI.EMBox;
               aDH.push( this.m_BB[ nIndex ] );
            }
         }

         // render the images................................................//
         if( text )
        	 VBI.Utilities.SetTextAttributes( dc, ( Math.floor( height / 2.8 ) ).toString() +  "px Arial","rgba( 0, 0, 0, 1.0 )","rgba( 0, 0, 0, 1.0 )","center" );

         for( var nJ = 0; nJ < aIO.length; ++nJ )
         {
            var offset = aIO[ nJ ];
            dc.drawImage( image, left + offset, top, width, height );

            if( text )
               dc.fillText( text, left + offset + width/2, top + height / 2.2 );
         }
         if( label && aIO.length )
         {
            var aLabelPos = {pa:[xy[0], xy[1], xy[2]], bb: null};
            this.m_Label.push( new VBI.Label( label, null, aLabelPos, this.m_BB[ nIndex ], aIO ) );
         }
         
      };

      // render with respect to data binding.................................//
      this.Render = function( canvas, dc, preAssembledData )
      {
         // clear bounding boxes and instacane offsets.......................//
         this.m_BB = [];
         this.m_BBRefs=[];
         this.m_IO = [];
         this.m_DH = [];
         if( this.m_Label )
         {
            for ( var nJ = 0; nJ < this.m_Label.length; ++nJ )
               this.m_Label[nJ].clear();
            this.m_Label = [];
         }

         // get scene .......................................................//
         var scene = this.m_Scene;
         var ctx = scene.m_Ctx;
         var cntInstances = 0;
         
         this.SwitchPreDataRendering (preAssembledData != undefined);
         
         if (this.bUsePreData)
    	 {
            var nElements = preAssembledData.length;
            for ( var nJ = 0; nJ < nElements; ++ nJ )
        	{
            	var elem = preAssembledData[nJ];
            	if (!elem.b2Ignore){
                    if (this.RenderThisInstance( elem, cntInstances, nJ, dc ))
                    	cntInstances++;
            	}
        	}
    	 }
         else
    	 {
             // determine the binding information................................//
             var node, tmp;
             if( node = this.m_DataSource.GetCurrentNode( ctx ) )
             {
            	cntInstances = node.m_dataelements.length;
                // the element count determines the number of rendered instances.//
                for( var nJ = 0; nJ < cntInstances; ++nJ )
                {
                   this.m_DataSource.Select( nJ );
                   var bHot = this.IsHot( nJ );
                   var bSelected = this.IsSelected( ctx );

                   // render the instance........................................//
                   var ilonlat = this.m_Pos.GetValueVector( ctx );
                   var iname = this.m_Image.GetValueString( ctx );

                   // when selected we replace the image with the selected image.//
                   if( bSelected && ( tmp = this.m_ImageSelected.GetValueString( ctx ) ) )
                      iname = tmp;

                   var itext = this.m_Text.GetValueString( ctx );
                   var iscale = this.m_Scale.GetValueVector( ctx );

                   // it is possible that the image is not loaded, therefore we..//
                   // bind the on load function to the renderascyn function of...//
                   // the current scene..........................................//
                   var image = ctx.GetResources().GetImage( iname, bSelected ? this.m_SelectColor.GetValueString( ctx ) : null, 
                                                                   bHot ? this.m_HotDeltaColor.GetValueString( ctx ) : null,
                                                                   scene.RenderAsync.bind( scene ) );
                   this.RenderInstance( nJ, dc, ilonlat, image, itext, iscale, bHot, this.GetLabel( ctx ) );
                }
             } else
             {
                // this is a single instance rendering...........................//
                // todo: do single instance rendering............................//
             }
    	 }

         // call base rendering method.......................................//
         this.BaseRender( canvas, dc );
         
         return cntInstances; // to increase count of Scaling instances
      };
      
      this.SwitchPreDataRendering = function ( bSetSwitch )
      {
    	  if ( this.bUsePreData != bSetSwitch )
		  {
    		  this.bUsePreData = bSetSwitch;
    		  if ( bSetSwitch )
			  {
    			  this.IsHot = this.PreDataIsHot;
    			  this.GetEntity = this.PreDataGetEntity;
			  }
    		  else
			  {
    			  this.IsHot = this.BaseIsHot;
    			  this.GetEntity = this.BaseGetEntity;
			  }
		  }
      }
      
//  	  this.ShowGridCell = function( canvas, scene, dc, elem )
//  	  {
//  		  var worldwidth = ( 1 << scene.m_Canvas[0].m_nCurrentLOD ) * scene.m_MapManager.m_tileWidth; 
//  		  
//  	      dc.strokeStyle = "rgba( 0, 0, 0, 0.0 )";
//  	      dc.fillStyle = elem.cellColor;
//  	      dc.lineWidth = 2;
//  	      dc.lineCap = 'round';
//  	    
//  	      var x1= elem.centX - 0.97 * elem.halfxSize;
//  	      var y1= elem.centY - 0.97 * elem.halfySize;
//  	      var xs = 1.94 * elem.halfxSize;
//  	      var ys = 1.94 * elem.halfxSize;
//  	      var cSize = canvas.m_pixelWidth;
//  	      
//  	      while ( x1 > worldwidth - xs )
//  	    	  x1 -= wordwith;
//  	      
//  	      while ( x1 < cSize ){
//  	  	      dc.beginPath();
//  	  	      dc.rect(x1,y1,xs,ys);
//  	  	      dc.closePath();
//  	  	      dc.fill();
//  	  	      x1 += worldwidth;
//  	      }
//  	  };
	

      this.DesignBeginDrag = function( ocb )
      {
         // append the original scale to the context.........................//
         ocb.m_ScaleOrig = this.m_Scale.GetValueVector( this.m_Scene.m_Ctx ).slice( 0 );
         ocb.m_DhOrig = this.m_DH[ ocb.m_Index ].slice( 0 );
      };

      // design overridden members...........................................//
      this.DesignGetActiveBoxHandles = function( idx )
      {
         // return the valid box handles in design mode......................//
         return [ 1, 1, 1, 1, 0, 1, 0, 0, 0 ];
      };
      
      this.InternalChangeHotItem = function(nIndex, value){
    	  if (this.bUsePreData){
    		  var nReferencedIndex = this.m_BBRefs[nIndex];
    		  if ( nReferencedIndex != undefined){
        		  var InstancesOfVO = this.m_Scene.m_PreassembledData[this.m_nPreDataIndex];
        		  if (InstancesOfVO[nReferencedIndex] != undefined){
            		  InstancesOfVO[nReferencedIndex].h = value;
            		  this.m_HotClusterVO = ((value && InstancesOfVO[nReferencedIndex].isCl) ? InstancesOfVO[nReferencedIndex] : undefined);
        		  }
    		  }
    	  }
      };

      this.BaseIsHot = this.IsHot;
      this.PreDataIsHot = function( nIndex, ctx )
      {
    	  var nReferencedIndex = this.m_BBRefs[nIndex];
    	  var InstancesOfVO = this.m_Scene.m_PreassembledData[this.m_nPreDataIndex];
    	  return InstancesOfVO[nReferencedIndex].h;
      };
      
      this.BaseGetEntity = this.GetEntity;
      this.PreDataGetEntity = function( nIndex, ctx)
      {
    	  this.m_DataSource.Select( nIndex );
    	  return this.m_Entity.GetValueString( ctx );
      };
      
      this.SwitchHotItemToStandard = function()
      {
    	  var scene = this.m_Scene;
    	  var nPreIndex = this.m_BBRefs[scene.m_HotItem.m_Index];
    	  var elte = (scene.m_PreassembledData[this.m_nPreDataIndex])[nPreIndex];
    	  if ( elte ) 
    		  if ( elte.isCl == true ){
    			  scene.InternalSetHotItem( null, null );
                 return elte;
			  } else {
	    		  scene.m_HotItem.m_Index = elte.nI;
	    		  if (scene.m_HotItem.m_HitObj)
	    		     scene.m_HotItem.m_HitObj.m_Index = elte.nI;
	    		  return undefined;
			  }
      };

      this.IsClusterable = function()
      { 
    	  return true;
      };
      
      this.GetDataIndex = function(BBIndex)
      {
    	  if ( this.bUsePreData )
		  {
             var preDataIndex = this.m_BBRefs[BBIndex];
             if (preDataIndex != undefined){
            	 var elte = (this.m_Scene.m_PreassembledData[this.m_nPreDataIndex])[preDataIndex];
            	 if ( elte != undefined )
            		 return elte.nI;
             }
		  }
    	  return BBIndex;
      };
      
      this.GetInternalIndex = function(BBIndex)
      {
    	  if ( this.bUsePreData )
             return this.m_BBRefs[BBIndex];
    	  return BBIndex;
      };
      
      this.getTooltip = function (ctx, hitObj )
      {
          this.m_DataSource.Select( this.GetDataIndex(hitObj.m_Index) );
          var test = this.m_DataSource.GetIndexedElement(ctx, this.GetDataIndex(hitObj.m_Index));
          return  this.m_Tooltip.GetValueString( ctx ) ;
      };            

      this.DesignBoxSize = VBI.Utilities.SceneBindDesignSpotBoxSize.bind( this );
   };
   VBI.VisualObjects.Spot.prototype =  VBI.VisualObjects.Base;

   //........................................................................//
   // route object...........................................................//

   VBI.VisualObjects.Route = function() 
   {
      this.m_LP = [];                // array of line point arrays...........//
   
      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx  );  

         // load bindable properties.........................................//
         this.m_Props.push( this.m_DataSource = new VBI.NodeProperty( dat, 'datasource', null, ctx ) );
         this.m_Props.push( this.m_Pos = new VBI.AttributeProperty( dat, 'posarray', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_Scale = new VBI.AttributeProperty( dat, 'scale', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_Color = new VBI.AttributeProperty( dat, 'color', this.m_DataSource, ctx, this.m_defaultColor ) );
         this.m_Props.push( this.m_Start = new VBI.AttributeProperty( dat, 'start', this.m_DataSource, ctx, 0 ) );
         this.m_Props.push( this.m_End = new VBI.AttributeProperty( dat, 'end', this.m_DataSource, ctx, 0 ) );
         this.m_Props.push( this.m_Tooltip = new VBI.AttributeProperty( dat, 'tooltip', this.m_DataSource, ctx, this.m_defaultTooltip ) );
         this.m_Props.push( this.m_LineWidth = new VBI.AttributeProperty( dat, 'linewidth', this.m_DataSource, ctx, 6.0 ) );
         this.m_Props.push( this.m_DotColor = new VBI.AttributeProperty( dat, 'dotcolor', this.m_DataSource, ctx, this.m_defaultColor ) );
         this.m_Props.push( this.m_DotBorderColor = new VBI.AttributeProperty( dat, 'dotbordercolor', this.m_DataSource, ctx, this.m_defaultColor ) );
         this.m_Props.push( this.m_DotWidth = new VBI.AttributeProperty( dat, 'dotwidth', this.m_DataSource, ctx, 0.0 ) );

         // load shared properties...........................................//
         this.BaseLoad( dat, ctx, this );
      };

      this.DrawArrow = function( ctx, a, color )
      {
         if( a.length < 3 ) return;
         ctx.beginPath();
         ctx.moveTo( a[0][0], a[0][1] );
         ctx.lineTo( a[1][0], a[1][1] );
         ctx.lineTo( a[2][0], a[2][1] );
         ctx.lineTo( a[0][0], a[0][1] );
         ctx.closePath();
         ctx.fillStyle = color;
         ctx.fill();
      };

      this.CalcArrow = function( scene, pointarray, arrowwidth, reverse, result )
      {
         var nItems = pointarray.length/3;

         var dist = 2 * arrowwidth * arrowwidth;      // quad distance
         var nJ, nOffset;                             // counters
         var tdx, tdy, start, tmp, xyz = [0,0,0];     // positions
         var bFound = false;

         // determine the start point........................................//
         nOffset = reverse ? nItems - 1 : 0;
         tmp = start = [ pointarray[ nOffset * 3 ], pointarray[ nOffset * 3 + 1 ], 0.0 ];

         // iterate dependent on reverse flag................................//
         for( nJ = 1; nJ < nItems; nJ++ )
         {
            nOffset = reverse ? nItems - 1 - nJ : nJ;
            xyz = [ pointarray[ nOffset * 3 ], pointarray[ nOffset * 3 + 1 ], 0.0 ];

            // when the distance is too small between projected points.......//
            // skip rendering................................................//
            if( ( (tdx = ( tmp[0] - xyz[0] )) * tdx + ( tdy = ( tmp[1] - xyz[1] ) ) * tdy ) > dist )
            {
               bFound = true; 
               break;
            }
         }

         if( !bFound ) return false;   // makes no sense to render an arrow..//

         // calc vector between first points.................................//

         var dx = xyz[0] - start[0];
         var dy = xyz[1] - start[1];

         while( ( Math.abs( dx ) > 1000.0 ) && ( Math.abs( dy ) > 1000.0 ) )
         {
            dx /= 1000.0;
            dy /= 1000.0;
         }

         var l = Math.sqrt( dx * dx + dy * dy );      // length
         
         dx = (dx * arrowwidth)/l;                      // normalize and scale
         dy = (dy * arrowwidth)/l;

         // calc first point for array rendering.............................//
         var ptx = start[0] + dx;
         var pty = start[1] + dy;

         // we return the first index to render in the line..................//
         result.idx = reverse ? nItems - nJ - 1 : nJ;
         result.ta =  [ [ start[0], start[1] ],             // first start pos
                        [ ptx + dy, pty - dx ],             // top arrow point
                        [ ptx - dy, pty + dx ] ];           // bottom arrow point

         result.pt = [ ptx, pty ];                          // base point

         return true;
      };

      this.CalculateLabelPos = function( scene, pointarray, offset )
      {
          var zf = scene.GetCurrentZoomFactors();
          var rctest = scene.m_Div.getBoundingClientRect();
          var rcWidth = rctest.width / zf[0];
          var rcHeight = rctest.height / zf[1];
          var PosXTest = scene.m_Canvas[0].getPixelLeft() / zf[0];
          var PosYTest = scene.m_Canvas[0].getPixelTop() / zf[1];
          
          var rcviewport = [-PosXTest, -PosYTest, -PosXTest + rcWidth, -PosYTest + rcHeight]; 

          
          var pts = VBI.Utilities.GetMidpointsForLine( pointarray.pa, offset, rcviewport );
          //console.log("CalculateLabelPos; pts.aPos= " + pts.aPos[0] );
          return pts.aPos;
      };
      
      this.RenderInstance = function( nIndex, dc, posarray, color, start, end, linewidth, dotcolor, dotbordercolor, dotwidth, label  )
      {
         var scene = this.m_Scene;

         // determine the nearest position array.............................//
         // and the instance ofsets..........................................//
         var apos = scene.GetNearestPosArray( posarray );
         
         // due y maps are positive in top direction there is a cross over of//
         // of min and max values............................................//
         var lt = scene.GetPointFromPos( [ apos.m_MinX, apos.m_MaxY, 0.0 ], false );
         var rb = scene.GetPointFromPos( [ apos.m_MaxX, apos.m_MinY, 0.0 ], false );

         // determine the instance offsets and store bounds..................//
         var border = Math.max( linewidth, dotwidth / 2 );
         var aIO = this.m_IO[ nIndex ] = scene.GetInstanceOffsets( this.m_BB[ nIndex ] = [ lt[0] - border, lt[1] - border, rb[0] + border, rb[1] + border] );

         var pointarray = aIO.length ? scene.GetPointArrayFromPosArray( apos, false ) : null;
         for( var nJ = 0, len = aIO.length; nJ < len; ++nJ )
         {  
            dc.setTransform( 1, 0, 0 , 1, aIO[nJ], 0 );
            this.RenderRoute( nIndex, dc, pointarray, color, start, end, linewidth, dotcolor, dotbordercolor, dotwidth );

            // draw the bounding box.........................................//
            VBI.m_bTrace && VBI.Utilities.DrawFrameRect( dc, "red", this.m_BB[ nIndex ] );
         }
         dc.setTransform( 1, 0, 0, 1, 0, 0 );
         if ( label && aIO.length )
         {
            var rcBox = [0,0,0,0];
            var positions = {pa:pointarray, bb:[lt,rb]};
            this.m_Label.push( new VBI.Label( label, this.CalculateLabelPos, positions, rcBox, aIO ) );
         }
      };

      this.RenderRoute = function( nIndex, dc, pointarray, color, start, end, linewidth, dotcolor, dotbordercolor, dotwidth )
      {
         var scene = this.m_Scene;
         var sqdistance = linewidth * linewidth / 2;

         // draw lines between the points....................................//
         var nItems = pointarray.length/3;
         if( nItems < 2 ) return;

         var tdx, tdy, nStart = 1;
         var nEnd = nItems - 1;
         var aLinePoints = this.m_LP[ nIndex ];      // linepoint array......//
         var aHandlePoints = this.m_DH[ nIndex ];    // designhandle array...//

         // create the dotarray only when dots have a width..................//
         // by default width is 0, therefore no dots are rendered............//
         var aDotPoints = dotwidth ? [] : null;

         // linepoints are only collected for the first world instance.......//
         if( aLinePoints.length )
            aLinePoints = null;
         if( aHandlePoints && aHandlePoints.length )
            aHandlePoints = null;
 
         // in design mode we push all points to the design handle array.....//
         // checking the array ensures that we do not add the handles twice..//
         // in round world situation.........................................//
         if( aHandlePoints )
         {
            if( aHandlePoints.m_EditMode == VBI.EMHandle )
            {
               for( var nJ = 0; nJ < nItems; ++nJ )
                  aHandlePoints.push( [ pointarray[ nJ * 3] , pointarray[ nJ * 3 + 1] ] );
            } else
            if( aHandlePoints.m_EditMode == VBI.EMBox )
            {
               aHandlePoints.push( this.m_BB[ nIndex ] );
            }
         }

         // calculate the triangles at the end...............................//
         var rs = {};
         var re = {};

         if( linewidth && start && this.CalcArrow( scene, pointarray, linewidth + 5, false, rs ) )
         {
            this.DrawArrow( dc, rs.ta, color );
            nStart = rs.idx;
            if( aLinePoints ) aLinePoints.m_RS = rs;  // append start arrow info to linepoints array
         }
         if( linewidth && end && this.CalcArrow( scene, pointarray, linewidth + 5, true, re ) )
         {
            this.DrawArrow( dc, re.ta, color );
            nEnd = re.idx;
            if( aLinePoints ) aLinePoints.m_RE = re;  // append end arrow info to linepoints array
         }

         dc.strokeStyle = color ;
         dc.lineWidth = linewidth;
         dc.lineCap = 'round';

         // set and store the start point....................................//
         var tmp = rs.pt ? [ rs.pt[ 0 ], rs.pt[ 1 ] ] : [ pointarray[ 0 ], pointarray[ 1 ], 0.0 ];
         if( aLinePoints ) aLinePoints.push( tmp );   

         // add waypoint at start only when no start style is set............//
         if( aDotPoints && !start ) aDotPoints.push( tmp );

         dc.beginPath();
         dc.moveTo( tmp[0], tmp[1] );                 // move to start.......//
         for( var nJ = nStart; nJ <= nEnd; ++nJ )
         {
            var xyz = [ pointarray[ nJ * 3 ], pointarray[ nJ * 3 + 1 ], 0.0 ];

            // when the distance is too small between projected points.......//
            // skip rendering................................................//
            if( ( ( tdx = ( tmp[0] - xyz[0] ) ) * tdx +
                  ( tdy = ( tmp[1] - xyz[1] ) ) * tdy ) < sqdistance )
               continue;
          
            if( linewidth ) dc.lineTo( xyz[0], xyz[1] );
            if( aLinePoints ) aLinePoints.push( xyz );
            if( aDotPoints ) aDotPoints.push( xyz ); 

            tmp = xyz;
         }

         // end point........................................................//
         if( re.pt ) 
         {
            if( linewidth ) dc.lineTo( re.pt[0], re.pt[1] );
            if( aLinePoints ) aLinePoints.push( re.pt );
         }
         dc.stroke();

         // render the dotpoints when required...............................//
         if( aDotPoints )
         {
            dc.fillStyle = dotcolor;
            dc.strokeStyle = dotbordercolor;
            dc.lineWidth = 1;
            for( var nJ = 0, len = aDotPoints.length; nJ < len; ++nJ ) 
            {
               var xyz = aDotPoints[nJ];
               // fill arc...................................................//
               dc.beginPath();
               dc.arc( xyz[0], xyz[1], dotwidth/2.0, 0, 2.0 * Math.PI );
               dc.closePath();
               dc.fill();
               dc.stroke();
            }
         }
      };

      // render with respect to data binding.................................//
      this.Render = function( canvas, dc, clusterData )
      {
         // clear bounding boxes and index offsets and linepoints and design.//
         // handles and labels for all instances ............................//
         this.m_BB = [];
         this.m_IO = [];
         this.m_LP = [];
         this.m_DH = [];
         if( this.m_Label )
         {
            for ( var nJ = 0; nJ < this.m_Label.length; ++nJ )
               this.m_Label[nJ].clear();
            this.m_Label = [];
         }

         // get scene and design mode........................................//
         var ctx = this.m_Scene.m_Ctx;

         // determine the binding information................................//
         var node;
         if( node = this.m_DataSource.GetCurrentNode( ctx ) )
         {
            // the element count determines the number of rendered instances.// 
            for( var nJ = 0, len = node.m_dataelements.length; nJ < len; ++nJ )
            {
               this.m_DataSource.Select( nJ );
               
               // create a subarray linepoints...............................//
               this.m_LP[ nJ ] = [];

               // create design handlearrays.................................//
               // they are filled in the render step.........................//
               if( this.IsPosChangeable( ctx ) )
               {
                  // tag the array with the current mode.....................//
                  var aDH = ( this.m_DH[ nJ ] = [] );
                  if( this.IsHandleMode() )
                     aDH.m_EditMode = VBI.EMHandle;
                  else
                  if( this.IsBoxMode() )
                     aDH.m_EditMode = VBI.EMBox;
               }
               var bHot = this.IsHot( nJ );
               var bSelected = this.IsSelected( ctx );

               // render the instance........................................//
               var pa = this.m_Pos.GetValueVector( ctx );
               var col = this.m_Color.GetValueColor( ctx );
               if( bSelected ) col = this.GetSelectColor( ctx, col );
               if( bHot ) col = this.GetHotColor( ctx, col );

               var start = this.m_Start.GetValueLong( ctx ); 
               var end = this.m_End.GetValueLong( ctx ); 

               var linewidth = this.m_LineWidth.GetValueFloat(  ctx );
               if( bHot ) linewidth*= (this.GetHotScale( ctx ))[0];

               var dotcolor = this.m_DotColor.GetValueColor(  ctx ); 
               if( bSelected ) dotcolor = this.GetSelectColor( ctx, dotcolor );
               if( bHot ) dotcolor = this.GetHotColor( ctx, dotcolor );
                  
               var dotbordercolor = this.m_DotBorderColor.GetValueColor( ctx ); 
               if( bSelected ) dotbordercolor = this.GetSelectColor( ctx, dotbordercolor );
               if( bHot ) dotbordercolor = this.GetHotColor( ctx, dotbordercolor );

               var dotwidth = this.m_DotWidth.GetValueFloat(  ctx ); 

               this.RenderInstance( nJ, dc, pa, col, start, end, linewidth, dotcolor, dotbordercolor, dotwidth, this.GetLabel( ctx )  ); 
            }
         } else
         {
            // this is a single instance rendering...........................//
            // todo: do single instance rendering............................//
         }

         // call base rendering method.......................................//
         this.BaseRender( canvas, dc );
      };

      this.DetailHitDot = function( nsx, nsy, x0, y0, sqrad )
      {
            // check if distance is fitting..................................//
            var tdx, tdy;
            return ( ( ( tdx = ( x0 - nsx ) ) * tdx + ( tdy = ( y0 - nsy ) ) * tdy ) < sqrad ) ? true : false;
      };

      this.DetailHitTest = function( ocb, nIndex, nsx, nsy )
      {
         var x0, y0, x1, y1;
         
         this.m_DataSource.Select( nIndex );
         var linerad = this.m_LineWidth.GetValueLong( this.m_Scene.m_Ctx ) / 2;   // half of the thickness of the line
         var dotrad = this.m_DotWidth.GetValueLong( this.m_Scene.m_Ctx ) / 2;     // half of the thickness of the line
         var sqlinerad = linerad * linerad;                                       // square of half of the thickness of the line
         var sqdotrad = dotrad * dotrad;                                          // square of dot radius

         var aLP = this.m_LP[ nIndex ];

         // get first linepoint..............................................//
         x0 = aLP[0][0];      
         y0 = aLP[0][1];

         // check first dot..................................................//
         if( sqdotrad && this.DetailHitDot( nsx, nsy, x0, y0, sqdotrad ) )
            return { m_hit: 1, m_dot: 0 };

         var nCount = aLP.length;
         for( var nK = 1; nK < nCount; ++nK )
         {
            x1 = aLP[nK][0];
            y1 = aLP[nK][1];

            // check wether a waypoint is hit................................//
            // todo:

            // check if not outside segment box and continue.................//
            if(   linerad &&
                  !( ( nsx < ( Math.min( x0, x1 ) - linerad ) ) || // outside left
                    ( nsx > ( Math.max( x0, x1 ) + linerad ) ) ||  // outside right
                    ( nsy < ( Math.min( y0, y1 ) - linerad ) ) ||  // outside top
                    ( nsy > ( Math.max( y0, y1 ) + linerad ) )     // outside bottom
                  ) && 
                  ( sqlinerad > VBI.Utilities.sqDistance( x0, y0, x1, y1, nsx, nsy ) )
            )
            {
               VBI.m_bTrace && VBI.Trace( "VBI.VisualObjects.Route hit line " + nIndex );
               return { m_hit: 1 };   // true hit, todo: diffuse hits
            }

            // check first dot...............................................//
            if( sqdotrad && this.DetailHitDot( nsx, nsy, x1, y1, sqdotrad ) )
            {
               VBI.m_bTrace && VBI.Trace( "VBI.VisualObjects.Route hit dot " + nIndex );
               return { m_hit: 1, m_dot: nK };   // true hit, todo: diffuse hits
            }

            // set positions for the next iteration..........................//
            x0 = x1; 
            y0 = y1;
         }

         // check the arrows.................................................//
         if( aLP.m_RS && VBI.Utilities.pointInTriangle( aLP.m_RS.ta, [nsx, nsy] ) ) 
            return { m_hit: 1, m_arrow: 0 };    // true start arrow hit, todo: diffuse hits
         if( aLP.m_RE && VBI.Utilities.pointInTriangle( aLP.m_RE.ta, [nsx, nsy] ) )
            return { m_hit: 1, m_arrow: 1 };    // true end arrow is hit, todo: diffuse hits
         
         return null;   // no hit 
      };

      this.GetHitArray = function( x, y )
      {
         // determine the array of instances that are hit....................//
         // x and y are the canvas relative coordinates......................//
         var zf = this.m_Scene.GetCurrentZoomFactors();

         // bounding boxes are defined always in non stretched canvas........//
         // coordinates, therefore transform them............................//
         var nsx = x / zf[0];
         var nsy = y / zf[1];

         var ocb = { m_cb: this.DetailHitTest.bind( this ) }; 

         // call base function for bounds check..............................//
         return this.BaseHitTest( nsx, nsy, ocb );
      };

      // design overridden members...........................................//
      this.DesignBoxSize = VBI.Utilities.SceneBindPosArrayDesignBoxSize.bind( this );
   };
   VBI.VisualObjects.Route.prototype =  VBI.VisualObjects.Base;


   //........................................................................//
   // circle object..........................................................//

   VBI.VisualObjects.Circle = function()
   {
      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );  

         // load circle data.................................................//
         this.m_Props.push( this.m_DataSource = new VBI.NodeProperty( dat, 'datasource', null, ctx ) );
         this.m_Props.push( this.m_Pos = new VBI.AttributeProperty( dat, 'pos', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_ColorBorder = new VBI.AttributeProperty( dat, 'colorBorder', this.m_DataSource, ctx, this.m_defaultColor ) );
         this.m_Props.push( this.m_Radius = new VBI.AttributeProperty( dat, 'radius', this.m_DataSource, ctx, 5 ) );
         this.m_Props.push( this.m_Tooltip = new VBI.AttributeProperty( dat, 'tooltip', this.m_DataSource, ctx, this.m_defaultTooltip ) );
         this.m_Props.push( this.m_Color = new VBI.AttributeProperty( dat, 'color', this.m_DataSource, ctx, this.m_defaultColor ) );
         this.m_Props.push( this.m_Slices = new VBI.AttributeProperty( dat, 'slices', this.m_DataSource, ctx, 10 ) );

         // load shared properties...........................................//
         this.BaseLoad( dat, ctx, this );
      };

      this.CalculateLabelPos = function( scene, pointarray, offset )
      {
          var zf = scene.GetCurrentZoomFactors();
          var rctest = scene.m_Div.getBoundingClientRect();
          var rcWidth = rctest.width / zf[0];
          var rcHeight = rctest.height / zf[1];
          var PosXTest = scene.m_Canvas[0].getPixelLeft() / zf[0];
          var PosYTest = scene.m_Canvas[0].getPixelTop() / zf[1];
          
          var rcviewport = [-PosXTest, -PosYTest, -PosXTest + rcWidth, -PosYTest + rcHeight]; 

          
          var pt = VBI.Utilities.GetMidpointForPolygon( pointarray.pa, pointarray.bb, offset, rcviewport );
          if ( pt && pt.aPos)
          {
             return pt.aPos;
          }
          return null;
      };

      
      
      // render the single instance..........................................//
      this.RenderInstance = function( nIndex, dc, pos, color, colorBorder, radius, slices, label )
      {
         var scene = this.m_Scene;
         
         // correct zoom factor..............................................//
         var zf = scene.GetCurrentZoomFactors();
         var r = radius / zf[0];

         // get the center point and calculate the bounds....................//
         var xy = scene.GetPointFromPos( pos, false );

         // determine the instance offsets...................................//
         var bb;
         var aIO = this.m_IO[ nIndex ] = scene.GetInstanceOffsets( bb = this.m_BB[ nIndex ] = [ xy[0] - r, xy[1] - r, xy[0] + r, xy[1] + r ] );
         bb.m_Radius = r;     // remember radius at the boundingbox
         bb.m_Pos = xy;       // remember position at the boundingbox

         // fill design handle information...................................//
         if( this.IsPosChangeable( scene.m_Ctx ) )
         {
            var aDH = ( this.m_DH[ nIndex ] = [] );
            if( this.IsHandleMode() )
            {
               aDH.m_EditMode = VBI.EMHandle;
               aDH.push( xy );
            } else
            if( this.IsBoxMode() )
            {
               aDH.m_EditMode = VBI.EMBox;
               aDH.push( bb );
            }
         }

         // pixel the instance...............................................//
         dc.lineWidth = 1;
         dc.fillStyle = color;

         for( var nJ = 0; nJ < aIO.length; ++nJ ) 
         {
            dc.setTransform( 1, 0, 0 , 1, aIO[nJ], 0 );
            
            // fill arc......................................................// 
            dc.beginPath();
            dc.arc( xy[0], xy[1], r, 0 , 2 * Math.PI );
            dc.closePath();
            dc.fill();
            
            // draw border line..............................................//
            dc.strokeStyle = colorBorder;
            dc.stroke();
            
            // draw the bounding box.........................................//
            VBI.m_bTrace && VBI.Utilities.DrawFrameRect( dc, "red", this.m_BB[ nIndex ] );
         }   
         dc.setTransform( 1, 0, 0 , 1, 0, 0 );
         // get the points for rendering the label
         // r for radius; xy  for vMiddle
//         D3DVECTOR4 vPos;
//         for( int nJ = 0; nJ < 20; nJ++ )
//         {
//            double theta = nJ * 2 * Math.PI / 20;
//            vPos.x = vMiddle.x + (float)(fRadius * sin( theta ));
//            vPos.y = vMiddle.y + (float)(fRadius * cos( theta ));
//            vPos.z = vMiddle.z + 0.0f;
//            vPos.w = 1.0f;
//            vCirclePosList->push_back( vPos );
//         }
         
         
         if ( label && aIO.length )
         {
            var rcBox = [0,0,0,0];
            
            var pta = [];
            var nSlices = 20;
            for( var nJ = 0; nJ < nSlices; ++nJ )
            {
               var theta = nJ * 2 * Math.PI / nSlices;
               var circleX = xy[0] + r * Math.sin( theta );
               var circleY = xy[1] + r * Math.cos( theta );  
               pta.push(circleX, circleY);
            }
//            var lt = [bb[0],bb[1]];
//            var rb = [bb[2],bb[3]];
            var positions = {pa:pta, bb:[[bb[0],bb[1]],[bb[2],bb[3]]]};
            this.m_Label.push( new VBI.Label( label, this.CalculateLabelPos, positions, rcBox, aIO ) );
         }
         
         
      };

      // render with respect to data binding.................................//
      this.Render = function( canvas, dc, clusterData )
      {
         // clear bounding boxes and index offsets and design handle array...//
         this.m_BB = [];
         this.m_IO = [];
         this.m_DH = [];
         
         if( this.m_Label )
         {
            for ( var nJ = 0; nJ < this.m_Label.length; ++nJ )
               this.m_Label[nJ].clear();
            this.m_Label = [];
         }

         // get scene .......................................................//
         var ctx = this.m_Scene.m_Ctx;
         var cntInstances = 0;

         // determine the binding information................................//
         var node;
         if( node = this.m_DataSource.GetCurrentNode( ctx ) )
         {
        	cntInstances = node.m_dataelements.length;
            // the element count determines the number of rendered instances.// 
            for( var nJ = 0; nJ < cntInstances; ++nJ )
            {
               this.m_DataSource.Select( nJ );

               var bHot = this.IsHot( nJ );
               var bSelected = this.IsSelected( ctx );
               
               var p = this.m_Pos.GetValueVector( ctx );
               var col = this.m_Color.GetValueColor( ctx );
               if( bSelected ) col = this.GetSelectColor( ctx, col );
               if( bHot ) col = this.GetHotColor( ctx, col );

               var cb = this.m_ColorBorder.GetValueColor( ctx );
               if( bSelected ) cb = this.GetSelectColor( ctx, cb );
               if( bHot ) cb = this.GetHotColor( ctx, cb );

               var r = this.m_Radius.GetValueFloat( ctx );
               if( bHot ) r = (this.GetHotScale( ctx ))[0] * r;

               var s = this.m_Slices.GetValueLong( ctx );

               this.RenderInstance( nJ, dc, p, col, cb, r, s, this.GetLabel( ctx ) ); 
            }
         } else
         {
            // this is a single instance rendering...........................//
            // todo: do single instance rendering............................//
         }

         // call base rendering method.......................................//
         this.BaseRender( canvas, dc );

         return cntInstances; // to increase count of Scaling instances         
      };

      this.DetailHitTest = function( ocb, nIndex, nsx, nsy  )
      {
         var bb = this.m_BB[ nIndex ];
         var r = bb.m_Radius;
         var xy = bb.m_Pos;
         var tdx, tdy;

         // when hit distance lies within the radius, this is a hit..........//
         if( ( ( tdx = ( xy[0] - nsx ) ) * tdx +
               ( tdy = ( xy[1] - nsy ) ) * tdy ) < r * r ) 
            return { m_hit: 1 };      // todo: do diffuse hits here as well
         
         return null; // no hit 
      };

      this.GetHitArray = function( x, y )
      {
         // determine the array of instances that are hit....................//
         // x and y are the canvas relative coordinates......................//
         var zf = this.m_Scene.GetCurrentZoomFactors();

         // bounding boxes are defined always in non stretched canvas........//
         // coordinates, therefore transform them............................//
         var nsx = x / zf[0];
         var nsy = y / zf[1];

         var ocb = { m_cb: this.DetailHitTest.bind( this ), m_zf : zf };

         // call base function for bounds check..............................//
         return this.BaseHitTest( nsx, nsy, ocb );
      };

      // design overridden members...........................................//
      this.DesignGetActiveBoxHandles = function( idx )
      {
         // only when the radius can be changed, handles are active..........//
         var scene = this.m_Scene;
         this.m_DataSource.Select( idx );
         return this.m_Radius.IsChangeable( scene.m_Ctx ) ? [ 0, 1, 0, 1, 0, 1, 0, 1, 0 ] : [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
      };

      this.DesignBoxSize = VBI.Utilities.SceneBindRadiusDesignBoxSize.bind( this );

      // event handlers......................................................// 
   };
   VBI.VisualObjects.Circle.prototype =  VBI.VisualObjects.Base;

   //........................................................................//
   // CircleDist object......................................................//

   VBI.VisualObjects.CircleDist = function() 
   {
      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );

         // load circle data.................................................//
         this.m_Props.push( this.m_DataSource = new VBI.NodeProperty( dat, 'datasource', null, ctx ) );
         this.m_Props.push( this.m_Pos = new VBI.AttributeProperty( dat, 'midpoint', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_ColBorder = new VBI.AttributeProperty( dat, 'colorBorder', this.m_DataSource, ctx, this.m_defaultColor ) );
         this.m_Props.push( this.m_Radius = new VBI.AttributeProperty( dat, 'radius', this.m_DataSource, ctx, 10 ) );
         this.m_Props.push( this.m_Tooltip = new VBI.AttributeProperty( dat, 'tooltip', this.m_DataSource, ctx, this.m_defaultTooltip ) );
         this.m_Props.push( this.m_ColFill = new VBI.AttributeProperty( dat, 'color', this.m_DataSource, ctx, this.m_defaultColor ) );
         this.m_Props.push( this.m_Slices = new VBI.AttributeProperty( dat, 'slices', this.m_DataSource, ctx, 10 ) );

         // load shared properties...........................................//
         this.BaseLoad( dat, ctx, this );
      };
      
      this.CalculateLabelPos = function( scene, pointarray, offset )
      {
          var zf = scene.GetCurrentZoomFactors();
          var rctest = scene.m_Div.getBoundingClientRect();
          var rcWidth = rctest.width / zf[0];
          var rcHeight = rctest.height / zf[1];
          var PosXTest = scene.m_Canvas[0].getPixelLeft() / zf[0];
          var PosYTest = scene.m_Canvas[0].getPixelTop() / zf[1];
          
          var rcviewport = [-PosXTest, -PosYTest, -PosXTest + rcWidth, -PosYTest + rcHeight]; 

          
          var pt = VBI.Utilities.GetMidpointForPolygon( pointarray.pa, pointarray.bb, offset, rcviewport );
          if ( pt && pt.aPos)
          {
             return pt.aPos;
          }
          return null;
      };


      this.RenderCircleDist = function( nIndex, dc, data, colFill, colBorder )
      {
         var scene = this.m_Scene;

         // get linepoints, when already collected set them to null..........//
         var aLinePoints = this.m_LP[ nIndex ];      // linepoint array......//
         if( aLinePoints.length )
            aLinePoints = null;
         
         // because radians are delivered, GetPointFromGeo must be used......//
         // this accepts radians only........................................//
         var tdx, tdy, xy, tmp = scene.GetPointFromGeo( data[0], false );

         // set the colors and styles........................................//
         dc.strokeStyle = colBorder; 
         dc.fillStyle = colFill;
         dc.lineWidth   = 1;

         // start rendering..................................................//
         dc.beginPath();
         dc.moveTo(tmp[0], tmp[1]);

         aLinePoints && aLinePoints.push( tmp );      // add first line point
         for( var nJ = 1; nJ < data.length; ++nJ )  
         {
            xy = scene.GetPointFromGeo( data[nJ], false );

            // when the distance is too small between projected points.......//
            // skip rendering................................................//
            if( ( ( tdx = ( tmp[0] - xy[0] ) ) * tdx +
                  ( tdy = ( tmp[1] - xy[1] ) ) * tdy ) < 5.0 )
               continue;

            aLinePoints && aLinePoints.push( xy );    // add other line points
            dc.lineTo( xy[0], xy[1] );
            tmp = xy;
         }

         dc.closePath();

         // stroke and fill..................................................//
         dc.stroke();
         dc.fill(); 
      };
      
      // render the single instance..........................................//
      this.RenderInstance = function( nIndex, dc, pos, colFill, colBorder, radius, slices, label )
      {
         var bb, scene = this.m_Scene;

         // determine the positions..........................................//
         // all the math functions deliver radians...........................//

         var data = VBI.MathLib.EquidistantLonLat( VBI.MathLib.DegToRad( pos ), radius, slices );

         // add the center as a design handle................................//
         this.m_Pos.IsChangeable( scene.m_Ctx ) && ( this.m_DH[ nIndex ] = [ scene.GetPointFromPos( pos , false  ) ] );

         // due y maps are positive in top direction there is a cross over of//
         // of min and max values............................................//
         var lt = scene.GetPointFromGeo( [ data.m_MinX, data.m_MaxY, 0.0 ], false  );         
         var rb = scene.GetPointFromGeo( [ data.m_MaxX, data.m_MinY, 0.0 ], false  );

         // determine the instance offsets...................................//
         var aIO = this.m_IO[ nIndex ] = scene.GetInstanceOffsets( bb = this.m_BB[ nIndex ] = [ lt[0], lt[1], rb[0], rb[1] ] );

         // add the center as a design handle................................//
         if( this.IsPosChangeable( scene.m_Ctx ) )
         {
            // tag the array with the current mode.....................//
            var aDH = ( this.m_DH[ nIndex ] = [] );
            if( this.IsHandleMode() )
            {
               aDH.m_EditMode = VBI.EMHandle;
               aDH.push( scene.GetPointFromPos( pos , false  ) );
            } else
            if( this.IsBoxMode() )
            {
               aDH.m_EditMode = VBI.EMBox;
               aDH.push( bb ); 
            }
         }

         for( var nK = 0; nK < aIO.length; ++nK )
         {   
            dc.setTransform( 1, 0, 0 , 1, aIO[nK], 0 );

            this.RenderCircleDist( nIndex, dc, data, colFill, colBorder );
      
            // draw the bounding box.........................................//
            VBI.m_bTrace && VBI.Utilities.DrawFrameRect( dc, "red", this.m_BB[ nIndex ] );
         }

         // reset any transforms.............................................//
         dc.setTransform( 1, 0, 0, 1, 0, 0 );
         if ( label && aIO.length )
         {
            var rcBox = [0,0,0,0];
            var pta = [];
            for ( var nJ = 0; nJ < this.m_LP[ nIndex ].length; ++nJ )
            {
               pta.push( this.m_LP[ nIndex ][nJ][0], this.m_LP[ nIndex ][nJ][1]);
            }
            var positions = {pa:pta, bb:[lt,rb]};
            this.m_Label.push( new VBI.Label( label, this.CalculateLabelPos, positions, rcBox, aIO ) );
         }
         
         
      };
         
      // render with respect to data binding.................................//
      this.Render = function( canvas, dc, clusterData )
      {
         // clear bounding boxes and index offsets and linepoints and design.//
         // handles..........................................................//
         this.m_BB = [];
         this.m_IO = [];
         this.m_LP = [];
         this.m_DH = [];
         
         if( this.m_Label )
         {
            for ( var nJ = 0; nJ < this.m_Label.length; ++nJ )
               this.m_Label[nJ].clear();
            this.m_Label = [];
         }
         
         // get scene........................................................//
         var ctx = this.m_Scene.m_Ctx;

         // determine the binding information................................//
         var node;
         if( node = this.m_DataSource.GetCurrentNode( ctx ) )
         {
            // the element count determines the number of rendered instances.// 
            for( var nJ = 0, len = node.m_dataelements.length; nJ < len; ++nJ )
            {
               this.m_DataSource.Select( nJ );
               
               var bHot = this.IsHot( nJ );
               var bSelected = this.IsSelected( ctx );
               
               var p = this.m_Pos.GetValueVector( ctx );
               var cb = this.m_ColBorder.GetValueColor( ctx );
               if( bSelected ) cb = this.GetSelectColor( ctx, cb );
               if( bHot ) cb = this.GetHotColor( ctx, cb );
               
               var r = this.m_Radius.GetValueFloat( ctx );
               if( bHot ) r =( this.GetHotScale( ctx ))[0] * r;
               var s = this.m_Slices.GetValueLong( ctx );
               var cf = this.m_ColFill.GetValueColor( ctx );
               
               if( bSelected ) cf = this.GetSelectColor( ctx, cf );
               if( bHot ) cf = this.GetHotColor( ctx, cf );

               // create a subarray on the index.............................//
               this.m_LP[ nJ ] = [];

               this.RenderInstance( nJ, dc, p, cf, cb, r, s, this.GetLabel( ctx ) ); 
            }
         } else
         {
            // this is a single instance rendering...........................//
            // todo: do single instance rendering............................//
         }

         // call base rendering method.......................................//
         this.BaseRender( canvas, dc );
      };

      this.DetailHitTest = function( ocb, nIndex, nsx, nsy  )
      {
         // todo: check for diffuse hits.....................................//
         return VBI.Utilities.pointInPolygon( this.m_LP[ nIndex ], nsx, nsy ) ? { m_hit: 1 } : null;
      };
      
      this.GetHitArray = function( x, y )
      {
         // determine the array of instances that are hit....................//
         // x and y are the canvas relative coordinates......................//
         var zf = this.m_Scene.GetCurrentZoomFactors();

         // bounding boxes are defined always in non stretched canvas........//
         // coordinates, therefore transform them............................//
         var nsx = x / zf[0];
         var nsy = y / zf[1];

         var ocb = { m_cb: this.DetailHitTest.bind( this ), m_zf : zf }; 

         // call base function for bounds check..............................//
         return this.BaseHitTest( nsx, nsy, ocb );
      }; 

      // design handlers.....................................................//
      this.DesignGetActiveBoxHandles = function( idx )
      {
         // only when the radius can be changed, handles are active..........//
         var scene = this.m_Scene;
         this.m_DataSource.Select( idx );
         return this.m_Radius.IsChangeable( scene.m_Ctx ) ? [ 0, 1, 0, 1, 0, 1, 0, 1, 0 ] : [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
      };

      this.DesignBoxSize = VBI.Utilities.SceneBindMeterRadiusDesignBoxSize.bind( this );

      // event handlers......................................................// 
   };
   VBI.VisualObjects.CircleDist.prototype =  VBI.VisualObjects.Base;

   //........................................................................//
   // pie object.............................................................//

   VBI.VisualObjects.m_AC =        // analytic colors........................//
   [
      "rgba(0,143,211,1.0)",
      "rgba(153,209,1,1.0)",
      "rgba(243,155,2,1.0)",
      "rgba(159,207,236,1.0)",
      "rgba(75,167,7,1.0)",
      "rgba(246,209,51,1.0)",
      "rgba(203,77,44,1.0)",
      "rgba(202,199,186,1.0)",
      "rgba(13,134,156,1.0)",
      "rgba(205,215,46,1.0)",
      "rgba(36,114,48,1.0)",
      "rgba(108,222,220,1.0)",
      "rgba(235,115,0,1.0)",
      "rgba(185,187,209,1.0)",
      "rgba(0,109,211,1.0)",
      "rgba(61,185,127,1.0)",
      "rgba(165,84,148,1.0)",
      "rgba(1,88,43,1.0)",
      "rgba(77,182,239,1.0)",
      "rgba(175,43,23,1.0)",
      "rgba(212,153,18,1.0)",
      "rgba(187,204,210,1.0)",
      "rgba(48,146,13,1.0)",
      "rgba(29,169,193,1.0)",
      "rgba(42,71,201,1.0)",
      "rgba(209,153,194,1.0)",
      "rgba(204,88,38,1.0)",
      "rgba(114,191,68,1.0)",
      "rgba(10,72,157,1.0)",
      "rgba(151,156,163,1.0)",
      "rgba(14,145,144,1.0)",
      "rgba(97,32,154,1.0)" ];

   VBI.VisualObjects.Pie = function() 
   {
      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );  

         // load bindable properties.........................................//
         this.m_Props.push( this.m_DataSource = new VBI.NodeProperty( dat, 'datasource', null, ctx ) );
         this.m_Props.push( this.m_Series = new VBI.NodeProperty( dat, 'series', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_Scale = new VBI.AttributeProperty( dat, 'scale', this.m_DataSource, ctx, [1.0,1.0,1.0] ) );
         this.m_Props.push( this.m_Pos = new VBI.AttributeProperty( dat, 'pos', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_Values = new VBI.AttributeProperty( dat, 'value', this.m_Series, ctx ) );
         this.m_Props.push( this.m_Texts = new VBI.AttributeProperty( dat, 'text', this.m_Series, ctx ) );
         this.m_Props.push( this.m_SliceColor = new VBI.AttributeProperty( dat, 'slicecolor', this.m_Series, ctx  ) );
         this.m_Props.push( this.m_Tooltips = new VBI.AttributeProperty( dat, 'extooltip', this.m_Series, ctx, this.m_defaultTooltip ) );
         this.m_Props.push( this.m_Tooltip = new VBI.AttributeProperty( dat, 'tooltip', this.m_DataSource, ctx, this.m_defaultTooltip ) );
         this.m_Props.push( this.m_StartColor = new VBI.AttributeProperty( dat, 'startcolor', this.m_DataSource, ctx, 0 ) );
         
         
         // load shared properties...........................................//
         this.BaseLoad( dat, ctx, this );
      };

      // render the single pie instance......................................//
      this.RenderInstance = function( nIndex, dc, pos, radius, values, texts, colors, nHotSlice, bSelected )
      {
         var scene = this.m_Scene;
         var ctx = scene.m_Ctx;

         // calc sum of values...............................................//
         var nSum = 0;
         for( var nJ = 0; nJ < values.length; ++nJ )
            nSum += values[nJ];
         this.m_SUM [nIndex ] = nSum;
         
         // determine the location where to render the main instance.........//
         // get the current zoom factors.....................................//
         var xy = scene.GetPointFromPos( pos, false );
         var zf = scene.GetCurrentZoomFactors();

         //  correct the radius with the current zoom factor.................//
         radius/=zf[0];

         // determine the box and the instance offsets.......................//
         var bb;
         var aIO = this.m_IO[ nIndex ] = scene.GetInstanceOffsets( bb = this.m_BB[ nIndex ] = [ xy[0] - radius, xy[1] - radius, xy[0] + radius, xy[1] + radius ] );
         bb.m_Radius = radius;   // remember used radius
         bb.m_Pos = xy;          // remember used position     

         // collect design handle information................................//
         if( this.IsPosChangeable( ctx ) )
         {
            // tag the array with the current mode...........................//
            var aDH = ( this.m_DH[ nIndex ] = [] );
            if( this.IsHandleMode() )
            {
               aDH.m_EditMode = VBI.EMHandle;
               aDH.push( xy );                  // center is the design handle
            } else
            if( this.IsBoxMode() )
            {
               aDH.m_EditMode = VBI.EMBox;
               aDH.push( bb );
            }
         }
         this.m_ARC[ nIndex ] = [ 3 * Math.PI / 2 ];

         // get the start color..............................................//
         var startcolor = this.m_StartColor.GetValueLong( ctx );
         var colarraylen = VBI.VisualObjects.m_AC.length;
         
         for( var nK = 0; nK < aIO.length; ++nK )
         {   
            dc.setTransform( 1, 0, 0 , 1, aIO[nK], 0 );
        
            var lastPosition = 3 * Math.PI / 2;
            for( var nJ = 0; nJ < values.length; ++nJ ) 
            {
               var gradient = dc.createRadialGradient( xy[0], xy[1], 0, xy[0], xy[1], radius );
               var col = colors[nJ];
               if( !col ) col = VBI.VisualObjects.m_AC[ ( nJ + startcolor ) % colarraylen ];
               
               // determine the hot color....................................//
               if( bSelected ) col = this.GetSelectColor( ctx, col );
               if( nJ == nHotSlice ) 
            	   col = this.GetHotColor( ctx, col );

               gradient.addColorStop( 0, col );
               gradient.addColorStop( 0.95, col );
               gradient.addColorStop( 1.0, 'rgba(255,255,255,0.0 )' );

               dc.fillStyle = gradient;
               dc.beginPath();
               dc.moveTo( xy[0], xy[1]);     // move to center

               var deltaPhi =  Math.PI * 2 * ( values[nJ] / nSum );
               
               dc.arc( xy[0], xy[1], radius, lastPosition, lastPosition + deltaPhi, false );
               dc.lineTo(xy[0],xy[1]);       // move to center     
               dc.closePath();
               dc.fill();                    // fill the pie
               lastPosition += deltaPhi;
               if (!nK)  // store the angle for the first instance
                   this.m_ARC[ nIndex ].push (lastPosition);

               // todo: store segments positions.............................//
            }
         }

         // reset the transformation.........................................//
         dc.setTransform( 1, 0, 0 , 1, 0, 0 );

      };

      // render pie with respect to data binding.............................//
      this.Render = function( canvas, dc, clusterData )
      {
         // clear bounding boxes, index offsets and design handles...........//
         this.m_BB = [];
         this.m_IO = [];
         this.m_DH = [];
         this.m_ARC = [];  // Angles of the pies for hittest
         this.m_SUM = [];  // total sum of values in pie for percentage calculation

         // get scene and desin mode.........................................//
         var scene = this.m_Scene;
         var ctx = scene.m_Ctx;
         var cntInstances = 0;

         // determine the 

         var node, nSeries;
         if( node = this.m_DataSource.GetCurrentNode( ctx ) )
         {
        	cntInstances = node.m_dataelements.length;
            for( var nJ = 0; nJ < cntInstances; ++nJ )
            {
               this.m_DataSource.Select( nJ );
               var aPos  = this.m_Pos.GetValueVector( ctx );
               var aScale= this.m_Scale.GetValueVector( ctx );

               var radius = 16 * aScale[0];
               var bHot = this.IsHot( nJ );
               var bSelected = this.IsSelected( ctx );

               // determine the hot scale for the pie........................//
               if( bHot ) radius = (this.GetHotScale( ctx ))[0] * radius;

               // select the series item.....................................//
               var aValue = [], aText = [], aSliceColor = [];
               if( nSeries = this.m_Series.GetCurrentNode( ctx ) )
               {
                  for( var nS = 0; nS < nSeries.m_dataelements.length; ++nS )
                  {
                     this.m_Series.Select( nS );
                     aValue.push( this.m_Values.GetValueFloat( ctx ) );
                     aText.push( this.m_Texts.GetValueString( ctx ) );
                     aSliceColor.push( this.m_SliceColor.GetValueColor( ctx ) );
                  }
               }
               var tmp, nHotSlice = ( bHot && ( tmp = scene.m_HotItem.m_HitObj ) && ( tmp = tmp.m_Detail ) ) ? tmp.m_slice : -1;
               this.RenderInstance( nJ, dc, aPos, radius, aValue, aText, aSliceColor, nHotSlice, bSelected );
            }
         } else
         {
            // todo: do single instance rendering
         }

         // call base rendering method.......................................//
         this.BaseRender( canvas, dc );
         
         return cntInstances; // to increase count of Scaling instances         
      };

      this.DetailHitTest = function( ocb, nIndex, nsx, nsy  )
      {
         // we can use the box arrays attributes to get the current radius...//
         // and position.....................................................//
         var bb = this.m_BB[ nIndex ];
         var radius = bb.m_Radius;
         var pos = bb.m_Pos;
         var tdx, tdy;

         // when hit distance lies within the radius, this is a hit..........//
         if( ( ( tdx = ( pos[0] - nsx ) ) * tdx +
               ( tdy = ( pos[1] - nsy ) ) * tdy ) < ( radius * radius ) ) {
             // VBI.Trace("pos=["+pos[0]+","+pos[1]+"] nsx="+nsx+", nsy="+nsy+" tdx="+tdx+",tdy="+tdy);
        	 var angle = Math.acos( tdy / Math.sqrt(tdx*tdx+tdy*tdy));
        	 var realangle = ( tdx <= 0 ? 3 * Math.PI / 2 + angle : 7 * Math.PI / 2 - angle );
        	 var myArc = this.m_ARC[nIndex];
        	 var lowVal = 0, highVal = myArc.length - 1, median;
        	 while ( highVal > lowVal + 1){  // binary search
        		 median = Math.round( (lowVal + highVal) / 2);
        		 if ( myArc[median] > realangle )
        			 highVal = median;
        		 else
        			 lowVal = median;
        	 }
        	 
        	 return { m_hit: 1, m_slice: lowVal };      // todo: do diffuse hits here as well
         }

         return null;   // no hit 
      };
      
      this.GetHitArray = function( x, y )
      {
         // determine the array of instances that are hit....................//
         // x and y are the canvas relative coordinates......................//
         var zf = this.m_Scene.GetCurrentZoomFactors();

         // bounding boxes are defined always in non stretched canvas........//
         // coordinates, therefore transform them............................//
         var nsx = x / zf[0];
         var nsy = y / zf[1];

         var ocb = { m_cb: this.DetailHitTest.bind( this ) };

         // call base function for bounds check..............................//
         return this.BaseHitTest( nsx, nsy, ocb );
      };
      
      this.doFormatedReplaces = function ( mytext, startStr, endStr, value )
      {
    	 var len = startStr.length; 
 		 while ((nIndex=mytext.indexOf ( startStr )) >= 0){
			 var nIndex2 = nIndex+mytext.substring(nIndex+len).indexOf(endStr)+len+1;
			 var sFormatStr = mytext.substring(nIndex+len,nIndex2-1);
			 var bUseKomma=false,nSep;
			 if ( ( nSep = sFormatStr.indexOf(",") ) >= 0)
				 bUseKomma = true;
			 else
				 nSep = sFormatStr.indexOf(".");
			 var nDigits = Math.min(10, ( nSep>=0 ? parseInt(sFormatStr.substring(nSep+1)) : 0));
			 
			 var nCompleteStr=mytext.substring(nIndex,nIndex2);
			 var valStr = "" + value.toFixed(nDigits);
			 if (bUseKomma) valStr = valStr.replace(".",",");
			 mytext = mytext.replace( nCompleteStr, valStr);
 		 }

 		 return mytext;
    	  
      };
      
      
	  this.getTooltip = function (ctx, hitObj )
	  {
		 var pIndex = hitObj.m_Index;              // which pie?
		 var sIndex = hitObj.m_Detail.m_slice;     // which slice?
		 
       this.m_DataSource.Select( pIndex );
       this.m_Series.Select( sIndex );
       var tooltip = this.m_Tooltips.GetValueString( ctx );
       if (tooltip == "")
          tooltip = this.m_Tooltip.GetValueString( ctx );
       if ((tooltip === null)||(tooltip === ""))
          return "";
       tooltip = tooltip.replace(/%MAIN%/,this.m_Tooltip.GetValueString( ctx ));
       tooltip = tooltip.replace(/%NUM%/g,sIndex+1);
       tooltip = tooltip.replace(/%ONUM%/g,sIndex+1);
		 tooltip = tooltip.replace(/%NAME%/g,this.m_Texts.GetValueString( ctx ));
		 
		 var val = parseFloat(this.m_Values.GetValueString( ctx ));
		 
		 tooltip = this.doFormatedReplaces( tooltip, "%VALUE", "%", val );
		 tooltip = this.doFormatedReplaces( tooltip, "%PERCENTAGE", "%", 100 * val / this.m_SUM [pIndex] );

       return tooltip;
	  };   
	  

      // design overridden members...........................................//
      this.DesignBeginDrag = function( ocb )
      {
         // append the original scale to the context.........................//
         ocb.m_ScaleOrig = this.m_Scale.GetValueVector( this.m_Scene.m_Ctx ).slice( 0 );
         ocb.m_DhOrig = this.m_DH[ ocb.m_Index ].slice( 0 );
      };

      this.DesignBoxSize = VBI.Utilities.SceneBindDesignBoxBoxSize.bind( this, true );

      // event handlers......................................................// 
   };
   VBI.VisualObjects.Pie.prototype =  VBI.VisualObjects.Base;

   //........................................................................//
   // box object.............................................................//

   VBI.VisualObjects.Box = function() 
   {
      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );  

         // load bindable properties.........................................//
         this.m_Props.push( this.m_DataSource = new VBI.NodeProperty( dat, 'datasource', null, ctx ) );
         this.m_Props.push( this.m_Pos = new VBI.AttributeProperty( dat, 'pos', this.m_DataSource, ctx,  [ 0.0, 0.0, 0.0 ] ) );
         this.m_Props.push( this.m_Scale = new VBI.AttributeProperty( dat, 'scale', this.m_DataSource, ctx, [ 1.0, 1.0, 1.0 ] ) );
         this.m_Props.push( this.m_Tooltip = new VBI.AttributeProperty( dat, 'tooltip', this.m_DataSource, ctx, this.m_defaultTooltip ) );
         this.m_Props.push( this.m_Color = new VBI.AttributeProperty( dat, 'color', this.m_DataSource, ctx, this.m_defaultColor ) );
         this.m_Props.push( this.m_ColorBorder = new VBI.AttributeProperty( dat, 'colorBorder', this.m_DataSource, ctx, this.m_defaultColor ) );

         // load shared properties...........................................//
         this.BaseLoad( dat, ctx, this );
      };

      // render the single instance..........................................//
      this.RenderInstance = function( nIndex, dc, pos, scale, color, colorBorder, fs )
      {
         var bb, scene = this.m_Scene;

         if( !scale ) scale = [ 1.0, 1.0, 1.0 ];   
         if( !color ) color ="#6f6f7a";

         // determine the location where to render the main instance.........//
         // get the current zoom factors.....................................//
         var xy = scene.GetPointFromPos( pos, false );
         var zf = scene.GetCurrentZoomFactors();

         var sx = 1.0; sy = 1.0;
         if( this.IsHot( nIndex ) )
         {
            // determine the hot scale.......................................//
            var hs = this.GetHotScale( scene.m_Ctx );
            sx = hs[0];
            sy = hs[1];
         }

         // remark: precise box rendering analog to 3D is not possible.......//
         // due 2D uses parallel projection instead of a perspective.........//
         // projection.......................................................//
        
         var baseSize = 370;
         var bx = baseSize * scale[0] * sx / zf[0];
         var by = baseSize * scale[1] * sy / zf[1];

         if( !fs )
         {  
            // when size is not fixed it scales proportional to the zoom.....//
            // level.........................................................//
            var f = Math.pow( 2, scene.GetCurrentZoomlevel() ) / 14.6;
            bx *= f;
            by *= f;
         }

         // determine the box dimensions.....................................//
         var l =  xy[0] - bx/2;
         var t =  xy[1] - by/2;
         var r =  xy[0] + bx/2;
         var b =  xy[1] + by/2;

         // determine the instance offsets...................................//
         var aIO = this.m_IO[ nIndex ] = scene.GetInstanceOffsets( bb = this.m_BB[ nIndex ] = [ l, t, r, b ] );

         // push all points to design mode handles array.....................//
         if( this.IsPosChangeable( scene.m_Ctx ) )
         {
            var aDH = ( this.m_DH[ nIndex ] = [] );
            if( this.IsHandleMode() )
            {
               // just push the line points to the design handle array.......//
               aDH.m_EditMode = VBI.EMHandle;
               aDH.push( xy );
            } else
            if( this.IsBoxMode() )
            {
               // just push the box points to the design handle array........//
               aDH.m_EditMode = VBI.EMBox;
               aDH.push( bb );
            }
         }

         // pixel the box....................................................//
         for( var nJ = 0; nJ < aIO.length; ++nJ )
         {
            dc.setTransform( 1, 0, 0 , 1, aIO[nJ], 0 );

            // draw the filled rectangle.....................................//
            dc.fillStyle = color;
            dc.fillRect( l, t, bx, by );

            // daw a border around...........................................//
            dc.lineWidth = 1;
            dc.strokeStyle = colorBorder;
            dc.strokeRect( l, t, bx, by );  

            // draw the bounding box.........................................//
            VBI.m_bTrace && VBI.Utilities.DrawFrameRect( dc, "red", this.m_BB[ nIndex ] );
         }

         dc.setTransform( 1, 0, 0, 1, 0, 0 );
      };

      // render with respect to data binding.................................//
      this.Render = function( canvas, dc, clusterData )
      {
         // clear bounding boxes and index offsets and design handles........//
         this.m_BB = [];
         this.m_IO = [];
         this.m_DH = [];

         // get the scene and design mode....................................//
         var scene = this.m_Scene, ctx = scene.m_Ctx;
         var cntInstances = 0;

         var node;
         if( node = this.m_DataSource.GetCurrentNode( ctx ) )
         {
        	cntInstances = node.m_dataelements.length;
            for( var nJ = 0 ; nJ < cntInstances; ++nJ )
            {
               this.m_DataSource.Select( nJ );
               var bHot = this.IsHot( nJ );
               var bSelected = this.IsSelected( ctx );

               var aPos  = this.m_Pos.GetValueVector( ctx );
               var aScale  = this.m_Scale.GetValueVector( ctx );

               var aCol = this.m_Color.GetValueColor( ctx ); 
               if( bSelected ) aCol = this.GetSelectColor( ctx, aCol );
               if( bHot ) aCol = this.GetHotColor( ctx, aCol );

               var aColBorder = this.m_ColorBorder.GetValueColor( ctx ); 
               if( bSelected ) aColBorder = this.GetSelectColor( ctx, aColBorder );
               if( bHot ) aColBorder = this.GetHotColor( ctx, aColBorder );

               var aFxSize = this.m_FxSize.GetValueBool( ctx );

               this.RenderInstance( nJ, dc, aPos, aScale, aCol, aColBorder, aFxSize );
            }
         } else
         {
            // todo: do single instance rendering
         }

         // call base rendering method.......................................//
         this.BaseRender( canvas, dc );
         
         return cntInstances; // to increase count of Scaling instances
      };

      this.DetailHitTest = function( ocb, nIndex, nsx, nsy  )
      {
         return { m_hit: 1 };   // always a hit due bounds is equal to box, todo: diffuse hit
      };
      
      this.GetHitArray = function( x, y )
      {
         // determine the array of instances that are hit....................//
         // x and y are the canvas relative coordinates......................//
         var zf = this.m_Scene.GetCurrentZoomFactors();

         // bounding boxes are defined always in non stretched canvas........//
         // coordinates, therefore transform them............................//
         var nsx = x / zf[0];
         var nsy = y / zf[1];

         var ocb = { m_cb: this.DetailHitTest.bind( this ) }; 

         // call base function for bounds check..............................//
         return this.BaseHitTest( nsx, nsy, ocb );
      };

      // design overridden members...........................................//
      this.DesignBeginDrag = function( ocb )
      {
         // append the original scale to the context.........................//
         ocb.m_ScaleOrig = this.m_Scale.GetValueVector( this.m_Scene.m_Ctx ).slice( 0 );
         ocb.m_DhOrig = this.m_DH[ ocb.m_Index ].slice( 0 );
      };

      // design overridden members...........................................//
      /*
      this.DesignGetActiveBoxHandles = function( idx )
      {
         // return the valid box handles in design mode......................//
         return [ 1, 1, 1, 1, 0, 1, 0, 0, 0 ];
      };
      */
      this.DesignBoxSize = VBI.Utilities.SceneBindDesignBoxBoxSize.bind( this, false );

      // event handlers......................................................// 
   };
   VBI.VisualObjects.Box.prototype = VBI.VisualObjects.Base;

   //........................................................................//
   // area object............................................................//

   VBI.VisualObjects.Area = function() 
   {
      this.m_LineWidth = 1;

      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );  

         // load bindable properties.........................................//
         this.m_Props.push( this.m_DataSource = new VBI.NodeProperty( dat, 'datasource', null, ctx ) );
         this.m_Props.push( this.m_Pos = new VBI.AttributeProperty( dat, 'posarray', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_Scale = new VBI.AttributeProperty( dat, 'scale', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_Color = new VBI.AttributeProperty( dat, 'color', this.m_DataSource, ctx, this.m_defaultColor ) );
         this.m_Props.push( this.m_ColorBorder = new VBI.AttributeProperty( dat, 'colorBorder', this.m_DataSource, ctx, this.m_defaultColor ) );
         this.m_Props.push( this.m_Tooltip = new VBI.AttributeProperty( dat, 'tooltip', this.m_DataSource, ctx, this.m_defaultTooltip ) );

         // load shared properties...........................................//
         this.BaseLoad( dat, ctx, this );
      };

      this.RenderArea = function( nIndex, dc, pointarray, color, colorBorder, linewidth, hotedge )
      {
         var sqdistance = linewidth * linewidth / 2;
         var idx, xyz, tdx, tdy;

         // draw lines between the points....................................//
         var nItems = pointarray.length/3;
         if( nItems < 2 ) return;         // at least 2 points are required..//

         var aLinePoints = this.m_LP[ nIndex ];      // linepoint array......//

         // linepoints and handle pints are only collected for the first.....//
         // world instance...................................................//
         if( aLinePoints.length ) 
            aLinePoints = null;

         dc.strokeStyle = colorBorder ;
         dc.fillStyle = color ;
         dc.lineWidth = hotedge > 0 ? 2 : linewidth;
         dc.lineCap = 'round';

         dc.beginPath();
         var tmp = [ pointarray[0], pointarray[1] ];
         if( aLinePoints ) aLinePoints.push( tmp );

         dc.moveTo( tmp[0], tmp[1] );            // move to start............//
         for( var nJ = 1; nJ < nItems; ++nJ )
         {
            idx = nJ * 3;
            xyz = [ pointarray[ idx ], pointarray[ idx + 1 ], 0.0 ];

            // when the distance is too small between projected points.......//
            // skip rendering................................................//
            if( ( ( tdx = ( tmp[0] - xyz[0] ) ) * tdx  +
                  ( tdy = ( tmp[1] - xyz[1] ) ) * tdy    ) < sqdistance )
               continue;

            dc.lineTo( xyz[0], xyz[1] );
            if( aLinePoints ) aLinePoints.push( xyz );
            tmp = xyz;
         }
         dc.closePath();

         // fill and stroke..................................................//
         dc.fill();
         dc.stroke();
      };      
      
      
      this.CalculateLabelPos = function( scene, pointarray, offset )
      {
          var zf = scene.GetCurrentZoomFactors();
          var rctest = scene.m_Div.getBoundingClientRect();
          var rcWidth = rctest.width / zf[0];
          var rcHeight = rctest.height / zf[1];
          var PosXTest = scene.m_Canvas[0].getPixelLeft() / zf[0];
          var PosYTest = scene.m_Canvas[0].getPixelTop() / zf[1];
          
          var rcviewport = [-PosXTest, -PosYTest, -PosXTest + rcWidth, -PosYTest + rcHeight]; 

          
          var pt = VBI.Utilities.GetMidpointsForPolygon( pointarray.pa, pointarray.bb, offset, rcviewport );
          if ( pt && pt.aPos)
          {
             return pt.aPos;
          }
          return null;
      };
      
      this.RenderInstance = function( nIndex, dc, posarray, color, colorBorder, linewidth, hotedge, label )
      {
         var scene = this.m_Scene;

         // determine the nearest position array.............................//
         // and the instance offsets.........................................//
         var apos = scene.GetNearestPosArray( posarray );

         // due y maps are positive in top direction there is a cross over of//
         // of min and max values............................................//
         var lt = scene.GetPointFromPos( [ apos.m_MinX, apos.m_MaxY, 0.0 ], false  );
         var rb = scene.GetPointFromPos( [ apos.m_MaxX, apos.m_MinY, 0.0 ], false  );

         // determine the instance offsets and store the bounds..............//
         var aIO = this.m_IO[ nIndex ] = scene.GetInstanceOffsets( this.m_BB[ nIndex ] = [ lt[0] - linewidth, lt[1] - linewidth, rb[0] + linewidth, rb[1] + linewidth] );

         // one burst convert to points......................................//
         // for all round world instances....................................//
         var pointarray = aIO.length ? scene.GetPointArrayFromPosArray( apos, false ) : null;

         // move all points to design mode handles array.....................//
         if( this.IsPosChangeable( scene.m_Ctx ) && pointarray )
         {
            var aDH = ( this.m_DH[ nIndex ] = [] );
            if( this.IsHandleMode() )
            {
               // just push the line points to the design handle array.......//
               aDH.m_EditMode = VBI.EMHandle;
               for( var nJ = 0, length = pointarray.length / 3; nJ < length; ++nJ )
                  aDH.push( [ pointarray[ nJ * 3 ], pointarray[ nJ * 3 + 1 ] ] );
            } else
            if( this.IsBoxMode() )
            {
               // just push the box points to the design handle array........//
               aDH.m_EditMode = VBI.EMBox;
               aDH.push( this.m_BB[ nIndex ] );
            }
         }

         for( var nJ = 0; nJ < aIO.length; ++nJ )
         {  
            dc.setTransform( 1, 0, 0 , 1, aIO[nJ], 0 );
            this.RenderArea( nIndex, dc, pointarray, color, colorBorder, linewidth, hotedge );
            
            // draw the bounding box.........................................//
            VBI.m_bTrace && VBI.Utilities.DrawFrameRect( dc, "red", this.m_BB[ nIndex ] );
         }
         dc.setTransform( 1, 0, 0, 1, 0, 0 );
         if ( label && aIO.length )
         {
            var rcBox = [0,0,0,0];
            
            var pta = [];
            for ( var nJ = 0; nJ <= pointarray.length - 3; nJ+=3 )
            {
               pta.push(pointarray[nJ], pointarray[nJ+1]);
            }
            var positions = {pa:pta, bb:[lt,rb]};
            this.m_Label.push( new VBI.Label( label, this.CalculateLabelPos, positions, rcBox, aIO ) );
         }
         
      };

      // render with respect to data binding.................................//
      this.Render = function( canvas, dc, clusterData )
      {
         // clear bounding boxes and index offsets and linepoints............//
         this.m_BB = [];
         this.m_IO = [];
         this.m_LP = [];
         this.m_DH = [];

         if( this.m_Label )
         {
            for ( var nJ = 0; nJ < this.m_Label.length; ++nJ )
               this.m_Label[nJ].clear();
            this.m_Label = [];
         }
         
         // get scene and design mode........................................//
         var scene = this.m_Scene;
         var ctx = scene.m_Ctx;

         // determine the binding information................................//
         var node;
         if( node = this.m_DataSource.GetCurrentNode( ctx ) )
         {
            // the element count determines the number of rendered instances.//
            for( var nJ = 0, len = node.m_dataelements.length; nJ < len; ++nJ )
            {
               this.m_DataSource.Select( nJ );

               // create a subarray on the index.............................//
               this.m_LP[ nJ ] = [];

               var bHot = this.IsHot( nJ );
               var bSelected = this.IsSelected( ctx );

               // get the instance attributes................................//
               var hotedge = -1;
               var pa = this.m_Pos.GetValueVector( ctx );
               var col = this.m_Color.GetValueColor( ctx );
               if( bSelected ) col = this.GetSelectColor( ctx, col );

               var colBorder = this.m_ColorBorder.GetValueColor( ctx );
               if( bSelected ) colBorder = this.GetSelectColor( ctx, colBorder );

               // get details of the hot state...............................//
               if( bHot )
               {
                  var detail = scene.m_HotItem.m_HitObj.m_Detail;
                  // only when edge events are subscribed the border gets hot//
                  if( detail && detail.m_edge >= 0 && ( this.BaseFindAction( "EdgeClick" ) || this.BaseFindAction( "EdgeContextMenu" ) ) )
                  {
                     hotedge = detail.m_edge;
                     colBorder = this.GetHotColor( ctx, colBorder );
                  } else
                  {
                     col = this.GetHotColor( ctx, col );
                     colBorder = this.GetHotColor( ctx, colBorder );
                  }
               }

               this.RenderInstance( nJ, dc, pa, col, colBorder, this.m_LineWidth, hotedge, this.GetLabel( ctx ) );
            }
         } else
         {
            // this is a single instance rendering...........................//
            // todo: do single instance rendering............................//
         }

         // call base rendering method.......................................//
         this.BaseRender( canvas, dc );
      };

      this.DetailHitTest = function( ocb, nIndex, nsx, nsy  )
      {
         if( VBI.Utilities.pointInPolygon( this.m_LP[ nIndex ], nsx, nsy ) )
         {
            var hit = { m_hit: 1 };

            // line points defined always in non stretched canvas............//
            var o;
            if( (o = VBI.Utilities.pointOnLine( this.m_LP[ nIndex ], nsx, nsy, 5, true ) ) && o.m_edge >= 0 )
            {
               hit.m_edge = o.m_edge;
               hit.m_node = o.m_node;
            }

            return hit;
         }
         return null;
      };

      this.GetHitArray = function( x, y )
      {
         // determine the array of instances that are hit....................//
         // x and y are the canvas relative coordinates......................//
         var zf = this.m_Scene.GetCurrentZoomFactors();

         // bounding boxes are defined always in non stretched canvas........//
         // coordinates, therefore transform them............................//
         var nsx = x / zf[0];
         var nsy = y / zf[1];

         var ocb = { m_cb: this.DetailHitTest.bind( this ) }; 

         // call base function for bounds check..............................//
         return this.BaseHitTest( nsx, nsy, ocb );
      };

      this.ProcessDetailNodeEdgeEvent = function( event, ele, hit, name )
      {
         // the detail click is called before a potential click event is.....//
         // fired by the base implementation.................................//

         // check if the edge click is subscribed............................//
         var scene = this.m_Scene, actions = scene.m_Ctx.m_Actions;
         if( actions )
         {
            var action;
            if( action = actions.findAction( name, scene, this ) )
            {
               // get basic params........................................//
               var params = scene.GetEventVPCoordsObj( event );

               // append the edge parameter...............................//
               params.edge = hit.m_Detail.m_edge.toString();
               params.node = hit.m_Detail.m_node.toString();
               this.m_Scene.m_Ctx.FireAction( action, scene, this, ele, params );
                  return true;
            }
         }
         return false;
      };

      this.DetailClick = function( event, ele, hit )
      {
         if( hit.m_Detail && (hit.m_Detail.m_edge >= 0) )
            return this.ProcessDetailNodeEdgeEvent( event, ele, hit, 'EdgeClick' );
         return false;
      };

      this.DetailContextmenu = function( event, ele, hit )
      {
         if( hit.m_Detail && (hit.m_Detail.m_edge >= 0 ) )
            return this.ProcessDetailNodeEdgeEvent( event, ele, hit, 'EdgeContextMenu' );
         return false;
      };

      // design overridden members...........................................//
      this.DesignBoxSize = VBI.Utilities.SceneBindPosArrayDesignBoxSize.bind( this );
   };
   VBI.VisualObjects.Area.prototype = VBI.VisualObjects.Base;


   //........................................................................//
   // heatmap object.........................................................//

   VBI.VisualObjects.HeatMap = function()
   {
      this.load = function( dat, ctx )
      {
         jQuery.sap.require( "sap.ui.vbm.lib." + "sapheatmap" );
         
         
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );  

         // load bindable properties.........................................//
         this.m_Props.push( this.m_DataSource = new VBI.NodeProperty( dat, 'datasource', null, ctx ) );
         this.m_Props.push( this.m_Pos = new VBI.AttributeProperty( dat, 'pos', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_Value = new VBI.AttributeProperty( dat, 'value', this.m_DataSource, ctx, 1 ) );
         this.m_Props.push( this.m_Opacity = new VBI.AttributeProperty( dat, 'opacity', this.m_DataSource, ctx, 0.5 ) );
         this.m_Props.push( this.m_Gradient = new VBI.AttributeProperty( dat, 'gradient', this.m_DataSource, ctx, "" ) );
         
         // load shared properties...........................................//
         this.BaseLoad( dat, ctx, this );
      };

      this.CollectData = function( ctx )
      {
         var scene = this.m_Scene;
         var   nx, ny, node, aPos = [], aVal = [], 
               minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, 
               maxX = -Number.MAX_VALUE, maxY = -Number.MAX_VALUE;
       
         if( node = this.m_DataSource.GetCurrentNode( ctx ) )
         {
            for( var nJ = 0, len = node.m_dataelements.length; nJ < len; ++nJ )
            {
               this.m_DataSource.Select( nJ );
               var pos = this.m_Pos.GetValueVector( ctx );
               nx = pos[0];  
               ny = pos[1];
               if( minX > nx ) minX = nx; 
               if( maxX < nx ) maxX = nx;
               if( minY > ny ) minY = ny; 
               if( maxY < ny ) maxY = ny;
               aVal.push( this.m_Value.GetValueFloat( ctx ) );
               aPos.push( pos[0], pos[1], 0 );  
            }
         }
         
         // due y maps are positive in top direction there is a cross over of//
         // of min and max values............................................//
         var lt = scene.GetPointFromPos( [ minX, maxY, 0.0 ], false );
         var rb = scene.GetPointFromPos( [ maxX, minY, 0.0 ], false );

         // determine the instance offsets and store bounds..................//
         this.m_IO[ 0 ] = scene.GetInstanceOffsets( [ lt[0], lt[1], rb[0], rb[1] ] );
         
         return { pos: this.m_Scene.GetPointArrayFromPosArray( aPos, false ), val: aVal };
      };

      // render heatmap with respect to data binding.........................//
      this.Render = function( canvas, dc )
      {
         this.m_IO = [];
         
         // get scene and desin mode.........................................//
         var scene = this.m_Scene;
         var ctx = scene.m_Ctx;
         var width = scene.m_nWidthCanvas;
         var height = scene.m_nHeightCanvas;
         
         if( !this.Heatmap )
         {
            var canv = document.createElement("canvas");
            canv.width = width;
            canv.height = height;
            this.Heatmap = VBI.CreateHM( { canvas: canv, colorTexture: ctx.GetResources().GetData( this.m_Gradient.GetValueString(ctx) ),  alpha: true, width: width, height: height } );
            // this.Heatmap = VBI.CreateHM( { canvas: canv, width: width, height: height } );
         }
         
         var heatmap =  this.Heatmap;
         var oVal = this.CollectData( ctx );         
         
         heatmap.Clear();
         for( var nK = this.m_IO[0].length - 1; nK >= 0; --nK )   // loop for round world instances
         {
            var offset = this.m_IO[0][nK];
            for( var nJ = 0, len = oVal.pos.length/3; nJ < len; ++nJ )
               heatmap.AddPoint( oVal.pos[ 3 * nJ ] + offset, oVal.pos[ 3 * nJ + 1 ] , (oVal.val[ nJ ] + 20)/100, 70  );
         }
         
         heatmap.Render();   			// render
         
         var a = dc.globalAlpha;
         dc.globalAlpha = this.m_Opacity.GetValueFloat( ctx );
         dc.drawImage( heatmap.m_Canv, 0, 0 );
         dc.globalAlpha = a;
      };
       
      this.DetailHitTest = function( ocb, nIndex, nsx, nsy  )
      {
         return null;   // no hit 
      };
      
      this.GetHitArray = function( x, y )
      {
         // determine the array of instances that are hit....................//
         // x and y are the canvas relative coordinates......................//
         var zf = this.m_Scene.GetCurrentZoomFactors();

         // bounding boxes are defined always in non stretched canvas........//
         // coordinates, therefore transform them............................//
         var nsx = x / zf[0];
         var nsy = y / zf[1];
         var ocb = { m_cb: this.DetailHitTest.bind( this ) };

         // call base function for bounds check..............................//
         return this.BaseHitTest( nsx, nsy, ocb );
      };

      // design overridden members...........................................//
      this.DesignBeginDrag = function( ocb )
      {
         // append the original scale to the context.........................//
         ocb.m_ScaleOrig = this.m_Scale.GetValueVector( this.m_Scene.m_Ctx ).slice( 0 );
         ocb.m_DhOrig = this.m_DH[ ocb.m_Index ].slice( 0 );
      };

      this.DesignBoxSize = VBI.Utilities.SceneBindDesignBoxBoxSize.bind( this, true );

      // event handlers.........................................................//
   };
   VBI.VisualObjects.HeatMap.prototype =  VBI.VisualObjects.Base;

   //...........................................................................//
   // container.................................................................//

   VBI.VisualObjects.Container = function()
   {
	  this.m_ContHash = {};      
	  this.m_Cont = [];          // containers..................................//
      this.m_Sub = [];           // subscriptions...............................//
      
      this.load = function (dat, ctx) 
      {
         // call prototype......................................................//
         Object.getPrototypeOf(this).load(this, dat, ctx);

         this.m_Props.push( this.m_DataSource = new VBI.NodeProperty( dat, 'datasource', null, ctx ) );
         this.m_Props.push( this.m_Pos = new VBI.AttributeProperty( dat, 'pos', this.m_DataSource, ctx ) );
         this.m_Props.push( this.m_Key = new VBI.AttributeProperty(dat, 'key', this.m_DataSource, ctx, "") );
         this.m_Props.push( this.m_Tooltip = new VBI.AttributeProperty(dat, 'tooltip', this.m_DataSource, ctx, "") );
         this.m_Props.push( this.m_Alignment = new VBI.AttributeProperty(dat, 'alignment', this.m_DataSource, ctx, "0") );
         
         // push the subscriptions..............................................//
         this.m_Sub.push( this.m_Scene.m_EvtCont.subscribe( "onMove", this.onLayout.bind( this ) ) );
         this.m_Sub.push( this.m_Scene.m_EvtCont.subscribe( "onZoom", this.onLayout.bind( this ) ) );
      };

      this.clear = function ()
      {
         // unsubscribe events..................................................//
         // and delete container entries
        
         // call prototype of base class........................................//
         Object.getPrototypeOf(this).clear();
         
         for( var nJ = 0, len = this.m_Sub.lenght; nJ< len; ++nJ )
            this.m_Sub[nJ].unsubscribe();

         this.m_Sub = [];
      };
   	  
      
      // helper functions.......................................................//
      this.getParentDiv = function ()
      {
         return this.m_Scene.m_Div;
      };

      // mark and sweep.........................................................// 

      this.findContainer = function( id ) 
      {
    	 return this.m_ContHash[ id ];
      };

      this.markContainer = function (cont, val) 
      {
         cont.m_Mark = val;
      };

      this.markContainers = function (val) 
      {
         for (var nJ = 0, len = this.m_Cont.length; nJ < len; ++nJ)
            this.m_Cont[nJ].m_Mark = val;
      };

      this.sweepContainers = function (val, ctx ) 
      {
         var par = this.getParentDiv();

         for( var len = this.m_Cont.length, nJ = len - 1; nJ >= 0; --nJ) 
         {
        	var cont = this.m_Cont[nJ];
            if( cont.m_Mark == val ) 
            {
               // remove the child
               this.m_Cont.splice( nJ, 1 );
               
               // call hook..................................................//
               ctx.onCloseWindow( cont.id, cont );
              
               par.removeChild( cont );
            }
         }
      };

      this.updateContainers = function( canvas, scene, ctx ) 
      {
    	  // mark containers for potential deletion..........................//
    	 this.markContainers(true);

         var div = this.getParentDiv();
         var oX = canvas.getPixelLeft();
         var oY = canvas.getPixelTop();
         var tmp = [];
         
         // determine the array of instances that are hit....................//
         // x and y are the canvas relative coordinates......................//
         var zf = this.m_Scene.GetCurrentZoomFactors();
         
         if( node = this.m_DataSource.GetCurrentNode(ctx) ) 
         {
            var cont, len = node.m_dataelements.length;
            for (var nJ = 0, len = node.m_dataelements.length; nJ < len; ++nJ) 
            {
               this.m_DataSource.Select(nJ);

               var pos = this.m_Pos.GetValueVector(ctx);
               var key = this.m_Key.GetValueString(ctx);
               var tt = this.m_Tooltip.GetValueString(ctx);
               var algnmt = this.m_Alignment.GetValueString(ctx);
               var lt = scene.GetPointFromPos(pos, false);

               // when container with a key is found, then use it
               if( cont = this.findContainer( key ) ) 
               {
                  this.markContainer(cont, false);
                  tmp.push( cont );
                  
                  // when we find a container but it has no content (anymore)//
                  // ask for content by calling open window..................//
                  if( !cont.children.length )
                	  ctx.onOpenWindow( key, cont );
                  
               } else 
               {
            	  // create a new one and add it............................//
                  cont = VBI.Utilities.CreateContainer( "vbi_" + key, key, oX + ( lt[0] | 0 ), oY + ( lt[1] | 0 ), "50px", "30px", tt, 500 );
                  cont.m_ID = this.m_ID;
                  
                  this.markContainer(cont, false);
                  tmp.push( cont );
                  div.appendChild(cont);

                  // call hook...............................................//
                  ctx.onOpenWindow( key, cont );
               }
            }
         }
         
         // all containers marked with true are sweept.......................//
         this.sweepContainers( true, ctx );
         
         // fill new hash....................................................//
         this.m_ContHash = {};			// clear the hash for the containers.//
         this.m_Cont = tmp;				// store the container array.........//
         for( var nJ = 0, len = tmp.length; nJ < len; ++nJ )
        	 this.m_ContHash[ tmp[nJ].m_Key ] = tmp[nJ];
      };

      this.onLayout = function( o )
      {
         // there was a move or zoom.........................................//
         
         // determine the array of instances that are hit....................//
         // x and y are the canvas relative coordinates......................//
         // var zf = this.m_Scene.GetCurrentZoomFactors();         
         this.RenderInstances( o.canvas, [1.0,1.0] );
      };
      
      // render with respect to data binding....................................//
      this.RenderInstances = function( canvas, zf ) 
      {
         var scene = this.m_Scene;
         var ctx = scene.m_Ctx;

         // mark all containers.................................................//
         if( this.m_bChanged )
         {
        	this.updateContainers( canvas, scene, ctx );
            this.m_bChanged = false;
         }

         var oX = canvas.getPixelLeft();
         var oY = canvas.getPixelTop();
         
         if( node = this.m_DataSource.GetCurrentNode(ctx) ) 
         {
            var len = node.m_dataelements.length;

            for (var nJ = 0, len = node.m_dataelements.length; nJ < len; ++nJ) 
            {
               var cont = this.m_Cont[nJ]
               this.m_DataSource.Select(nJ);
               var pos = this.m_Pos.GetValueVector(ctx);

               var lt = scene.GetPointFromPos(pos, true);
               cont.style.left = ( oX + ( lt[0] | 0 ) / zf[0] )  + "px";
               cont.style.top = ( oY + ( lt[1] | 0 ) / zf[1] ) + "px";
               var algnmt = this.m_Alignment.GetValueString(ctx);
               switch ( algnmt )
               {
               case "0": // center
                  cont.style.msTransform = cont.style.transform = "translate(-50%, -50%)";
                  break;
               case "1": // top center
                  cont.style.msTransform = cont.style.transform = "translate(-50%, 0%)";
                  break;
               case "2": // top right
                  cont.style.msTransform = cont.style.transform = "translate(-100%, 0%)";
                  break;
               case "3": // center right
                  cont.style.msTransform = cont.style.transform = "translate(-100%, -50%)";
                  break;
               case "4": // bottom right
                  cont.style.msTransform = cont.style.transform = "translate(-100%, -100%)";
                  break;
               case "5": // bottom center
                  cont.style.msTransform = cont.style.transform = "translate(-50%, -100%)";
                  break;
               case "6": // bottom left
                  cont.style.msTransform = cont.style.transform = "translate(0%, -100%)";
                  break;
               case "7": // center left
                  cont.style.msTransform = cont.style.transform = "translate(0%, -50%)";
                  break;
               default:
               case "8": // top left
                  cont.style.msTransform = cont.style.transform = "translate(0%, 0%)";
                  break;
               }                  
            }
         }
      };

      
      // render with respect to data binding....................................//
      this.Render = function( canvas, dc ) 
      {
         var zf = this.m_Scene.GetCurrentZoomFactors();
         if( zf[0] != 1.0 ) 
            return;
         
         this.RenderInstances(  canvas, [ 1.0, 1.0 ] );
      };

      // event handler..........................................................//
      this.onclick = function (event) {
         // call base implementation for click events...........................//
         return this.BaseClick(event);
      };
   };
   VBI.VisualObjects.Container.prototype = VBI.VisualObjects.Base;   

   //........................................................................//
   // 2D controls............................................................//
   // prototype object of 2D controls........................................//

   VBI.VisualObjects.Base2D = function()
   {
      this.m_DOMElement = null;
      
      // we do calculated paddings for our 2D ui elements to get rid of an...//
      // additional container................................................//

      this.m_paddingLeft = 5;
      this.m_paddingTop = 5;
      this.m_paddingRight = 5;
      this.m_paddingBottom = 5;

      // check if the ui element is still valid..............................//
      this.IsValid = function( )
      {
         if( this.m_DOMElement && this.m_Scene.m_Div )
         {
            // check if everything is still ok...............................//
            if( this.m_DOMElement.parentNode == this.m_Scene.m_Div )
               return true;
         }
         return false;
      };

      this.load = function( inst, dat, ctx )
      {
         // call prototype of base class.....................................//
         Object.getPrototypeOf(this).load( inst, dat, ctx );  

         // load bindable properties.........................................//
         inst.m_Props.push( inst.m_Left = new VBI.AttributeProperty( dat, 'left', null, ctx ) );
         inst.m_Props.push( inst.m_Top = new VBI.AttributeProperty( dat, 'top', null, ctx ) );
         inst.m_Props.push( inst.m_Right = new VBI.AttributeProperty( dat, 'right', null, ctx ) );
         inst.m_Props.push( inst.m_Bottom = new VBI.AttributeProperty( dat, 'bottom', null, ctx ) );

         // align values left:1, right:2, center:4 ,,,,,,,,,,,,,,,,,,,,,,,,,,//
         inst.m_Props.push( inst.m_Align = new VBI.AttributeProperty( dat, 'align', null, ctx, 1 ) );
      };

      this.clear = function()
      {
         // call prototype of base class.....................................//
         Object.getPrototypeOf( this ).clear();  

         this.m_DOMElement = null;
      };

      //.....................................................................//
      // overwritten functions...............................................//
      
      this.BaseClick = function( event )
      {
         var scene = this.m_Scene;

         // check for subscribed action and fire event.......................//
         var actions;
         if( actions = scene.m_Ctx.m_Actions )
         {
            var action;
            if( action = actions.findAction( "Click", scene, this ) )
            {
               scene.m_Ctx.FireAction( action, scene, this, null, scene.GetEventVPCoordsObj( event ) );
               event.preventDefault();
               return true;   // handled
            }
         }

         return false;
      };
   };
   VBI.VisualObjects.Base2D.prototype = VBI.VisualObjects.Base;


   //........................................................................//
   // caption object.........................................................//

   VBI.VisualObjects.Caption = function() 
   {
      this.m_LineWidth = 1;
      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );  

         // load bindable properties.........................................//
         this.m_Props.push( this.m_Text = new VBI.AttributeProperty( dat, 'text', null, ctx, "" ) );
         this.m_Props.push( this.m_Design = new VBI.AttributeProperty( dat, 'design', null, ctx, "0" ) );
         this.m_Props.push( this.m_Level = new VBI.AttributeProperty( dat, 'level', null, ctx, 0 ) );
         this.m_Props.push( this.m_Tooltip = new VBI.AttributeProperty( dat, 'tooltip', null, ctx, "" ) );
      };

      // render with respect to data binding.................................//
      this.Render = function( canvas, dc, clusterData )
      {
         if( this.IsValid() )
            return;              // no update needed.........................//

         // get properties and apply them to the dom element.................//
         var ctx = this.m_Scene.m_Ctx;
         var l = this.m_Left.GetValueLong(ctx );
         var t = this.m_Top.GetValueLong( ctx );
         var r = this.m_Right.GetValueLong( ctx );
         var b = this.m_Bottom.GetValueLong( ctx );
         var align = this.m_Align.GetValueLong( ctx );
         var txt = this.m_Text.GetValueString( ctx );
         var dsn = this.m_Design.GetValueLong( ctx );
         var lev = this.m_Level.GetValueLong( ctx );
         var tt = this.m_Tooltip.GetValueString( ctx );
         

         this.m_DOMElement = VBI.Utilities.CreateCaption( this.m_ID, txt, l + this.m_paddingLeft, t + this.m_paddingTop, r + this.m_paddingLeft, b + this.m_paddingTop, tt, dsn, lev, align );

         // append the child to the div......................................//
         this.m_Scene.m_Div.appendChild( this.m_DOMElement );
      };
   };

   VBI.VisualObjects.Caption.prototype = new VBI.VisualObjects.Base2D;

   //........................................................................//
   // caption object.........................................................//

   VBI.VisualObjects.Label = function() 
   {
      this.m_LineWidth = 1;

      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );  

         // load bindable properties.........................................//
         this.m_Props.push( this.m_Text = new VBI.AttributeProperty( dat, 'text', null, ctx, "" ) );
         this.m_Props.push( this.m_Design = new VBI.AttributeProperty( dat, 'design', null, ctx, "0" ) );
      };

      // render with respect to data binding.................................//
      this.Render= function( canvas, dc, clusterData )
      {
         if( this.IsValid() )
            return;              // no update needed.........................//

         // get properties and apply them to the dom element.................//
         var ctx = this.m_Scene.m_Ctx;
         var l = this.m_Left.GetValueLong(ctx );
         var t = this.m_Top.GetValueLong( ctx );
         var r = this.m_Right.GetValueLong( ctx );
         var align = this.m_Align.GetValueLong( ctx );
         var b = this.m_Bottom.GetValueLong( ctx );
         var txt = this.m_Text.GetValueString( ctx );
         this.m_DOMElement = VBI.Utilities.CreateLabel( this.m_ID, txt, l + this.m_paddingLeft, t + this.m_paddingTop, r + this.m_paddingLeft, b + this.m_paddingTop, 0, align );

         // append the child to the div......................................//
         this.m_Scene.m_Div.appendChild( this.m_DOMElement );
      };
   };
   VBI.VisualObjects.Label.prototype = new VBI.VisualObjects.Base2D;

   //........................................................................//
   // link object............................................................//

   VBI.VisualObjects.Link = function()
   {
      this.m_LineWidth = 1;

      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );

         // load bindable properties.........................................//
         this.m_Props.push( this.m_Reference = new VBI.AttributeProperty( dat, 'reference', null, "" ) );
         this.m_Props.push( this.m_Autoexecute = new VBI.AttributeProperty( dat, 'autoexecute', null, ctx, false ) );
         this.m_Props.push( this.m_Tooltip = new VBI.AttributeProperty( dat, 'tooltip', null, ctx, "" ) );
         this.m_Props.push( this.m_Text = new VBI.AttributeProperty( dat, 'text', null, ctx, "" ) );
      };
      
      this.clear = function()
      {
         // unsubscribe events...............................................//
         if( this.m_DOMElement )
            this.m_DOMElement.onclick = null;
         
         // call prototype of base class.....................................//
         Object.getPrototypeOf( this ).clear();  
      };

      // render with respect to data binding.................................//
      this.Render = function( canvas, dc, clusterData )
      {
         if( this.IsValid() )
            return;              // no update needed.........................//

         // get properties and apply them to the dom element.................//
         var ctx = this.m_Scene.m_Ctx;
         var l = this.m_Left.GetValueLong(ctx );
         var t = this.m_Top.GetValueLong( ctx );
         var r = this.m_Right.GetValueLong( ctx );
         var b = this.m_Bottom.GetValueLong( ctx );
         var align = this.m_Align.GetValueLong( ctx );
         var txt = this.m_Text.GetValueString( ctx );
         var ref = this.m_Reference.GetValueString( ctx );
         var ae = this.m_Autoexecute.GetValueBool( ctx );
         var tt = this.m_Tooltip.GetValueString( ctx );

         this.m_DOMElement = VBI.Utilities.CreateLink( this.m_ID, txt, l + this.m_paddingLeft, t + this.m_paddingTop, r + this.m_paddingLeft, b + this.m_paddingTop, ae ? ref : null, tt, align );

         // append the child to the div......................................//
         this.m_Scene.m_Div.appendChild( this.m_DOMElement );

         // subscribe to events..............................................//
         this.m_DOMElement.onclick = this.onclick.bind( this );
      };

      // event handler.......................................................//
      this.onclick = function( event )
      {
         // call base implementation for click events........................//
         return this.BaseClick( event );
      };
   };
   VBI.VisualObjects.Link.prototype = new VBI.VisualObjects.Base2D;

   //........................................................................//
   // image object...........................................................//

   VBI.VisualObjects.Image = function() 
   {
      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );  

         // load bindable properties.........................................//
         this.m_Props.push( this.m_Image = new VBI.AttributeProperty( dat, 'image', null, ctx ) );
         this.m_Props.push( this.m_Tooltip = new VBI.AttributeProperty( dat, 'tooltip', null, ctx, "" ) );
      };

      // render with respect to data binding.................................//
      this.Render = function( canvas, dc, clusterData )
      {
         if( this.IsValid() )
            return;              // no update needed.........................//

         // get properties and apply them to the dom element.................//
         var ctx = this.m_Scene.m_Ctx;
         var l = this.m_Left.GetValueLong(ctx );
         var t = this.m_Top.GetValueLong( ctx );
         var r = this.m_Right.GetValueLong( ctx );
         var b = this.m_Bottom.GetValueLong( ctx );
         var align = this.m_Align.GetValueLong( ctx );
         var img = this.m_Image.GetValueString( ctx );
         var tt = this.m_Tooltip.GetValueString( ctx );

         var image;
         if( image = ctx.GetResources().GetImage( img ) )
         {
            this.m_DOMElement = VBI.Utilities.CreateImage( this.m_ID, image, l + this.m_paddingLeft, t + this.m_paddingTop, r + this.m_paddingLeft, b + this.m_paddingTop, tt, align );

            // append the child to the div......................................//
            this.m_Scene.m_Div.appendChild( this.m_DOMElement );
         }
      };
   };
   VBI.VisualObjects.Image.prototype = new VBI.VisualObjects.Base2D;


   //........................................................................//
   // button object..........................................................//

   VBI.VisualObjects.Button = function() 
   {
      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );  

         // load bindable properties.........................................//
         this.m_Props.push( this.m_Tooltip = new VBI.AttributeProperty( dat, 'tooltip', null, ctx, "" ) );
         this.m_Props.push( this.m_Text = new VBI.AttributeProperty( dat, 'text', null, ctx, "" ) );
      };

      this.clear = function()
      {
         // unsubscribe events...............................................//
         if( this.m_DOMElement )
            this.m_DOMElement.onclick = null;
         
         // call prototype of base class.....................................//
         Object.getPrototypeOf( this ).clear();  
      };
      
      // render with respect to data binding.................................//
      this.Render = function( canvas, dc, clusterData )
      {
         if( this.IsValid() )
            return;              // no update needed.........................//

         // get properties and apply them to the dom element.................//
         var ctx = this.m_Scene.m_Ctx;
         var l = this.m_Left.GetValueLong(ctx );
         var t = this.m_Top.GetValueLong( ctx );
         var r = this.m_Right.GetValueLong( ctx );
         var b = this.m_Bottom.GetValueLong( ctx );
         var txt = this.m_Text.GetValueString( ctx );
         var tt = this.m_Tooltip.GetValueString( ctx );

         this.m_DOMElement = VBI.Utilities.CreateButton( this.m_ID, txt, l + this.m_paddingLeft, t + this.m_paddingTop, r + this.m_paddingLeft, b + this.m_paddingTop, tt );

         // append the child to the div......................................//
         this.m_Scene.m_Div.appendChild( this.m_DOMElement );
         
         // subscribe to events..............................................//
         this.m_DOMElement.onclick = this.onclick.bind( this );
      };
      
      // event handler.......................................................//
      this.onclick = function( event )
      {
         // call base implementation for click events........................//
         return this.BaseClick( event );
      };
   };
   VBI.VisualObjects.Button.prototype = new VBI.VisualObjects.Base2D;

   //........................................................................//
   // detail window object...................................................//
   // todo: check if a detail window proxy makes sense
   
   VBI.VisualObjects.DetailWindowProxy = function()
   {
      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );

         // load bindable properties.........................................//
         this.m_Props.push( this.m_Pos = new VBI.AttributeProperty( dat, 'pos', this.m_DataSource, ctx ) );
      };
      
      this.DetailHitTest = function( ocb, nIndex, nsx, nsy )
      {
         return { m_hit: 1 };
      };

      this.GetHitArray = function( x, y )
      {
         // determine the array of instances that are hit....................//
         // x and y are the canvas relative coordinates......................//
         var zf = this.m_Scene.GetCurrentZoomFactors();

         // bounding boxes are defined always in non stretched canvas........//
         // coordinates, therefore transform them............................//
         var nsx = x / zf[0];
         var nsy = y / zf[1];

         var ocb = { m_cb: this.DetailHitTest.bind( this ), m_Ctx: this.m_Scene.m_Ctx  }; 

         // call base function for bounds check..............................//
         return this.BaseHitTest( nsx, nsy, ocb );
      };

      // render with respect to data binding.................................//
      this.Render = function( canvas, dc, clusterData )
      {
         var scene = this.m_Scene;
         // var lonlat = this.m_Pos.GetValueVector( ctx );

         // determine the location where to render the main instance.........//
         var xy = scene.GetPointFromPos( pos, true );
         this.IsPosChangeable( scene.m_Ctx ) && this.IsHandleMode() && ( this.m_DH[ nIndex ] = [ xy ] );

         // call base rendering method.......................................//
         this.BaseRender( canvas, dc );
      };

   };
   VBI.VisualObjects.DetailWindowProxy.prototype =  VBI.VisualObjects.Base;

   //........................................................................//
   // dummy object...........................................................//

   VBI.VisualObjects.Dummy = function() 
   {
      this.load = function( dat, ctx )
      {
         // call prototype...................................................//
         Object.getPrototypeOf(this).load( this, dat, ctx );  
      };

      // render the single instance..........................................//
      this.RenderInstance = function( nIndex, dc, xyz, scale, color )
      {
      };

      // render with respect to data binding.................................//
      this.Render = function( canvas, dc, clusterData )
      {
         // call base rendering method.......................................//
         this.BaseRender( canvas, dc );
      };

      // return this;      automatically returned
   };
   VBI.VisualObjects.Dummy.prototype =  VBI.VisualObjects.Base;

   // return the visual object...............................................//
   return visualobjects;

}; 
