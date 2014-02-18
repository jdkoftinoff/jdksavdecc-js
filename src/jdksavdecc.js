
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

jdksavdecc.Octet = function(octets) {
	this.data = octets.subarray(0,1);
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

jdksavdecc.Doublet = function(octets) {
	this.data = octets.subarray(0,2);
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


jdksavdecc.Quadlet = function(octets) {
	this.data = octets.subarray(0,4);
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


jdksavdecc.EUI48 = function(octets) {
    this.data = octets.subarray(0,6);
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


jdksavdecc.EUI64 = function(octets) {
    this.data = octets.subarray(0,8);
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


jdksavdecc.PDU = function(octets) {
    this.data = octets;    
}

jdksavdecc.PDU.prototype.length = function() { 
	return this.data.length(); 
}

jdksavdecc.PDU.prototype.getBit = function(index,bit) {
	return jdksavdecc.getBit( this.data, (index<<3) + bit );
}

jdksavdecc.PDU.prototype.setBit = function(index,bit,v) {
	jdksavdecc.setBit( this.data, (index<<3) + bit, v );
}

jdksavdecc.PDU.prototype.getBitfield = function(index,startbit,width) {
	return jdksavdecc.getBitField( this.data, (index<<3) + startbit, width );
}

jdksavdecc.PDU.prototype.setBitField = function(index,startbit,width,v) {
	jdksavdecc.setBitField( this.data, (index<<3) + startbit, width, v );
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
	this.data.set(val.octets,index); 
}

jdksavdecc.PDU.prototype.getEUI64 = function(index) { 
	return new jdksavdecc.EUI64( this.data.subarray(index,index+8) ); 
}

jdksavdecc.PDU.prototype.setEUI64 = function(index,val) { 
	this.data.set(val.octets,index); 
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

jdksavdecc.EthernetFrame = function(octets) {
    this.da = new jdksavdecc.EUI48( octets.subarray(0,6) );
    this.sa = new jdksavdecc.EUI48( octets.subarray(6,12) );
    this.ethertype = new jdksavdecc.Doublet( octets.subarray(12,14) );
    if( this.ethertype.get() == 0x8100 ) {
    	this.tag = new jdksavdecc.Quadlet( octets.subarray(12,16) );
    	this.ethertype =  new jdksavdecc.Doublet( octets.subarray(16,18) );
	    this.payload = new jdksavdecc.PDU( octets.subarray(18) );    
    } else {
	    this.payload = new jdksavdecc.PDU( octets.subarray(14) );        
    }
}

jdksavdecc.EthernetFrame.prototype.flatten = function() {
	var r;
	if( "tag" in this ) {
		r=new Uint8Array(6+6+4+2+this.payload.length());
		for( var i=0; i<6; ++i ) { r[0+i] = this.da.data[i]; }
		for( var i=0; i<6; ++i ) { r[6+i] = this.sa.data[i]; }
		for( var i=0; i<4; ++i ) { r[12+i] = this.tag.data[i]; }
		for( var i=0; i<2; ++i ) { r[16+i] = this.ethertype.data[i]; }
		for( var i=0; i<this.payload.length(); ++i ) { r[18+i] = this.payload.data[i]; }
	} else {
		r=new Uint8Array(6+6+2+this.payload.length());
		for( var i=0; i<6; ++i ) { r[0+i] = this.da.data[i]; }
		for( var i=0; i<6; ++i ) { r[6+i] = this.sa.data[i]; }
		for( var i=0; i<2; ++i ) { r[12+i] = this.ethertype.data[i]; }
		for( var i=0; i<this.payload.length(); ++i ) { r[14+i] = this.payload.data[i]; }
	}
	return r;
}

d1=new Uint8Array( [0x90, 0xe0, 0xf0, 0x01, 0x00, 0x00, 0x00, 0x1c, 0xab, 0x11, 0x22, 0x33, 0x22, 0xf0, 0xfa, 0x00, 0x00, 0x00, 0x10, 0x03, 0xff, 0xff, 0xa0, 0xb0, 0xc0, 0xd0, 0xe0, 0xf0, 0xf1, 0xf2 ] );
d2=new Uint8Array( [0x90, 0xe0, 0xf0, 0x01, 0x00, 0x00, 0x00, 0x1c, 0xab, 0x11, 0x22, 0x33, 0x81, 0x00, 0x00, 0x00, 0x22, 0xf0, 0xfa, 0x00, 0x00, 0x00, 0x10, 0x03, 0xff, 0xff, 0xa0, 0xb0, 0xc0, 0xd0, 0xe0, 0xf0, 0xf1, 0xf2 ] );
