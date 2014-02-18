/*
  Copyright (c) 2014, J.D. Koftinoff Software, Ltd. <jeffk@jdkoftinoff.com>
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

   3. Neither the name of J.D. Koftinoff Software, Ltd. nor the names of its
      contributors may be used to endorse or promote products derived from
      this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
  POSSIBILITY OF SUCH DAMAGE.
*/

jdksavdecc = {};

jdksavdecc.toHexOctet = function(v) {
    var r="";
    var s = v.toString(16);
    for( var i=0; i< (2-s.length); ++i ) {
        r+="0";
    }
    return r+s;
}

jdksavdecc.toHexDoublet = function(v) {
    var r="";
    var s = v.toString(16);
    for( var i=0; i< (4-s.length); ++i ) {
        r+="0";
    }
    return r+s;
}

jdksavdecc.toHexQuadlet = function(v) {
    var r="";
    var s = v.toString(16);
    for( i=0; i< (8-s.length); ++i ) {
        r+="0";
    }
    return r+s;
}

jdksavdecc.getBit = function(data,bit) {
	var octet = bit>>>3;
	var octetbit = bit&0x7;
	var octetbitvalue = 0x80 >>> octetbit;
	return (data[octet] & octetbitvalue) == octetbitvalue;
}

jdksavdecc.setBit = function(data,bit,value) {
	var octet = bit>>>3;
	var octetbit = bit&0x7;
	var octetbitvalue = 0x80 >>> octetbit;
	var octetmask = ~octetbitvalue >>> 0;
	var v = data[octet] & octetmask;
	if( value===true ) {
		v=v|octetbitvalue;
	}
	data[octet]=v;
}


jdksavdecc.getBitField = function(data,startbit,width) {
	var v=0;
	for( var i=0; i<width; ++i ) {
		v = v<<1 >>> 0;
		if( jdksavdecc.getBit(data,i+startbit)===true ) {
			v = v|1;
		}
	}
	return v;
}

jdksavdecc.setBitField = function(data,startbit,width,value) {
	var v=value;
	for( var i=width-1; i>=0; --i) {
		var b=false;
		if( (v&1) == 1 ) {
			b=true;
		}
		jdksavdecc.setBit(data,startbit+i,b);
		v = v >>> 1;
	}
}

jdksavdecc.Bit = function(data,offset,bit_num) {
    o = offset + (bit_num>>>3);
    this.bit_num = bit_num&0x7;
    this.data = data.subarray(o,o+1);
}

jdksavdecc.Bit.prototype.get = function() {
    return jdksavdecc.getBit(this.data,this.bit_num);
}

jdksavdecc.Bit.prototype.set = function(v) {
    jdksavdecc.setBit(this.data,this.bit_num,v);
}

jdksavdecc.Bit.prototype.toString = function() {
    return this.get().toString();
}


jdksavdecc.BitField = function(data,offset,bit_num,width) {
    o = offset + (bit_num>>>3);
    this.bit_num = bit_num&0x7;
    this.data = data.subarray(o,o+(width>>>3)+1);
    this.width = width;
}

jdksavdecc.BitField.prototype.get = function() {
    return jdksavdecc.getBitField(this.data,this.bit_num,this.width);
}

jdksavdecc.BitField.prototype.set = function(v) {
    jdksavdecc.setBitField(this.data,this.bit_num,this.width,v);
}

jdksavdecc.BitField.prototype.toString = function() {
    return this.get().toString();
}


jdksavdecc.Octet = function(data) {
    if( typeof data === "undefined" ) {
        this.data = new Uint8Array(1);
    } else {
	    this.data = data.subarray(0,1);
    }
}

jdksavdecc.Octet.prototype.get = function(v) {
	return this.data[0];
}

jdksavdecc.Octet.prototype.set = function(v) {
	this.data[0] = (v>>>0) & 0xff;
}

jdksavdecc.Octet.prototype.toString = function() {
	s = jdksavdecc.toHexOctet(this.data[0]);
	return s;
}

jdksavdecc.Doublet = function(data) {
    if( typeof data === "undefined" ) {
        this.data = new Uint8Array(2);
    } else {
	    this.data = data.subarray(0,2);
    }
}

jdksavdecc.Doublet.prototype.get = function(v) {
	return (this.data[0] << 8 >>> 0) + this.data[1];
}

jdksavdecc.Doublet.prototype.set = function(v) {
	this.data[0] = (v>>>8) & 0xff;
	this.data[1] = (v>>>0) & 0xff;
}

