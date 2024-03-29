var express = require('express');
var http = require('http');
var nodemailer = require('nodemailer');
var validator = require('validator');
var async = require('async');
var currClass = function(params) {
    // Extract Variables

    params.gnrl._extract(params, this);
    var table = 'tbl_sms';

    return {
        send: function(params, cb) {
            var _to = params._to ? params._to : '';
            var _key = params._key ? params._key : '';
            var _lang = params._lang ? params._lang : global._lang;
            var _keywords = params._keywords ? params._keywords : {};

            var _body = params._body ? params._body : '';
            var _template = {};

            var _result = {
                sms: {},
                template: {},
            };

            async.series([
                // Disabled For Live

                function(callback) {
                    callback(null);
                },

                // Check Requirnments

                function(callback) {
                    if (!_to) {
                        return cb(0, 'err_req_phone');
                    } else if (!validator.isLength(_to, { min: 10, max: 10 })) {
                        return cb(0, 'err_validation_phone');
                    } else if (!validator.isNumeric(_to)) {
                        return cb(0, 'err_validation_phone');
                    } else if (_key == '' && (_body == '')) {
                        return cb(0, 'err_invalid_key');
                    }
                    callback(null);
                },

                // Get Template

                function(callback) {
                    if (_key) {
                        var _q = "SELECT";
                        _q += " a.* ";
                        _q += " FROM tbl_sms a ";
                        _q += " WHERE v_key = '" + _key + "' ";
                        _q += " AND i_delete = '0' AND e_status = 'active' ";

                        dclass._query(_q, function(status, data) {
                            if (!status) {
                                cb(0, 'err_msg_no_sms_template');
                            } else if (!data.length) {
                                cb(0, 'err_msg_no_sms_template');
                            } else {
                                data[0] = gnrl._getLangWiseData(data[0], _lang, [
                                    'j_sms',
                                ]);
                                _result.sms = data[0];
                                callback(null);
                            }
                        });
                    } else {
                        _result.sms.j_sms = _body;
                        callback(null);
                    }
                },

                // Get Settings

                function(callback) {
                    var keys = [
                        'SMS_USERNAME',
                        'SMS_PASSWORD',
                        'SMS_SENDERNAME',
                    ];
                    Settings.getMulti(keys, function(status, val) {
                        _result.sms.sms_username = val['SMS_USERNAME'];
                        _result.sms.sms_password = val['SMS_PASSWORD'];
                        _result.sms.sms_sendername = val['SMS_SENDERNAME'];
                        callback(null);
                    });
                },

                // Repace Keywords

                function(callback) {
                    var j_sms = _result.sms.j_sms.replace(/\\/g, '');
                    for (var k in _keywords) {
                        j_sms = j_sms.replace(k, _keywords[k]);
                    }
                    _result.sms.j_sms = j_sms;

                    if (!j_sms) {
                        return cb(0, 'err_req_sms_body');
                    }

                    callback(null);
                },

                // Send SMS

                function(callback) {
                    var url = 'http://sms.cell24x7.com:1111/mspProducerM/sendSMS';
                    url += '?user=' + _result.sms.sms_username;
                    url += '&pwd=' + _result.sms.sms_password;
                    url += '&sender=' + _result.sms.sms_sendername;
                    url += '&mt=0';
                    url += '&mobile=' + _to;
                    url += '&msg=' + _result.sms.j_sms;
                    url = url.replace(/ /g, "%20");

                    var req = http.get(url, function(res) {
                        var data = '';

                        res.on('data', function(chunk) {
                            data += chunk;
                        });

                        res.on('end', function() {
                            if (data == 'Message Text can not be blank') {
                                return cb(0, 'err_req_sms_body');
                            } else if (data == 'Mobile number can not be blank') {
                                return cb(0, 'err_req_phone');
                            } else if (data == 'Invalid MSISDN received') {
                                return cb(0, 'err_invalid_phone');
                            } else if (data[0] + data[1] + data[2] == 'MSP') {
                                return cb(1, data);
                            } else {
                                return cb(0, 'err_msg_sms_not_sent');
                            }
                        });
                    }).end();
                },
            ], function(error, results) {
                cb(0, 'err_msg_email_not_sent');
            });
        },
    }
};

module.exports = currClass;