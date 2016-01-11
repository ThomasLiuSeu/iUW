//...........................................................................//
// this module defines the clustering     ...................................//

// Author: Jürgen Gatter for Grid based Clustering, 
//		   Dimitar Vangelovski for Distance based Clustering 

VBI.Clustering = function( target )
{
   var clustering = {};
   var Delaunay = {};
   var EPSILON = 1.0 / 1048576.0;
   
   clustering.m_Clusters = []; // array of clusters
   clustering.m_Clustergroups = [];
   clustering.m_loadCount = 0; // to verify whether preassembled data is still valid
   clustering.m_Parser = VBI.Parser();
   
   clustering.clear = function()
   {
	   clustering.m_Clusters = []; // array of clusters   
   };
   
   clustering.load = function( dat, ctx )
   {
      // load the json delta data............................................//
      if( dat.Set )
      {
    	   clustering.clear();
    	   clustering.m_Parser.clear();
    	   clustering.m_loadCount++;

         var res = dat.Set.Cluster;
         
         clustering.m_cellColor = dat.Set.cellColor;
         clustering.m_bDelaunay = ( dat.Set.delaunay != undefined );
         clustering.m_bShowGrid = ( clustering.m_cellColor != undefined );
         
         if( jQuery.type( res ) == 'object' )
         {
             var cluster = new VBI.Clustering.Cluster();
             cluster.load( res, ctx, clustering.m_Clusters.length );   // load the cluster...//
             clustering.m_Clusters.push( cluster );
             clustering.UpdateAutomaticClusterGroup( cluster.m_groupID );
         }  else
         if( jQuery.type( res ) == 'array' )
         {
            var index = clustering.m_Clusters.length;
            // load from array...............................................//
            for( var nJ = 0, len = res.length; nJ < len; ++nJ )
            {
                var cluster = new VBI.Clustering.Cluster();
                cluster.load( res[nJ], ctx, index++ );   // load the cluster...//
                clustering.m_Clusters.push( cluster );
                clustering.UpdateAutomaticClusterGroup( cluster.m_groupID );
            } 
         }
         for ( var nJ = 0, len = clustering.m_Clustergroups.length; nJ < len; ++nJ )
            clustering.m_Clusters.push( clustering.m_Clustergroups.shift() );
      }
   };
   
   clustering.InvalidatePreassembledData = function ( scene, newLod )
   {
      if (!scene.m_PreassembledData)
         return;
      var preData = scene.m_PreassembledData;
      var noDistanceClusters = preData.m_ClusterColumns['distance'].length;
      var noTreeClusters = preData.m_ClusterColumns['tree'].length;
      if ((noDistanceClusters == 0) || (noTreeClusters == 0) || ( preData.m_lod != newLod ) || ( preData.m_version != clustering.m_loadCount))
         scene.m_PreassembledData = undefined;
      else
         preData.bGridDataInvalidated = true;
   };
   
   
   clustering.UpdateAutomaticClusterGroup = function ( groupID )
   {
      if (groupID=="") return;

      var insertedCluster = clustering.m_Clusters[clustering.m_Clusters.length-1];
      var nGroupIndex, nOtherIndex;

      for( var nJ = 0, len = clustering.m_Clustergroups.length; nJ < len; ++nJ ){
         var elte = clustering.m_Clustergroups[nJ];
         if ( elte.m_id == groupID)
            nGroupIndex = nJ;
      }
      
      if ( nGroupIndex != undefined)
      {
         var groupCluster = clustering.m_Clustergroups[nGroupIndex];
         groupCluster.m_limit = Math.min( insertedCluster.m_limitOnSum, groupCluster.m_limit );
         insertedCluster.m_bPartOfGrp = true;
      } else
      {
         for( var nJ = 0, len = clustering.m_Clusters.length-1; nJ < len; ++nJ ){
            var elte = clustering.m_Clusters[nJ];
            if ( ( elte.m_type == "grid" ) && ( elte.m_groupID == groupID) )
               nOtherIndex = nJ;
         }
         if (nOtherIndex != undefined) 
         {
            var otherCluster =  clustering.m_Clusters[nOtherIndex];
            var groupCluster = new VBI.Clustering.Cluster();
            groupCluster.m_type = "clustergroup";
            groupCluster.m_id = groupID; 
            groupCluster.m_dividerX = otherCluster.m_dividerX;
            groupCluster.m_dividerY = otherCluster.m_dividerY;
            groupCluster.m_limit = Math.min( insertedCluster.m_limitOnSum, otherCluster.m_limitOnSum );
            groupCluster.initializeFunctions();
            clustering.m_Clustergroups.push(groupCluster);
            insertedCluster.m_bPartOfGrp = otherCluster.m_bPartOfGrp = true;
         }
      }
      
   };
   
   clustering.PreassembleDataForVO = function(scene, vResult, index, vo, ctx )
   {
	   
	  if( node = vo.m_DataSource.GetCurrentNode( ctx ) )
     { 
		  var mID = vo.m_ID;
        for ( nL = 0 ; nL < node.m_dataelements.length; ++nL )
    	  {
            vo.m_DataSource.Select( nL );
            var orgPos = vo.m_Pos.GetValueVector( ctx ); 
            var ucsPos = scene.GetPointFromPos( orgPos, true );
            // position is adjusted to current canvas, so we have to check against [0..completex/y]
            var nCl = clustering.m_Parser.evaluate(vo, index, ctx);
            var bIsDistClust = (nCl >= 0) && (clustering.m_Clusters[nCl].m_type=="distance");
            var bIsTreeClust = (nCl >= 0) && (clustering.m_Clusters[nCl].m_type=="tree");
   				  
            if ( ucsPos.m_bVisible || bIsDistClust || bIsTreeClust ) {
            // if ( (ucsPos[0] >= 0) && (ucsPos[1] >= 0) && (ucsPos[0] < completeX) && (ucsPos[1] < completeY) ){
               ucsPos.orgPos = orgPos;
               ucsPos.h = vo.BaseIsHot( nL, ctx );
         	   ucsPos.hscale = vo.GetHotScale( ctx );
            	ucsPos.hcol = vo.m_HotDeltaColor.GetValueString( ctx );

               if (ucsPos.s = vo.IsSelected( ctx )){
             	   ucsPos.scol = vo.m_SelectColor.GetValueString( ctx );
             	   ucsPos.simag = vo.m_ImageSelected.GetValueString( ctx );     
               }
               if (ucsPos.im == undefined)
                  ucsPos.im = vo.m_Image.GetValueString( ctx );
               
              ucsPos.tx = vo.m_Text.GetValueString( ctx );
              ucsPos.sc = vo.m_Scale.GetValueVector( ctx );

              ucsPos.m_ID = mID;
              ucsPos.nI = nL;
              ucsPos.b2Ignore = false;
              ucsPos.cl = nCl;
              if ( bIsDistClust ) vResult[ index ].containsDistClust = true;
              else if ( bIsTreeClust ) vResult[ index ].containsTreeClust = true;
              else vResult[ index ].containsGridClust  = true; 

              vResult[ index ].push( ucsPos );
			   }
    	  }
      }
   };   
   
   clustering.InitializeResultVector = function( oldResultData, numVOs, lod )
   {
      var ResultData;
      if ( true ) // this version does not support reusage of mixed content 
      // if ((oldResultData == undefined) || (oldResultData.m_version != clustering.m_loadCount))
      {
         ResultData = [];

         for ( var i = 0; i < numVOs; ++ i){
            var elem = [];
            ResultData.push( elem );
         }
         ResultData.bShowGrid = clustering.m_bShowGrid;
         ResultData.m_version = clustering.m_loadCount;
         ResultData.m_lod     = lod;
         ResultData.m_SelectedVOs = [];
         ResultData.m_ClusterColumns = [];
         ResultData.m_ClusterColumns['grid'] = [];
         ResultData.m_ClusterColumns['distance'] = [];
         ResultData.m_ClusterColumns['tree'] = [];
      }

	   return ResultData;
   };
   
   clustering.CheckNonClusteredVOs = function( ResultData, ClusterData )
   {
	   for ( var nI = 0; nI < ResultData.length; ++nI )
	   {
		   var vos = ResultData[nI];
		   var cnt = 0;
		   
		   for ( nJ = 0, vl = vos.length; nJ < vl; ++nJ)
		   {
               var elem = vos[nJ];
               if ( elem.isCl != true){
                   if ((elem.cl != undefined) && ( elem.sq != undefined ) && (ClusterData[elem.cl])[elem.sq].b2Cluster)
                	   elem.b2Ignore = true;
                   if (!elem.b2Ignore){
                	   elem.bbInd = cnt;
                	   if ( elem.h )
                		   ResultData.HotItemBBIndex = cnt;
                	   if ( elem.s )
                		   ResultData.m_SelectedVOs.push( { m_vo: nI, m_index : nJ, m_dataIndex : nL, m_BBIndex : cnt } );

                	   cnt++;
                   }
               }
		   }
		   vos.m_NumVisVOs = cnt;
	   }	   
   };
   
   clustering.FetchClusterVOData = function( resultdata, vos, ctx )
   {
	   var clust = clustering.m_Clusters;
	   var cl = clust.length;

	   var result = [];
	   for (var j = 0; j < cl; ++j )
		   result.push({});

	   var nl = vos.length;
	   for (var i = 0; i < nl; ++i )
		   for (var j = 0; j < cl; ++j )
		       if ( vos[i].m_ID == clust[j].m_VO ){
		    	   result[j].m_index = i;
		    	   result[j].m_image = vos[i].m_Image.GetValueString( ctx );
		    	   result[j].m_scale = vos[i].m_Scale.GetValueVector( ctx );
		    	   result[j].m_hotscale = vos[i].m_HotScale.GetValueVector( ctx );
		    	   result[j].m_hotcol   = vos[i].m_HotDeltaColor.GetValueString( ctx );
		    	   resultdata.m_ClusterColumns[clust[j].m_type].push(i);
		    	   if ( clust[j].m_type == 'grid' )  result[j].m_isGridType = resultdata[i].containsGridClust = true;
		    	   if ( clust[j].m_type == 'distance' )  result[j].m_isDistType = resultdata[i].containsDistClust = true;
		    	   if ( clust[j].m_type == 'tree' )  result[j].m_isDistType = resultdata[i].containsTreeClust = true;
		       }
	   return result;
   };
   
   clustering.FetchClusterGroupData = function( )
   {
	   var clust = clustering.m_Clusters;
	   var cl = clust.length;
	   var result = [];
	   for (var i = 0; i < cl; ++i ){
		   var sources = [];
		   if (clust[i].m_type=="clustergroup")
   		   for (var j = 0; j < cl; ++j )
   			   if (( i != j ) && ( clust[i].m_id == clust[j].m_groupID) )
                  sources.push({index:j,limit:clust[j].m_limit});
		   result.push(sources);
	   }
	   return result;
   };
   
   
   clustering.RecalculatePositions = function( scene, resultData )
   {
      for ( i=0; i<resultData.length; ++i )
      {
         var resultVO = resultData[i];
         for (j=0; j < resultVO.length; ++j )
         {
             var myInst = resultVO[j];
             var ucsPos = scene.GetPointFromPos( myInst.orgPos, true );
             myInst[0] = ucsPos[0];
             myInst[1] = ucsPos[1];
         }
      }
      return resultData; 
   };
   
   clustering.DoClustering = function( scene, lod, xPos, yPos, nX, nY, vos, ctx, lastHotCluster )
   { 
      
     var oldPreData = scene.m_PreassembledData;
     if (oldPreData && (oldPreData.m_version == clustering.m_loadCount) && (oldPreData.m_ClusterColumns['grid'].length==0))
        return clustering.RecalculatePositions(scene, oldPreData);   // only distance based clustering --> can be reused

     var nJ;
	  var ResultData       = clustering.InitializeResultVector(oldPreData, vos.length, lod);
	  var clusterVOData    = clustering.FetchClusterVOData( ResultData, vos, ctx );
	  var groupConnections = clustering.FetchClusterGroupData();
	  clustering.m_Parser.verifyAttributes(vos, ctx);

	  for ( nJ=0; nJ < vos.length; ++nJ )
	  {
		  var vo = vos[nJ];
		  if (vo.IsClusterable())
			 clustering.PreassembleDataForVO(scene, ResultData, nJ, vo, ctx ); 
	  }
	  
	  var ClusterData = clustering.InitializeClusterData( scene, lod, nX, nY );
	  
	  for ( nJ=0; nJ < clustering.m_Clusters.length; ++nJ )
		   clustering.m_Clusters[nJ].ClusterPass1(nJ, ResultData, ClusterData);
	  for ( nJ=0; nJ < clustering.m_Clusters.length; ++nJ )
		   clustering.m_Clusters[nJ].ClusterPass2(nJ, ResultData, ClusterData, groupConnections);
	   
      var baseCluster = (ClusterData.gridBase == undefined) ? undefined : ClusterData[ClusterData.gridBase];
	  for ( nJ=0; nJ < clustering.m_Clusters.length; ++nJ )
		  clustering.m_Clusters[nJ].DecisionPass( scene, nJ, ResultData, ClusterData, baseCluster, clusterVOData, groupConnections );

	  clustering.CheckNonClusteredVOs( ResultData, ClusterData );
	  
	  return ResultData;
   };   

   clustering.InitializeClusterData = function( scene, lod, nX, nY )
   {
	   var ClusterData = [];

	   var numTiles = ( 1 << lod );
	   // normalize complete dimension on current LOD.........................//
	   ClusterData.numTiles = numTiles;
	   ClusterData.completeX = numTiles * scene.m_nWidthCanvas / scene.m_nTilesX;
	   ClusterData.completeY = numTiles * scene.m_nHeightCanvas / scene.m_nTilesY;	   

	   
	   var bShowGrid = clustering.m_bShowGrid;
	   for ( nJ=0; nJ < clustering.m_Clusters.length; ++nJ ){
		   var bShowGridBase = false;
		   var clust = clustering.m_Clusters[nJ];
         var nGridcellsX = (nX+2) * clust.m_dividerX;
         var nGridcellsY = (nY+2) * clust.m_dividerY;
		   if (bShowGrid && ( clust.m_type=="grid" || clust.m_type=="clustergroup"))
		   {
			   bShowGrid = false;
			   bShowGridBase = true;
			   ClusterData.gridBase = nJ;
			   ClusterData.bGridClustering = true;
		   }
		   ClusterData.push( clust.InitializeClusterData( scene, nGridcellsX, nGridcellsY, bShowGridBase) );
	   }
	   return ClusterData;
   };
  
   clustering.UpdatePreData4Selected = function( voIndex, instIndex, ResultData, vos, ctx )
   {
       var vo, bSelected;
	   
	   // check first element of old Selected which is not the new index
	   // if this is valid all others are valid too
	   
	   if ( ResultData.m_SelectedVOs.length){
		   var selElte = ResultData.m_SelectedVOs[0];
		   while ( ( ResultData.m_SelectedVOs.length) && ( selElte.m_index == instIndex ) && ( selElte.m_vo == voIndex)){
			   ResultData.m_SelectedVOs.shift(); // we delete this element as we encounter it later anyway.
			   selElte = ResultData.m_SelectedVOs[0];
		   }                                     // we ignore the case that element comes later, it may be twice in the list then
		   if ( ResultData.m_SelectedVOs.length )
		   {                                     // first element is now definitely unequal to the new one
			   vo = vos[selElte.m_vo];
			   vo.m_DataSource.Select( selElte.m_dataIndex );
			   if (!vo.IsSelected( ctx )){       // this element unselected --> other elements of the list also
				   for (var i=0, len=ResultData.m_SelectedVOs.length; i < len;++i){
					   selElte = ResultData.m_SelectedVOs[0];
					   (ResultData[selElte.m_vo])[selElte.m_index].s = false;
					   ResultData.m_SelectedVOs.shift();
				   }
			   }
		   }
	   }

	   var elte = (ResultData[voIndex])[instIndex]; 
	   vo = vos[voIndex];
	   vo.m_DataSource.Select( elte.nI );
	   if ((bSelected=vo.IsSelected( ctx ))){
   	      ResultData.m_SelectedVOs.unshift({m_vo: voIndex, m_index : instIndex, m_dataIndex : elte.nI, m_BBIndex : elte.bbInd});
   	      elte.scol  = vo.m_SelectColor.GetValueString( ctx );
   	      elte.simag = vo.m_ImageSelected.GetValueString( ctx );     
	   }
	   elte.s = bSelected;
	   
   };
   
   VBI.Clustering.Cluster = function()
   {
      var cluster = {};

      // additional properties array.........................................//
      cluster.m_additionalProperties = [];    

      cluster.clear = function()
      {
         cluster.m_addProperties = null;
      };


      cluster.load = function( dat, ctx, index )
      {
         cluster.m_id              = dat.id;
         cluster.m_type            = dat.type;
         cluster.m_type2           = dat.type2;
         cluster.m_switch          = parseInt(dat.typeswitch);
         cluster.m_bPartOfGrp      = false;
         cluster.m_VO              = dat.VO;
         cluster.m_order           = parseInt(dat.order);
         cluster.m_dispOffsetX     = parseInt(dat.offsetX);
         if (isNaN(cluster.m_dispOffsetX)) cluster.m_dispOffsetX = 0;
         cluster.m_dispOffsetY     = parseInt(dat.offsetY);
         if (isNaN(cluster.m_dispOffsetY)) cluster.m_dispOffsetY = 0;
         clustering.m_Parser.addFormula( index, dat.rule == undefined ? "" : dat.rule );
         cluster.m_textcolor       = dat.textcolor;
         if (cluster.m_textcolor == undefined) cluster.m_textcolor ="rgba(0,0,0,0.7)";
         cluster.m_textfont        = dat.textfont;
         cluster.m_textfontscale   = dat.textfontscale;
         if (isNaN(cluster.m_textfontscale)) cluster.m_textfontscale = 2.0;             
         cluster.m_textoffset      = parseInt(dat.textoffset);
         if (isNaN(cluster.m_textoffset)) cluster.m_textoffset=0;

         if (cluster.m_type == "grid"){
            cluster.m_distanceX      = (( dat.distanceX == undefined ) || ( dat.distanceX <= 0 ) ) ? 256 : dat.distanceX;
            cluster.m_dividerX       = Math.max( 1, Math.round( 256 / cluster.m_distanceX ));
            cluster.m_distanceY      = (( dat.distanceY == undefined ) || ( dat.distanceY <= 0 ) ) ? 256 : dat.distanceY;
            cluster.m_dividerY       = Math.max( 1, Math.round( 256 / cluster.m_distanceY ));
            cluster.m_groupID      = ( dat.groupID == undefined ? "&" : dat.groupID )+cluster.m_dividerX+"_"+cluster.m_dividerY;
            cluster.m_omitEmpties     = ( dat.showEmpties != "true" );
         } 
         if (cluster.m_type == "distance"){
            cluster.m_distance      = dat.distance;
            if (cluster.m_distance == undefined || cluster.m_distance <= 0) cluster.m_distance = 128; // default distance if undefined
         }
         if (cluster.m_type == "tree"){
             cluster.m_distance      = dat.distance;
             if (cluster.m_distance == undefined || cluster.m_distance <= 0) cluster.m_distance = 128; // default distance if undefined
          }
             
         cluster.m_limit               = parseInt(dat.limit);
         cluster.m_limitOnSum          = dat.limitOnSum == undefined ? 999999 : parseInt(dat.limitOnSum);
         
         cluster.initializeFunctions();
      };
      
      cluster.initializeFunctions = function()
      {
         switch ( cluster.m_type ){
         case "grid":     
                          cluster.InitializeClusterData  = cluster.InitializeGridClusterData;
                          cluster.ClusterPass1           = cluster.gridClusteringCounting;
                          cluster.ClusterPass2           = cluster.NothingToDo; 
                          cluster.DecisionPass           = cluster.gridBasedDecision;
                          cluster.CheckClusterData       = cluster.CheckSingleClusterData;
                          break;
         case "clustergroup" : 
                          cluster.InitializeClusterData  = cluster.InitializeGridClusterData;
                          cluster.ClusterPass1           = cluster.NothingToDo;
                          cluster.ClusterPass2           = cluster.gridClustergroupCounting;
                          cluster.DecisionPass           = cluster.gridBasedDecision;
                          cluster.CheckClusterData       = cluster.CheckGroupClusterData;
                          break;
         case "distance": 
                          cluster.InitializeClusterData  = cluster.InitializeDistClusterData;
                          cluster.ClusterPass1           = cluster.NothingToDo;
                          cluster.ClusterPass2           = cluster.NothingToDo;
                          cluster.DecisionPass           = cluster.distanceBasedDecision;
                          cluster.CheckClusterData       = cluster.NothingToDo; // not applicable
                          break;
         case "tree": 
  			             cluster.InitializeClusterData  = cluster.InitializeTreeClusterData;
			             cluster.ClusterPass1           = cluster.NothingToDo;
			             cluster.ClusterPass2           = cluster.NothingToDo;
			             cluster.DecisionPass           = cluster.treeBasedDecision;
			             cluster.CheckClusterData       = cluster.NothingToDo; // not applicable
			             break;
         }
      };

      cluster.gridClusteringCounting = function( nI, ResultData, ClusterData )
      {
        var myGrid = ClusterData[nI];
    	  var xSize = myGrid.nX;
    	  var ySize = myGrid.nY;
    	  var nGridPosSize = xSize * ySize;
    	  var xMult = cluster.m_dividerX * ClusterData.numTiles / ClusterData.completeX;
    	  var yMult = cluster.m_dividerY * ClusterData.numTiles / ClusterData.completeX;
    	  
    	  var xGridPos,yGridPos,nPos;    	  
    	  var cell, myVO, elem;
    	 
    	  for ( var nK = 0; nK < ResultData.length; ++nK)
		  {
    		  myVO = ResultData[nK];
    		  for (nJ = 0; nJ < myVO.length; ++nJ )
    	      {
    			  elem = myVO[nJ];
    			  if ( elem.cl == nI ){
    				  xGridPos = Math.floor((elem[0] ) * xMult);
    				  yGridPos = Math.floor((elem[1] ) * yMult);
    				  nPos = xGridPos + xSize * yGridPos;
    				  if ( ( nPos >= 0 ) && (nPos < nGridPosSize) )
					  {
					     elem.sq = nPos;
					     myGrid[nPos].numInst++;
					  }
    			  }
    	      }
		  }
      };
      
      cluster.gridClustergroupCounting = function(nI, ResultData, ClusterData, groupConnections)
      {
    	  var cell, elem;
    	  var myConnects = groupConnections[nI];
    	  var connects = myConnects.length;
    	  var myGrid = ClusterData[nI];
    	  
		  for ( nK=0; nK < myGrid.length; ++nK )
		  {
			  var cnt = 0;
		     cell = myGrid[nK];
		     cell.bLimitExceeded = false;
		      
		     for ( nL = 0; nL < connects; ++nL )
	    	  {
		        var inst = myConnects[nL].index;
	    	     var cGrid = ClusterData[inst];
	    	     var newVal = cGrid[nK].numInst;
              cnt += newVal;
              if ( newVal >= myConnects[nL].limit ) 
    	    	     cell.bLimitExceeded = true;
	    	  }
			  cell.numInst = cnt;
		  }
      };
      
      cluster.distanceBasedDecision = function( scene, nJ, ResultData, ClusterData, baseCluster, clusterVOData, groupConnections )
      {
    	  var clust = clustering.m_Clusters[nJ];
    	  distance = clust.m_distance;
    	  var distClusters = cluster.doDistClustering( nJ, ResultData, distance, ClusterData.completeX );
		  cluster.distFillClusterData( scene, distClusters, ResultData, clusterVOData[nJ] );
      };

      cluster.treeBasedDecision = function( scene, nJ, ResultData, ClusterData, baseCluster, clusterVOData, groupConnections )
      {
    	  var clust = clustering.m_Clusters[nJ];
    	  distance = clust.m_distance;
    	  var treeClusters = cluster.doTreeClustering( nJ, ResultData, distance, ClusterData.completeX );
		  cluster.treeFillClusterData( scene, treeClusters, ResultData, clusterVOData[nJ] );
      };

      cluster.gridBasedDecision = function( scene, nK, ResultData, ClusterData, baseCluster, clusterVOData, groupConnections )
      {
   	   var clust = clustering.m_Clusters[nK];
   	   if ( !clust.m_bPartOfGrp ){	
   		   clustsq = ClusterData[nK];
   		   for ( var x = 0; x < clustsq.nX; ++x){
   			   for ( var y = 0; y < clustsq.nY; ++y ){
   				   nJ = x + clustsq.nX * y;
   				   var bShowGrid = ( baseCluster != undefined ) ? baseCluster[nJ].bShowGrid : false;
   				   bShowGrid  = clust.CheckClusterData(ResultData, ClusterData, clustsq[nJ], nK, nJ, x, y, clusterVOData, groupConnections[nK], bShowGrid);
   				   if (baseCluster) 
   					   baseCluster[nJ].bShowGrid = bShowGrid;
   		       }
   		   }
      	   }
      };

      cluster.NothingToDo = function()
      {
    	  
      };
      
      cluster.ReturnFalse = function()
      {
    	 return false; 
      };      
      
      cluster.CheckSingleClusterData = function(ResultData, ClusterData, cellclust, nK, nJ, x, y , voData, connections, bShowGridCells)
      {
    	  if ( cellclust.numInst >= cluster.m_limit ){
    		 var target = ClusterData[nK];
    		 clustering.m_Clusters[nK].FillClusterData(ResultData,target[nJ], x, y,  ClusterData[nK].XPerTile, ClusterData[nK].YPerTile, voData[nK],bShowGridCells);
    		 return false;
    	  }
 	      cellclust.b2Cluster = false;

 	      return bShowGridCells;
      };
      
      cluster.CheckGroupClusterData = function(ResultData, ClusterData, cellclust, nK, nJ, x, y,  voData, connections, bShowGridCells)
      {
    	  if ( cellclust.bLimitExceeded || ( cellclust.numInst >= cluster.m_limit ) ){
    		  for (var i = 0; i < connections.length; ++i){
    			  var tg = connections[i].index;
    			  var target = ClusterData[tg];
    			  bShowGridCells = clustering.m_Clusters[tg].FillClusterData(ResultData,target[nJ], x, y, ClusterData[nK].XPerTile, ClusterData[nK].YPerTile, voData[tg],bShowGridCells);
    		  }
  	      } else {
              cellclust.b2Cluster = false; 	    	  
    		  for (var i = 0; i < connections.length; ++i){
    			  var target = ClusterData[ connections[i].index ] ;
    			  target[nJ].b2Cluster = false;
    		  }
  	      }

    	  return bShowGridCells;
      };   
      
      cluster.InitializeGrid = function( myTarget, nX, nY, numClusters)
      {
    	  myTarget = [];
    	  
		  for ( var x = 0; x < nX; ++ x)
			   for ( var y = 0; y < nY; ++ y )
			   {
				   var elem = [];
				   if (bShowGrid)
				      elem.bShowGrid = true;
				   myGrid.push(elem);
			   }
      };      
      
      cluster.InitializeGridClusterData = function( scene, nX, nY, bShowGrid )
      {
    	  var myGrid = [];

    	  myGrid.nX = nX;
    	  myGrid.nY = nY;
        myGrid.XPerTile = scene.m_nWidthCanvas  / ( scene.m_nTilesX * cluster.m_dividerX );
        myGrid.YPerTile = scene.m_nHeightCanvas / ( scene.m_nTilesY * cluster.m_dividerY );
    	  
		  for ( var x = 0; x < nX; ++ x)
			   for ( var y = 0; y < nY; ++ y )
			   {
				   var elem = {};
				   elem.numInst = 0;
				   if (bShowGrid)
				      elem.bShowGrid = true;
				   myGrid.push(elem);
			   }
		  
		  return myGrid;
      };          

      cluster.InitializeDistClusterData = function( scene, nX, nY, bShowGrid )
      {
    	  var elem = {};
    	  elem.numInst = 0;
    	  elem.type = cluster.m_type;
		  
		  return elem;
      };          

      cluster.InitializeTreeClusterData = function( scene, nX, nY, bShowGrid )
      {
    	  var elem = {};
    	  elem.numInst = 0;
    	  elem.type = cluster.m_type;
		  
		  return elem;
      };          
      
      cluster.FillClusterData = function(ResultData, cellclust, x, y, xPerTile, yPerTile , voData, bShowGrid)
      {   // Fills data and returns BOOL whether grid has yet to be displayed 
    	  if (cluster.m_omitEmpties && !cellclust.numInst) {
    		  cellclust.b2Cluster = false;
    		  return bShowGrid;
    	  }
	  	  cellclust.b2Cluster = true;
	   	  var yMin = y * yPerTile;
	   	  var yMax = yMin + yPerTile;
	   	  var xMin = x * xPerTile;
	   	  var xMax = xMin + xPerTile;
	   	  var halfXSize = xPerTile / 2;
	   	  var halfYSize = yPerTile / 2;
	   	  var elem = [ xMin + halfXSize + cluster.m_dispOffsetX, yMin + halfYSize  + cluster.m_dispOffsetY,0,0];
	   	  elem.h = elem.s = false;
	   	  elem.im = voData.m_image;
	   	  elem.sc = voData.m_scale;
	   	  elem.hscale = voData.m_hotscale;
	   	  elem.hcol   = voData.m_hotcol;
	   	  if (cluster.m_textfont != undefined){
		   	  elem.ct = "" + cellclust.numInst;
		   	  elem.f = cluster.m_textfont;
		   	  elem.fc = cluster.m_textcolor;
		   	  elem.fs = cluster.m_textfontscale;
		   	  elem.fo = cluster.m_textoffset;
	   	  }
    	  if (bShowGrid){
	   		  elem.centX = xMin + halfXSize;
	   		  elem.centY = yMin + halfYSize;
	   		  elem.halfxSize = halfXSize;
	   		  elem.halfySize = halfYSize;
    		  elem.cellColor = clustering.m_cellColor;
    	  }
		  elem.isCl = true;
		  elem.nI = -1;
	   	  ResultData[voData.m_index].push( elem );
	   	  
	   	  return false;
      };
      
      cluster.doDistClustering = function(nK, ResultData, distThreshold, completeX)
      {
    	  var aTemp = [];
    	  var eElem = {}; 
    	  
    	  // check which objects belong to nK cluster and create a temp list
    	  for ( var i = 0; i < ResultData.length; ++i )
    	  {
    		  eElem = ResultData[i];
    		  
        	  for ( var j = 0; j < eElem.length; ++j )
        	  {
        		  if (eElem[j].cl == nK)
        			  aTemp.push(eElem[j]);
        	  }
    	  }
    	  
    	  var adTemp = new Array(aTemp.length);
    	  var a, ax, b;

    	  for ( var i = 0; i < aTemp.length; ++i )
    	  {
    		  a = aTemp[i];
    		  adTemp[i] = [ a[0], a[1] ];
    	  }
    	  
    	  var triangles = [];
    	  if (clustering.m_bDelaunay)
    	  {
    		  triangles = Delaunay.triangulate(adTemp);
    		  triangles.sort(function(a,b) { 
    			  var diff = a.l - b.l; 
    			  if (diff) return diff;
    			  diff = a.s - b.s;
    			  return diff ? diff : a.d - b.d ;
    			  });
    	  }
    	  
    	  
    	  //aTemp = ResultData[nK].slice(0);				// clone the original objects array
    	  aTemp.sort(function (a, b) { return a[0]-b[0] }); // sort the objects on x coordinate

    	  // find the first gap between clusters from the left side
    	  var nn = aTemp.length - 1;
    	  var iGap = 0;
    	  
    	  for ( var i = 0; i < nn; ++i )
		  {
    		  a = aTemp[i];
    		  b = aTemp[i+1];
    		  ax = b[0] - a[0];
    		  
    		  if ( ax > distThreshold ) 
    		  {
    			  iGap = i+1;
    			  break;
    		  }
		  }
    	  
    	  
    	  // ---------------------------------------------------------------------
    	  // distance clustering part 
    	  
    	  var aGroups = [];
    	  var minY, maxY, xa, xb, im, jm;
    	  var nLn = aTemp.length + iGap;
    	  var nAll = aTemp.length;
    	  
    	  for (var i = iGap; i < nLn; ++i)
		  {
    		  im = i % nAll;
    		  
			  var a = aTemp[im];
			  if (a.isGrouped)
				  continue;
			  
			  xa = a[0];
			  if (i > nAll - 1) 
				  xa += completeX;
			  
        	  for (var j = i + 1; j < nLn; ++j)
    		  {
        		  jm = j % nAll;
        		  
    			  var b = aTemp[jm];
        		  if (b.isGrouped)
        			  continue;
    			  
        		  xb = b[0];
    			  if (j > nAll - 1)
    				  xb += completeX;
        		  
    			  if ( xb - xa <= distThreshold )
    			  {
    				  if (aGroups.length <= 0)
    				  {
    					  minY = a[1];
    					  maxY = a[1];
    				  }
    				  else
    				  {
    					  if (a.isGrouped)
    					  {
    						  minY = aGroups[a.nGrp].minY;
    						  maxY = aGroups[a.nGrp].maxY;
    					  }
    					  else
    					  {
    						  minY = a[1];
    						  maxY = a[1];
    					  }
    				  }
    				  
    				  if ( Math.abs(b[1] - minY) <= distThreshold && 
    					   Math.abs(b[1] - maxY) <= distThreshold )
    				  {

    					  if (a.isGrouped)
    					  {
							  aGroups[a.nGrp].push(b);
							  
					    	  b.isGrouped = true;
					    	  b.nGrp = a.nGrp;
				    		  b.b2Ignore = true;
				    		  
				    		  if (b.objRef != undefined)
				    			  b.objRef.b2Ignore = true;
	
					    	  // update y borders
					    	  if ( b[1] < aGroups[a.nGrp].minY ) 
								  aGroups[a.nGrp].minY = b[1];
							  if ( b[1] > aGroups[a.nGrp].maxY ) 
								  aGroups[a.nGrp].maxY = b[1];
	
					    	  // update x borders
							  if ( xb < aGroups[a.nGrp].minX ) 
								  aGroups[a.nGrp].minX = xb;
							  if ( xb > aGroups[a.nGrp].maxX ) 
								  aGroups[a.nGrp].maxX = xb;
							  
				    		  // add the X and Y coordinates for gravity center calc
							  if (aGroups[a.nGrp].sumX == undefined) 
								  aGroups[a.nGrp].sumX = xb;
							  else
								  aGroups[a.nGrp].sumX += xb;
	
							  if (aGroups[a.nGrp].sumY == undefined) 
								  aGroups[a.nGrp].sumY = b[1];
							  else
        						  aGroups[a.nGrp].sumY += b[1];
    					  }
    					  else
    					  {
    						  var aGr = [];
    						  aGr.push(a);
    						  aGr.push(b);
    				    	  aGroups.push(aGr);

    				    	  var lg = aGroups.length - 1;
    				    	  a.isGrouped = true;
    				    	  a.nGrp = lg;
    			    		  a.b2Ignore = true;
    				    	  b.isGrouped = true;
    				    	  b.nGrp = lg;
    			    		  b.b2Ignore = true;
    			    		  
				    		  if (a.objRef != undefined)
				    			  a.objRef.b2Ignore = true;
				    		  if (b.objRef != undefined)
				    			  b.objRef.b2Ignore = true;
    			    		  
    						  // update y borders
    						  if ( a[1] < b[1] )
    						  {
    							  aGroups[lg].minY = a[1];
    							  aGroups[lg].maxY = b[1];
    						  }
    						  else
    						  {
    							  aGroups[lg].minY = b[1];
    							  aGroups[lg].maxY = a[1];
    						  }

    						  // update x borders
    						  if ( xa < xb )
    						  {
    							  aGroups[lg].minX = xa;
    							  aGroups[lg].maxX = xb;
    						  }
    						  else
    						  {
    							  aGroups[lg].minX = xb;
    							  aGroups[lg].maxX = xa;
    						  }
    						  
    			    		  // add the X and Y coordinates for gravity center calc
    			    		  if (aGroups[lg].sumX == undefined) 
    							  aGroups[lg].sumX = xa + xb;
    						  else
    							  aGroups[lg].sumX += xa + xb;

    						  if (aGroups[lg].sumY == undefined) 
    							  aGroups[lg].sumY = a[1] + b[1];
    						  else
    							  aGroups[lg].sumY += a[1] + b[1];
    					  }
    				  }
    			  }
    			  else break;
    		  }
			  
		  }
    	  
    	  return aGroups;
      }
      
      cluster.distFillClusterData = function( scene, distClusters, ResultData, voData )
      { 
           var LODStretch = scene.m_Canvas[0].m_nExactLOD - scene.m_Canvas[0].m_nCurrentLOD;
           var stretch = Math.pow(2,LODStretch);
       	  for (var i = 0; i < distClusters.length; ++i)
       	  {
       		  var ll = distClusters[i].length;
       		  var xc = distClusters[i].sumX / ll + cluster.m_dispOffsetX;
   		  	  var yc = distClusters[i].sumY / ll + cluster.m_dispOffsetY;
       		  var elem = [ xc, yc, 0, 0 ];
       		  elem.orgPos = scene.GetPosFromPoint( [ xc * stretch, yc * stretch] );
    	   	  elem.h = false; 
    	   	  elem.hscale = voData.m_hotscale;
    	   	  elem.hcol   = voData.m_hotcol;    	   	  
    	   	  elem.s = false;
    	   	  elem.im = voData.m_image;
    	   	  elem.sc = voData.m_scale;
    	   	  if (cluster.m_textfont != undefined)
    	   	  {
    		   	  elem.ct = "" + ll;
    		   	  elem.f = cluster.m_textfont;
    		   	  elem.fc = cluster.m_textcolor;
    		   	  elem.fs = cluster.m_textfontscale;
    		   	  elem.fo = cluster.m_textoffset;
    	   	  }
    	   	  elem.cobjs = distClusters[i];
    		  elem.isCl = true;
    	   	  ResultData[voData.m_index].push( elem );
       	  }
       	  
	   	  return true;
      };
      
      cluster.doTreeClustering = function(nK, ResultData, distThreshold, completeX)
      {
    	  var aTemp = [];
    	  var eElem = {}; 
    	  
    	  // check which objects belong to nK cluster and create a temp list
    	  for ( var i = 0; i < ResultData.length; ++i )
    	  {
    		  eElem = ResultData[i];
    		  
        	  for ( var j = 0; j < eElem.length; ++j )
        	  {
        		  if (eElem[j].cl == nK){
          	  	      eElem[j].lod = 20;
        			  aTemp.push(eElem[j]);
        		  }
        	  }
    	  }
    	  
    	  var a, ax, b;

    	  aTemp.sort(function (a, b) { return a[0] != b[0] ? a[0] - b[0] : a[1] - b[1] }); // sort the objects on x coordinate

    	  // find the first gap between clusters from the left side
    	  var nn = aTemp.length - 1;
    	  var iGap = 0;

    	  var adTemp = [];
    	  var firstP = aTemp[0]; lastP = aTemp[nn];
    	  if ( nn < 2 ) return [];
    	  var distGap = firstP[0] - lastP[0] + completeX;
    	  if ( distGap < distThreshold)
		  {
	    	  for ( var i = 0; i < nn; ++i )
			  {
	    		  a = aTemp[i];
	    		  b = aTemp[i+1];
	    		  ax = b[0] - a[0];
	    		  
	    		  if ( ax > distGap ) 
	    		  {
	    			  iGap = i+1;
	    			  distGap = ax;
	    			  if ( distGap > distThreshold )
	    			     break;
	    		  }
			  }
		  }

    	  var entities = aTemp.length;
    	  var lastEntity = iGap + entities;
    	  var nAddition = 0;
    	  var lastIndex = -1, last;
    	  var zeroEdges = [];
    	  for ( var i = iGap; i < lastEntity; ++i )
		  {
    		  if (i >= entities){
    			  j = i - entities;
    			  nAddition = completeX;
    		  } else {
    			  j = i;
    		  }
    		  a = aTemp[j];
    		  if ( lastIndex != -1 && a[0] === last[0] && a[1] === last[1] )
			  {
               	 zeroEdges.push( { s : lastIndex, d : j, l : 0 });	  
			  } 
    		  else{
   			     adTemp.push ([ a[0] + nAddition, a[1], j ]);
   			     lastIndex = j;
        		 last = a;
    		  }
		  }
    	  VBI.Trace("clustering "+nn+" elements with " + zeroEdges.length + " zero edges.");

    	  // do the Delaunay triangulation
		  var triangles = Delaunay.triangulate(adTemp);
		  
		  triangles.sort(function(a,b) { 
			  var diff = a.l - b.l; 
			  if (diff) return diff;
			  diff = a.s - b.s;
			  return diff ? diff : a.d - b.d ;
			  });
    	  
		  var edges = zeroEdges.concat(triangles);
		  cluster.buildTree( aTemp, edges, distThreshold, completeX );

		  var aGroups = [];
		  
		  return aGroups;
      };
      
      cluster.buildTree = function( nodes, edges, distThreshold, completeX )
      {
    	  var log2ComplX = Math.log2(completeX);
    	  var cnt = 0;
		  var prev = undefined;
		  var node1,node2,csNode,cdNode,cUNode,cLNode,bwNode;
		  for (e=0; e <edges.length;++e)
		  {
			 var entry = edges[e]; 
             if ( prev && ( entry.s == prev.s ) && (entry.d == prev.d) )
            	 continue;
             prev = entry;	 
             csNode = node1 = nodes[entry.s];
             cdNode = node2 = nodes[entry.d];
             while ( csNode.c != undefined ) csNode = csNode.c;
             while ( cdNode.c != undefined ) cdNode = cdNode.c;
           	 var myLod = Math.floor(entry.l ? Math.min(22,log2ComplX + Math.log2(distThreshold / entry.l)) : 22);
             if (!csNode.bCluster)
         	 {
            	if (!cdNode.bCluster)
        		{
                    var newNode = { lod : myLod, ident : ++cnt, bCluster : true, cnt : 2 };
                    newNode.bw = [ csNode, cdNode ];
                    csNode.c = newNode;
                    cdNode.c = newNode;
        		}
            	else
            	{
              	   if ( cdNode.lod == myLod ){
               	       node1.c = cdNode;	
               	       cdNode.bw.push(node1);
             	       cdNode.cnt++;
             	   } else
         		   {
                       var newNode = { lod : myLod, ident : ++cnt, bCluster : true, cnt : 2 };
                       newNode.bw = [ csNode, cdNode ];
                       csNode.c = newNode;
                       cdNode.c = newNode;
         		   }     
              	}            		
         	 } else {
             	if (!cdNode.bCluster)
        		{
             	   if ( csNode.lod == myLod ){
               	       node2.c = csNode;	
               	       csNode.bw.push(node2);
             	       csNode.cnt++;
             	   } else
         		   {
                       var newNode = { lod : myLod, ident : ++cnt, bCluster : true, cnt : 2 };
                       newNode.bw = [ csNode, cdNode ];
                       csNode.c = newNode;
                       cdNode.c = newNode;
         		   }
        		}
             	else
         		{
             		if (myLod < Math.min(cdNode.lod,csNode.lod))
         			{
                        var newNode = { lod : myLod, ident : ++cnt, bCluster : true, cnt : 2 };
                        newNode.bw = [ csNode, cdNode ];
                        csNode.c = newNode;
                        cdNode.c = newNode;
         			}
             		else
         			{
             			if (csNode.ident == cdNode.ident)
              			   continue;
                 		if ((cdNode.lod < csNode.lod)||((cdNode.lod == csNode.lod)&&(cdNode.cnt >csNode.cnt))){
                 			cUNode = csNode;
                 			cLNode = cdNode;
                 		} else {
                 			cUNode = cdNode;
                 			cLNode = csNode;
                 		}
//                 		VBI.Trace("Merging "+cUNode.ident+" with "+cUNode.cnt+" elements into "+cLNode.ident+"/"+cLNode.cnt);                 		
                 		for ( i = cUNode.bw.length;i--;)
                 		{
                 			bwNode = cUNode.bw[i];
                 			if (bwNode==undefined) debugger;
                 			bwNode.c = cLNode;
                 			cLNode.bw.push(bwNode);
                 			cLNode.cnt++;                 			
                 			cUNode.bw[i] = undefined;
                 		}                 		
         			}
         		}
             		
         	 }
		  }
      };
      
      
      cluster.treeFillClusterData = function( scene, treeClusters, ResultData, voData )
      { 
          var LODStretch = scene.m_Canvas[0].m_nExactLOD - scene.m_Canvas[0].m_nCurrentLOD;
          var stretch = Math.pow(2,LODStretch);
          
       	  for (var i = 0; i < treeClusters.length; ++i)
       	  {
       		  var ll = treeClusters[i].length;
       		  var xc = treeClusters[i].sumX / ll + cluster.m_dispOffsetX;
   		  	  var yc = treeClusters[i].sumY / ll + cluster.m_dispOffsetY;
       		  var elem = [ xc, yc, 0, 0 ];
       		  elem.orgPos = scene.GetPosFromPoint( [ xc * stretch, yc * stretch] );
    	   	  elem.h = false; 
    	   	  elem.hscale = voData.m_hotscale;
    	   	  elem.hcol   = voData.m_hotcol;    	   	  
    	   	  elem.s = false;
    	   	  elem.im = voData.m_image;
    	   	  elem.sc = voData.m_scale;
    	   	  if (cluster.m_textfont != undefined)
    	   	  {
    		   	  elem.ct = "" + ll;
    		   	  elem.f = cluster.m_textfont;
    		   	  elem.fc = cluster.m_textcolor;
    		   	  elem.fs = cluster.m_textfontscale;
    		   	  elem.fo = cluster.m_textoffset;
    	   	  }
    		  elem.isCl = true;
    	   	  ResultData[voData.m_index].push( elem );
       	  }
       	  
	   	  return true;
      };
      

      return cluster;
   };   

   
   Delaunay = {
   
	   supertriangle: function(vertices) {
	     var xmin = Number.POSITIVE_INFINITY,
	         ymin = Number.POSITIVE_INFINITY,
	         xmax = Number.NEGATIVE_INFINITY,
	         ymax = Number.NEGATIVE_INFINITY,
	         i, dx, dy, dmax, xmid, ymid;
	
	     for(i = vertices.length; i--; ) {
	       if(vertices[i][0] < xmin) xmin = vertices[i][0];
	       if(vertices[i][0] > xmax) xmax = vertices[i][0];
	       if(vertices[i][1] < ymin) ymin = vertices[i][1];
	       if(vertices[i][1] > ymax) ymax = vertices[i][1];
	     }
	
	     dx = xmax - xmin;
	     dy = ymax - ymin;
	     dmax = Math.max(dx, dy);
	     xmid = xmin + dx * 0.5;
	     ymid = ymin + dy * 0.5;
	
	     return [
	       [xmid - 20 * dmax, ymid -      dmax, -1],
	       [xmid            , ymid + 20 * dmax, -2],
	       [xmid + 20 * dmax, ymid -      dmax, -3]
	     ];
	   },
	
	   circumcircle: function(vertices, i, j, k) {
	     var x1 = vertices[i][0],
	         y1 = vertices[i][1],
	         x2 = vertices[j][0],
	         y2 = vertices[j][1],
	         x3 = vertices[k][0],
	         y3 = vertices[k][1],
	         fabsy1y2 = Math.abs(y1 - y2),
	         fabsy2y3 = Math.abs(y2 - y3),
	         xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;
	
	     // Check for coincident points
	     if(fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
	       throw new Error("Eek! Coincident points!");
	
	     if(fabsy1y2 < EPSILON) {
	       m2  = -((x3 - x2) / (y3 - y2));
	       mx2 = (x2 + x3) / 2.0;
	       my2 = (y2 + y3) / 2.0;
	       xc  = (x2 + x1) / 2.0;
	       yc  = m2 * (xc - mx2) + my2;
	     }
	
	     else if(fabsy2y3 < EPSILON) {
	       m1  = -((x2 - x1) / (y2 - y1));
	       mx1 = (x1 + x2) / 2.0;
	       my1 = (y1 + y2) / 2.0;
	       xc  = (x3 + x2) / 2.0;
	       yc  = m1 * (xc - mx1) + my1;
	     }
	
	     else {
	       m1  = -((x2 - x1) / (y2 - y1));
	       m2  = -((x3 - x2) / (y3 - y2));
	       mx1 = (x1 + x2) / 2.0;
	       mx2 = (x2 + x3) / 2.0;
	       my1 = (y1 + y2) / 2.0;
	       my2 = (y2 + y3) / 2.0;
	       xc  = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
	       yc  = (fabsy1y2 > fabsy2y3) ?
	         m1 * (xc - mx1) + my1 :
	         m2 * (xc - mx2) + my2;
	     }
	
	     dx = x2 - xc;
	     dy = y2 - yc;
	     return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
	   },
	
	   dedup: function(edges) {
	     var i, j, a, b, m, n;
	
	     for(j = edges.length; j; ) {
	       b = edges[--j];
	       a = edges[--j];
	
	       for(i = j; i; ) {
	         n = edges[--i];
	         m = edges[--i];
	
	         if((a === m && b === n) || (a === n && b === m)) {
	           edges.splice(j, 2);
	           edges.splice(i, 2);
	           break;
	         }
	       }
	     }
	   },
	
	     triangulate: function(vertices, key) {
	       var n = vertices.length,
	           i, j, indices, st, open, closed, edges, dx, dy, a, b, c;
	
	       // check if there are enough vertices to form any triangles
	       if(n < 3)
	         return [];
	
	       // Slice out the actual vertices from the passed objects. 
	       // (Duplicate the array even if we don't, though, since we need to make a supertriangle later on!)
	       vertices = vertices.slice(0);
	
	       if(key)
	         for(i = n; i--; )
	           vertices[i] = vertices[i][key];
	
	       // Make an array of indices into the vertex array, sorted by the vertices' x-position
	       indices = new Array(n);
	
	       for(i = n; i--; )
	         indices[i] = i;
	
	       indices.sort(function(i, j) {
	         return vertices[j][0] - vertices[i][0];
	       });
	
	       // Next, find the vertices of the supertriangle (which contains all other triangles), 
	       // and append them onto the end of a (copy of) the vertex array
	       st = this.supertriangle(vertices);
	       vertices.push(st[0], st[1], st[2]);
	       
	       // Initialize the open list (containing the supertriangle and nothing else) 
	       // and the closed list (which is empty since we haven't processed any triangles yet)
	       open   = [this.circumcircle(vertices, n + 0, n + 1, n + 2)];
	       closed = [];
	       edges  = [];
	
	       // Incrementally add each vertex to the mesh
	       for(i = indices.length; i--; edges.length = 0) {
	         c = indices[i];
	
	         // For each open triangle, check to see if the current point is
	         // inside it's circumcircle. If it is, remove the triangle and add
	         // it's edges to an edge list
	         for(j = open.length; j--; ) {
	           // If this point is to the right of this triangle's circumcircle,
	           // then this triangle should never get checked again. Remove it
	           // from the open list, add it to the closed list, and skip
	           dx = vertices[c][0] - open[j].x;
	           if(dx > 0.0 && dx * dx > open[j].r) {
	             closed.push(open[j]);
	             open.splice(j, 1);
	             continue;
	           }
	
	           // If we're outside the circumcircle, skip this triangle
	           dy = vertices[c][1] - open[j].y;
	           if(dx * dx + dy * dy - open[j].r > EPSILON)
	             continue;
	
	           // Remove the triangle and add it's edges to the edge list
	           edges.push(
	             open[j].i, open[j].j,
	             open[j].j, open[j].k,
	             open[j].k, open[j].i
	           );
	           open.splice(j, 1);
	         }
	
	         // Remove any doubled edges
	         this.dedup(edges);
	
	         // Add a new triangle for each edge
	         for(j = edges.length; j; ) {
	           b = edges[--j];
	           a = edges[--j];
	           open.push(this.circumcircle(vertices, a, b, c));
	         }
	       }
	
	       // Copy any remaining open triangles to the closed list, and then
	       // remove any triangles that share a vertex with the supertriangle,
	       // building a list of triplets that represent triangles
	       for(i = open.length; i--; )
	         closed.push(open[i]);
	       open.length = 0;
	
	       for(i = closed.length; i--; )
	         if(closed[i].i < n && closed[i].j < n && closed[i].k < n){
	        	 //var nodes = [(vertices[closed[i].i])[2] , (vertices[closed[i].j])[2], (vertices[closed[i].k])[2] ];
	        	 var nodes = [closed[i].i , closed[i].j, closed[i].k ];
	        	 nodes.sort(); 
	        	 var vi = vertices[nodes[0]], vj = vertices[nodes[1]], vk = vertices[nodes[2]];
	        	 var ds1 =  ((vi[0]-vj[0])*(vi[0]-vj[0])+(vi[1]-vj[1])*(vi[1]-vj[1]));
	        	 var ds2 =  ((vi[0]-vk[0])*(vi[0]-vk[0])+(vi[1]-vk[1])*(vi[1]-vk[1]));
	        	 var ds3 =  ((vk[0]-vj[0])*(vk[0]-vj[0])+(vk[1]-vj[1])*(vk[1]-vj[1]));
	        	 open.push( { s : (vertices[nodes[0]])[2], d : (vertices[nodes[1]])[2], l : ds1 });
	        	 open.push( { s : (vertices[nodes[0]])[2], d : (vertices[nodes[2]])[2], l : ds2 });
	        	 open.push( { s : (vertices[nodes[1]])[2], d : (vertices[nodes[2]])[2], l : ds3 });
	        	 
	         }
	
	       return open;
	     },
	     
	     contains: function(tri, p) {
	       // Bounding box test first, for quick rejections
	       if((p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0]) ||
	          (p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0]) ||
	          (p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1]) ||
	          (p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1]))
	         return null;
	
	       var a = tri[1][0] - tri[0][0],
	           b = tri[2][0] - tri[0][0],
	           c = tri[1][1] - tri[0][1],
	           d = tri[2][1] - tri[0][1],
	           i = a * d - b * c;
	
	       // Degenerate triangle
	       if(i === 0.0)
	         return null;
	
	       var u = (d * (p[0] - tri[0][0]) - b * (p[1] - tri[0][1])) / i,
	           v = (a * (p[1] - tri[0][1]) - c * (p[0] - tri[0][0])) / i;
	
	       // check if we are outside the triangle
	       if(u < 0.0 || v < 0.0 || (u + v) > 1.0)
	         return null;
	
	       return [u, v];
	     }
   };
   
   
   return clustering;
};