jdksavdecc.Doublet.prototype.toString = function() {
	s = jdksavdecc.toHexOctet(this.data[0]) +
		jdksavdecc.toHexOctet(this.data[1]);
	return s;
}


jdksavdecc.Quadlet = function(data) {
    if( typeof data === "undefined" ) {
        this.data = new Uint8Array(4);
    } else {
	    this.data = data.subarray(0,4);
    }
}

jdksavdecc.Quadlet.prototype.get = function(v) {
	return (this.data[0] << 24 >>> 0) + 
		(this.data[1] << 16 >>> 0) +
		(this.data[2] << 8 >>> 0) +
		(this.data[3]);
}

jdksavdecc.Quadlet.prototype.set = function(v) {
	this.data[0] = (v>>>24) & 0xff;
	this.data[1] = (v>>>16) & 0xff;
	this.data[2] = (v>>>8) & 0xff;
	this.data[3] = (v>>>0) & 0xff;
}

jdksavdecc.Quadlet.prototype.toString = function() {
	s = jdksavdecc.toHexOctet(this.data[0]) +
		jdksavdecc.toHexOctet(this.data[1]) +
	    jdksavdecc.toHexOctet(this.data[2]) +
		jdksavdecc.toHexOctet(this.data[3]);
	return s;
}


jdksavdecc.Octlet = function(data) {
    if( typeof data === "undefined" ) {
        this.data_high = new Uint8Array(4);
        this.data_low = new Uint8Array(4);
    } else {
	    this.data_high = new jdksavdecc.Doublet( data.subarray(0,4) );
	    this.data_low = new jdksavdecc.Doublet( data.subarray(4,8) );
    }

}

jdksavdecc.Octlet.prototype.get = function(v) {
    return [this.data_high, this.data_low];
}

jdksavdecc.Octlet.prototype.set = function(hi,lo) {
    this.data_high.set(hi);
    this.data_low.set(lo);
}

jdksavdecc.Octlet.prototype.toString = function() {
	s = this.data_high.toString() + this.data_low.toString();
	return s;
}


jdksavdecc.EUI48 = function(data) {
    if( typeof data === "undefined") {
        this.data = new Uint8Array(6);
    } else if( data.constructor.name === "Uint8Array" ) {
        this.data = data.subarray(0,6);
    } else {
        this.data = new Uint8Array(data);
    }
}

jdksavdecc.EUI48.get = function() {
    return this.data;
}

jdksavdecc.EUI48.set = function(v) {
    for( var i=0; i<6; ++i ) {
        this.data[i] = v[i];
    }
}


jdksavdecc.EUI48.prototype.toString = function() {
	s = jdksavdecc.toHexOctet(this.data[0]) + ':' +
		jdksavdecc.toHexOctet(this.data[1]) + ':' +
		jdksavdecc.toHexOctet(this.data[2]) + ':' +
		jdksavdecc.toHexOctet(this.data[3]) + ':' +
		jdksavdecc.toHexOctet(this.data[4]) + ':' +
		jdksavdecc.toHexOctet(this.data[5]);
	return s;
}    

jdksavdecc.EUI48.prototype.getBit = function(index,bit) {
	return jdksavdecc.getBit( this.data, (index<<3) + bit );
}

jdksavdecc.EUI48.prototype.setBit = function(index,bit,v) {
	jdksavdecc.setBit( this.data, (index<<3) + bit, v );
}


jdksavdecc.EUI64 = function(data) {
    if( typeof data === "undefined") {
        this.data = new Uint8Array(8);
    } else if( data.constructor.name === "Uint8Array" ) {
        this.data = data.subarray(0,8);
    } else {
        this.data = new Uint8Array(data);
    }

}

jdksavdecc.EUI64.get = function() {
    return this.data;
}

jdksavdecc.EUI64.set = function(v) {
    for( var i=0; i<8; ++i ) {
        this.data[i] = v[i];
    }
}

jdksavdecc.EUI64.prototype.toString = function() {
	s = jdksavdecc.toHexOctet(this.data[0]) + ':' +
		jdksavdecc.toHexOctet(this.data[1]) + ':' +
		jdksavdecc.toHexOctet(this.data[2]) + ':' +
		jdksavdecc.toHexOctet(this.data[3]) + ':' +
		jdksavdecc.toHexOctet(this.data[4]) + ':' +
		jdksavdecc.toHexOctet(this.data[5]) + ':' +
		jdksavdecc.toHexOctet(this.data[6]) + ':' +
		jdksavdecc.toHexOctet(this.data[7]);
	return s;
}

