var express 	= require('express');
var validator 	= require('validator');
var md5 		= require('md5');



var currentApi = function( req, res, next ){
	
	var classes = req.app.get('classes');
	classes.gnrl._extract( classes, this ); // Extract Classes
	var _p = gnrl._p;
	
	var params = gnrl._frm_data( req );
	var _lang = gnrl._getLang( params );
	
	var _status = 1;
	var _message = '';
	var _response = {};
	
	
	var key = gnrl._is_undf( params.key );
	if( !key ){ _status = 0; _message = 'err_req_key'; }
	
	if( !_status ){
		gnrl._api_response( res, 0, _message, {} );
	}
	else{
		dclass._select( '*', 'tbl_cms', " AND i_delete = '0' AND v_key = '"+key+"' ", function( status, data ){ 
			if( !status ){
				gnrl._api_response( res, 0, _message );
			}
			else if( !data.length ){
				gnrl._api_response( res, 0, 'err_no_records', {} );
			}
			else{
				gnrl._api_response( res, 1, _message, data[0] );
			}
		});
	}
	
};

module.exports = currentApi;
