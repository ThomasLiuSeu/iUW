/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/**
  * Static helper functions
  */
jQuery.sap.declare('sap.apf.modeler.ui.utils.helper');
sap.apf.modeler.ui.utils.helper = {
	/**
	 * @description callback on resize of the window
	 */
	onResize : function(callback) {
		jQuery(window).resize(function() {
			callback();
		});
	},
	/**
	 * @description applies height and width to child element from respective parent or values passed
	 */
	applySize : function(wParent, hParent, child, options) {
		var width, height;
		if (hParent !== undefined) {
			height = ((hParent.getDomRef !== undefined) ? jQuery(hParent.getDomRef()).height() : (jQuery.isNumeric(hParent) ? hParent : jQuery(hParent).height()));
		}
		if (wParent !== undefined) {
			width = ((wParent.getDomRef !== undefined) ? jQuery(wParent.getDomRef()).width() : (jQuery.isNumeric(wParent) ? wParent : jQuery(wParent).width()));
		}
		var childEle = (child.getDomRef !== undefined) ? jQuery(child.getDomRef()) : jQuery(child);
		var offsetHeight = (options === undefined) ? 0 : (options.offsetHeight || 0);
		var offsetWidth = (options === undefined) ? 0 : (options.offsetWidth || 0);
		//Apply Height & Width to Child
		childEle.css({
			height : (hParent === undefined) ? "100%" : height + offsetHeight + "px",
			width : (wParent === undefined) ? "100%" : width + offsetWidth + "px"
		});
	}
};