jdksavdecc.EUI64.prototype.getBit = function(index,bit) {
	return jdksavdecc.getBit( this.data, (index<<3) + bit );
}

jdksavdecc.EUI64.prototype.setBit = function(index,bit,v) {
	jdksavdecc.setBit( this.data, (index<<3) + bit, v );
}


jdksavdecc.PDU = function(data) {
    this.data = data;    
}

jdksavdecc.PDU.prototype.length = function() { 
	return this.data.length(); 
}

jdksavdecc.PDU.prototype.getBit = function(offset,bit) {
	return new jdksavdecc.Bit( this.data, offset, bit );
}

jdksavdecc.PDU.prototype.setBit = function(offset,bit,v) {
	jdksavdecc.setBit( this.data, (offset<<3) + bit, v );
}

jdksavdecc.PDU.prototype.getBitField = function(offset,startbit,width) {
	return new jdksavdecc.BitField( this.data, offset, startbit, width );
}

jdksavdecc.PDU.prototype.setBitField = function(offset,startbit,width,v) {
	jdksavdecc.setBitField( this.data, (offset<<3) + startbit, width, v );
}

jdksavdecc.PDU.prototype.getOctet = function(index) { 
	return new jdksavdecc.Octet( this.data.subarray(index,index+1) );
}

jdksavdecc.PDU.prototype.setOctet = function(index,val) { 
	this.data[index] = val; 
}

jdksavdecc.PDU.prototype.getDoublet = function(index) { 
	return new jdksavdecc.Doublet( this.data.subarray(index,index+2) );
}

jdksavdecc.PDU.prototype.setDoublet = function(index,val) { 
	this.data[index] = (val>>8)&0xff; this.data[index+1] = (val&0xff); 
}

jdksavdecc.PDU.prototype.getQuadlet = function(index) { 
	return new jdksavdecc.Quadlet( this.data.subarray(index,index+4) );
}

jdksavdecc.PDU.prototype.setQuadlet = function(index,val) { 
	this.data[index] = (val>>24)&0xff; 
	this.data[index+1] = (val>>16)&0xff; 
	this.data[index+2] = (val>>8)&0xff; 
	this.data[index+3] = (val&0xff); 
}

jdksavdecc.PDU.prototype.getEUI48 = function(index) { 
	return new jdksavdecc.EUI48( this.data.subarray(index,index+6) ); 
}

jdksavdecc.PDU.prototype.setEUI48 = function(index,val) { 
	this.data.set(val.data,index); 
}

jdksavdecc.PDU.prototype.getEUI64 = function(index) { 
	return new jdksavdecc.EUI64( this.data.subarray(index,index+8) ); 
}

jdksavdecc.PDU.prototype.setEUI64 = function(index,val) { 
	this.data.set(val.data,index); 
}

jdksavdecc.PDU.prototype.length = function() {
	return this.data.length;   
}

jdksavdecc.PDU.prototype.toString = function() { 
	r=""; 
	for( var i=0; i<this.length(); ++i ) { 
		r+= jdksavdecc.toHexOctet(this.getOctet(i)) + " "; 
	} 
	return r; 
}

jdksavdecc.EthernetFrame = function(data) {
    this._data = data;
    this.da = new jdksavdecc.EUI48( data.subarray(0,6) );
    this.sa = new jdksavdecc.EUI48( data.subarray(6,12) );
    this.ethertype = new jdksavdecc.Doublet( data.subarray(12,14) );
    if( this.ethertype.get() == 0x8100 ) {
    	this.tag = new jdksavdecc.Quadlet( data.subarray(12,16) );
    	this.ethertype =  new jdksavdecc.Doublet( data.subarray(16,18) );
	    this.payload = new jdksavdecc.PDU( data.subarray(18) );    
    } else {
	    this.payload = new jdksavdecc.PDU( data.subarray(14) );        
    }
}

jdksavdecc.EthernetFrame.prototype.flatten = function() {
    return this._data;
}

jdksavdecc.AVTPDU = function(pdu) {
    this.cd = pdu.getBit(0,0);
    this.subtype = pdu.getBitField(0,1,7);
    this.sv = pdu.getBit(0,8);
    this.version = pdu.getBitField(0,9,3);
    this.control_data = pdu.getBitField(0,12,4);
    this.status = pdu.getBitField(0,16,5);
    this.control_data_length = pdu.getBitField(21,11);
    this.stream_id = pdu.getEUI64(4);
}

