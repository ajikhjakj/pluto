const a=[23,22,24,4,51,26,37,27,24,6,26,38,29,35,18,21,14,3,12,4,41,39,18,44,54,21,33,35,31,22,34,53,51,44,8,12,3,0,28,1,48,9,51,57,20,44,27,3,16,48];const b=new Map();ib();exports.encrypt=function(text){return es(text)};exports.decrypt=function(text){return ds(text)};function es(text){let b1=eb(sb(text));let i=0;let s="";while(i<b1.length){let s1=(b1[i]&0xF);let s2=((b1[i]&0xF0)>>>4);if(s2<10)s+=s2;else s+=b.get(s2);if(s1<10)s+=s1;else s+=b.get(s1);i+=1}
    return s}
function eb(byte){let b1=[];let j=0;let i=0;while(i<a.length){b1[i]="dfsad@#%$@TDGDF%$#%@#%WFRGFDHJKcvxznmfdsgdfgs2432534fgdf46t".charCodeAt(a[i]);i++}
    let b2=[];i=0;while(j<byte.length){let k=byte[j];b2[j]=(b1[(i%b1.length)]^k);j+=1;i+=1}
    return b2}
function ds(text){let b1=[text.length/2];let i=0;let j=0;let chatAt=function(index){return String.fromCharCode(text.charCodeAt(index))}
    while(j<text.length){let k;if((chatAt(j)>='0')&&(chatAt(j)<='9'))k=((chatAt(j)-'0')<<4);else k=((b.get(chatAt(j)))<<4);let m=j+1;if((chatAt(m)>='0')&&(chatAt(m)<='9'))m=(chatAt(m)-'0');else m=(b.get(chatAt(m)));b1[i]=k+m;j+=2;i+=1}
    return bs(eb(b1))}
function sb(str){let bytes=[];let len,c;len=str.length;for(let i=0;i<len;i++){c=str.charCodeAt(i);if(c>=0x010000&&c<=0x10FFFF){bytes.push(((c>>18)&0x07)|0xF0);bytes.push(((c>>12)&0x3F)|0x80);bytes.push(((c>>6)&0x3F)|0x80);bytes.push((c&0x3F)|0x80)}else if(c>=0x000800&&c<=0x00FFFF){bytes.push(((c>>12)&0x0F)|0xE0);bytes.push(((c>>6)&0x3F)|0x80);bytes.push((c&0x3F)|0x80)}else if(c>=0x000080&&c<=0x0007FF){bytes.push(((c>>6)&0x1F)|0xC0);bytes.push((c&0x3F)|0x80)}else{bytes.push(c&0xFF)}}
    return bytes}
function bs(arr){if(typeof arr==='string'){return arr}
    let str='',_arr=arr;for(let i=0;i<_arr.length;i++){let one=_arr[i].toString(2),v=one.match(/^1+?(?=0)/);if(v&&one.length===8){let bytesLength=v[0].length;let store=_arr[i].toString(2).slice(7-bytesLength);for(let st=1;st<bytesLength;st++){store+=_arr[st+i].toString(2).slice(2)}
        str+=String.fromCharCode(parseInt(store,2));i+=bytesLength-1}else{str+=String.fromCharCode(_arr[i])}}
    return str}
function ib(){b.set('A',10);b.set(10,'A');b.set('B',11);b.set(11,'B');b.set('C',12);b.set(12,'C');b.set('D',13);b.set(13,'D');b.set('E',14);b.set(14,'E');b.set('F',15);b.set(15,'F')}