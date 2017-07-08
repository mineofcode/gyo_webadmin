var express 	= require('express');
var validator 	= require('validator');
var md5 		= require('md5');
var async       = require('async');



var currentApi = function( req, res, next ){
	
	var classes = req.app.get('classes');
	classes.gnrl._extract( classes, this ); // Extract Classes
	var _p = gnrl._p;
	
	
	var params = gnrl._frm_data( req );
	var _lang = gnrl._getLang( params );
	
	var _status   = 1;
	var _message  = '';
	var _response = {};
	
	var v_username = gnrl._is_undf( params.v_username ).trim();
	var v_password = gnrl._is_undf( params.v_password ).trim();
	var v_device_token = gnrl._is_undf( params.v_device_token ).trim();
	var v_imei_number = gnrl._is_undf( params.v_imei_number ).trim();
	
	if( !v_username ){ _status = 0; _message = 'err_req_email_or_phone'; }
	if( _status && !v_password ){ _status = 0; _message = 'err_req_password'; }
	if( _status && !v_device_token ){ _status = 0; _message = 'err_req_device_token'; }
	if( _status && !v_imei_number ){ _status = 0; _message = 'err_req_imei_number'; }
	
	if( !_status ){
		gnrl._api_response( res, 0, _message );
	}
	else{
		
		/*
			>> Get User
			>> Check Verified OR Not
				>> Check Verified And Inactive
			>> If not verified
				>> Update OTP
				>> Resend OTP
			>> If verified 
				>> Make Login
				>> Take Login Log
		*/
		
		var _user = {};
		var v_token = '';
		var v_otp = gnrl._get_otp();
		var d_last_login = gnrl._db_datetime();
		var isVerified = 1;
		
		async.series([
		
			// Get User
			function( callback ){
				User.getByUsername( v_username, function( status, user ){
					if( !status ){
						gnrl._api_response( res, 0, 'error', {} );
					}
					else if( !user.length ){
						gnrl._api_response( res, 0, 'err_msg_no_account', {} );
					}
					else if( !User.isUser( user[0] ) ){
						gnrl._api_response( res, 0, 'err_msg_no_account', {} );
					}
					else if( user[0].v_imei_number != null && user[0].v_imei_number != '' && user[0].v_imei_number != v_imei_number ){ 
						gnrl._api_response( res, 0, 'err_msg_device_not_recognized', {} ); 
					}
					else if( !validator.equals( md5( v_password ), user[0].v_password ) ){ 
						gnrl._api_response( res, 0, 'err_invalid_password', {} ); 
					}
					else if( user[0].v_token != '' && user[0].v_token != null ){ 
						gnrl._api_response( res, 0, 'err_msg_already_login', {} ); 
					}
					else{
						_user = user[0];
						callback( null );
					}
				});
			},
			
			
			// Check Verified OR Not
			function( callback ){
				
				isVerified = User.isVerified( _user );
				
				// Check Verified And Inactive
				if( isVerified && _user.e_status == 'inactive' ){
					gnrl._api_response( res, 0, 'err_acc_inactive', {} ); 
				}
				else{
					callback( null );
				}
				
			},
			
			
			// If not verified
			function( callback ){
				
				if( !isVerified ){
					
					async.series([
						
						// Update OTP
						function( callback ){
							var _ins = {
								'v_otp' : v_otp,
							};
							dclass._update( 'tbl_user', _ins, " AND id = '"+_user.id+"' ", function( status, data ){
								callback( null );
							});
						},
						
						// Resend OTP
						function( callback ){
							SMS.send({
								_key : 'resend_otp',
								_to : _user.v_phone,
								_lang : User.lang( _user ),
								_keywords : {
									'[user_name]' : _user.v_name,
									'[otp]' : v_otp,
								},
							}, function( succ, err_info ){
								callback( null );
							});
						},
						
					], function( error, results ){
						
						gnrl._api_response( res, 2, 'err_not_verified', {
							'id' 		: _user.id,
							'phone' 	: _user.v_phone,
						});
						
					});
					
				}
				else{
					
					callback( null );
					
				}
				
			},
			
			// If verified 
			function( callback ){
				
				async.series([
						
					// Make Login
					function( callback ){
						
						if( _user.v_imei_number == null || _user.v_imei_number == '' ){ 
							_user.v_imei_number = v_imei_number;
						}
						
						v_token = _user.v_imei_number;
						var _ins = {
							'v_token' 		 : v_token,
							'v_device_token' : v_device_token,
							'd_last_login' 	 : d_last_login,
							'v_imei_number' : _user.v_imei_number,
						};
						
						if( _user.v_imei_number == null || _user.v_imei_number == '' ){ 
							_ins.v_imei_number = v_imei_number;
						}
						
						dclass._update( 'tbl_user', _ins, " AND id = '"+_user.id+"' ", function( status, data ){ 
							if( !status ){
								gnrl._api_response( res, 0, _message, {} );
							}
							else{
								callback( null );
							}
						});
					},
					
					// Take Login Log
					function( callback ){
						User.startLog( _user.id, _user.v_role, 'login', function( status, data ){
							callback( null );
						});
					},
					
				], function( error, results ){
					
					callback( null );
					
				});
				
			},
			
		], 
		
		function( error, results ){
			delete _user.v_password;
			_user.v_token = v_token;
			gnrl._api_response( res, 1, 'succ_login_successfully', _user );
		});

	}
};

module.exports = currentApi;