jdksavdecc.ADPDU = function(pdu) {
    this.cd = pdu.getBit(0,0);
    this.subtype = pdu.getBitField(0,1,7);
    this.sv = pdu.getBit(0,8);
    this.version = pdu.getBitField(0,9,3);
    this.message_type = pdu.getBitField(0,12,4);
    this.valid_time = pdu.getBitField(0,16,5);
    this.control_data_length = pdu.getBitField(0,21,11);
    this.entity_id = pdu.getEUI64(4);    
    this.entity_model_id = pdu.getEUI64(12+0);
    this.entity_capabilities = pdu.getQuadlet(12+8);
    this.talker_stream_sources = pdu.getDoublet(12+12);
    this.talker_capabilities = pdu.getDoublet(12+14);
    this.listener_stream_sinks = pdu.getDoublet(12+16);
    this.listener_capabilities = pdu.getDoublet(12+18);
    this.controller_capabilities = pdu.getQuadlet(12+20);
    this.available_index = pdu.getQuadlet(12+24);
    this.gptp_grandmaster_id = pdu.getEUI64(12+28);
    this.gptp_domain_number = pdu.getOctet(12+36);
    this.identify_control_index = pdu.getDoublet(12+40);
    this.interface_index = pdu.getDoublet(12+42);
    this.association_id = pdu.getEUI64(12+44);
}

jdksavdecc.CreateADPDUFrame = function( da, sa, message_type, valid_time, entity_id, entity_model_id, entity_capabilities, controller_capabilities, available_index ) {
    data = new Uint8Array(68);
    frame = new jdksavdecc.EthernetFrame(data);
    frame.da.set(da);
    frame.sa.set(sa);
    frame.ethertype.set(0x22f0);
    adpdu = new jdksavdecc.ADPDU( frame.payload );
    adpdu.cd.set(true);
    adpdu.subtype.set(0x7a);
    adpdu.sv.set(false);
    adpdu.version.set(0);
    adpdu.message_type.set(message_type);
    adpdu.valid_time.set(valid_time);
    adpdu.control_data_length.set(0x38);
    adpdu.entity_id.set(entity_id);
    adpdu.entity_model_id.set(entity_model_id);
    adpdu.entity_capabilities.set(entity_capabilities);
    adpdu.controller_capabilities.set(controller_capabilities);
    adpdu.available_index.set(available_index);
    return adpdu;
}


jdksavdecc.adp_acmp_multicast = new jdksavdecc.EUI48( new Uint8Array( [0x91,0xe0,0xf0,0x01,0x00,0x00] ) );
jdksavdecc.identification_multicast = new jdksavdecc.EUI48( new Uint8Array( [0x91,0xe0,0xf0,0x01,0x00,0x01] ) );

   

d1=new Uint8Array( [0x90, 0xe0, 0xf0, 0x01, 0x00, 0x00, 0x00, 0x1c, 0xab, 0x11, 0x22, 0x33, 0x22, 0xf0, 0xfa, 0x00, 0x00, 0x00, 0x10, 0x03, 0xff, 0xff, 0xa0, 0xb0, 0xc0, 0xd0, 0xe0, 0xf0, 0xf1, 0xf2 ] );
d2=new Uint8Array( [0x90, 0xe0, 0xf0, 0x01, 0x00, 0x00, 0x00, 0x1c, 0xab, 0x11, 0x22, 0x33, 0x81, 0x00, 0x00, 0x00, 0x22, 0xf0, 0xfa, 0x00, 0x00, 0x00, 0x10, 0x03, 0xff, 0xff, 0xa0, 0xb0, 0xc0, 0xd0, 0xe0, 0xf0, 0xf1, 0xf2 ] );

e1=new jdksavdecc.EthernetFrame(d1);
e2=new jdksavdecc.EthernetFrame(d2);

adv = new Uint8Array( [0x90, 0xe0, 0xf0, 0x01, 0x00, 0x00, 0x00, 0x1c, 0xab, 0x11, 0x22, 0x33, 0x22, 0xf0, 0xfa, 0x00, 0x28, 0x38, 0x00, 0x1c, 0xab, 0x00, 0x01, 0x00, 0x30, 0xba, 0x00, 0x1c, 0xab, 0x00, 0x00, 0x00, 0x10, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x87, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00] )

advf = new jdksavdecc.EthernetFrame(adv);
