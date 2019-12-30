
var Module = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  return (
function(Module) {
  Module = Module || {};

var Module=typeof Module!=="undefined"?Module:{};const{EmscriptenMemoryAllocator:EmscriptenMemoryAllocator}=require("./commonFunctions.js");const OPUS_APPLICATION=2049;const OPUS_OUTPUT_SAMPLE_RATE=48e3;const OPUS_OUTPUT_MAX_LENGTH=4e3;const OPUS_FRAME_SIZE=20;const SPEEX_RESAMPLE_QUALITY=6;const BUFFER_LENGTH=4096;const OPUS_OK=0;const OPUS_SET_BITRATE_REQUEST=4002;const RESAMPLER_ERR_SUCCESS=0;class _OpusEncoder{constructor(inputSampleRate,channelCount,bitsPerSecond=undefined){this.config={inputSampleRate:inputSampleRate,channelCount:channelCount};this.memory=new EmscriptenMemoryAllocator(Module);this._opus_encoder_create=Module._opus_encoder_create;this._opus_encoder_ctl=Module._opus_encoder_ctl;this._opus_encode_float=Module._opus_encode_float;this._opus_encoder_destroy=Module._opus_encoder_destroy;this._speex_resampler_init=Module._speex_resampler_init;this._speex_resampler_process_interleaved_float=Module._speex_resampler_process_interleaved_float;this._speex_resampler_destroy=Module._speex_resampler_destroy;this._container=new Module.Container;this._container.init(OPUS_OUTPUT_SAMPLE_RATE,channelCount,Math.floor(Math.random()*4294967295));this.OpusInitCodec(OPUS_OUTPUT_SAMPLE_RATE,channelCount,bitsPerSecond);this.SpeexInitResampler(inputSampleRate,OPUS_OUTPUT_SAMPLE_RATE,channelCount);this.inputSamplesPerChannel=inputSampleRate*OPUS_FRAME_SIZE/1e3;this.outputSamplePerChannel=OPUS_OUTPUT_SAMPLE_RATE*OPUS_FRAME_SIZE/1e3;this.inputBufferIndex=0;this.mInputBuffer=this.memory.mallocFloat32Buffer(this.inputSamplesPerChannel*channelCount);this.mResampledBuffer=this.memory.mallocFloat32Buffer(this.outputSamplePerChannel*channelCount);this.mOutputBuffer=this.memory.mallocUint8Buffer(OPUS_OUTPUT_MAX_LENGTH);this.interleavedBuffers=channelCount!==1?new Float32Array(BUFFER_LENGTH*channelCount):undefined}encode(buffers){let samples=this.interleave(buffers);let sampleIndex=0;while(sampleIndex<samples.length){let lengthToCopy=Math.min(this.mInputBuffer.length-this.inputBufferIndex,samples.length-sampleIndex);this.mInputBuffer.set(samples.subarray(sampleIndex,sampleIndex+lengthToCopy),this.inputBufferIndex);this.inputBufferIndex+=lengthToCopy;if(this.inputBufferIndex>=this.mInputBuffer.length){let mInputLength=this.memory.mallocUint32(this.inputSamplesPerChannel);let mOutputLength=this.memory.mallocUint32(this.outputSamplePerChannel);let err=this._speex_resampler_process_interleaved_float(this.resampler,this.mInputBuffer.pointer,mInputLength.pointer,this.mResampledBuffer.pointer,mOutputLength.pointer);mInputLength.free();mOutputLength.free();if(err!==RESAMPLER_ERR_SUCCESS){throw new Error("Resampling error.")}let packetLength=this._opus_encode_float(this.encoder,this.mResampledBuffer.pointer,this.outputSamplePerChannel,this.mOutputBuffer.pointer,this.mOutputBuffer.length);if(packetLength<0){throw new Error("Opus encoding error.")}this._container.writeFrame(this.mOutputBuffer.pointer,packetLength,this.outputSamplePerChannel);this.inputBufferIndex=0}sampleIndex+=lengthToCopy}}close(){const{channelCount:channelCount}=this.config;let finalFrameBuffers=[];for(let i=0;i<channelCount;++i){finalFrameBuffers.push(new Float32Array(BUFFER_LENGTH-this.inputBufferIndex/channelCount))}this.encode(finalFrameBuffers);Module.destroy(this._container);this.mInputBuffer.free();this.mResampledBuffer.free();this.mOutputBuffer.free();this._opus_encoder_destroy(this.encoder);this._speex_resampler_destroy(this.resampler)}interleave(channelBuffers){const chCount=channelBuffers.length;if(chCount===1){return channelBuffers[0]}for(let ch=0;ch<chCount;ch++){let buffer=channelBuffers[ch];for(let i=0;i<buffer.length;i++){this.interleavedBuffers[i*chCount+ch]=buffer[i]}}return this.interleavedBuffers}OpusInitCodec(outRate,chCount,bitRate=undefined){let mErr=this.memory.mallocUint32(undefined);this.encoder=this._opus_encoder_create(outRate,chCount,OPUS_APPLICATION,mErr.pointer);let err=mErr.value;mErr.free();if(err!==OPUS_OK){throw new Error("Opus encodor initialization failed.")}if(bitRate){this.OpusSetOpusControl(OPUS_SET_BITRATE_REQUEST,bitRate)}}OpusSetOpusControl(request,vaArg){let value=this.memory.mallocInt32(vaArg);this._opus_encoder_ctl(this.encoder,request,value.pointer);value.free()}SpeexInitResampler(inputRate,outputRate,chCount){let mErr=this.memory.mallocUint32(undefined);this.resampler=this._speex_resampler_init(chCount,inputRate,outputRate,SPEEX_RESAMPLE_QUALITY,mErr.pointer);let err=mErr.value;mErr.free();if(err!==RESAMPLER_ERR_SUCCESS){throw new Error("Initializing resampler failed.")}}}Module.init=function(inputSampleRate,channelCount,bitsPerSecond){Module.encodedBuffers=[];Module.encoder=new _OpusEncoder(inputSampleRate,channelCount,bitsPerSecond)};Module.encode=function(buffers){Module.encoder.encode(buffers)};Module.flush=function(){return Module.encodedBuffers.splice(0,Module.encodedBuffers.length)};Module.close=function(){Module.encoder.close()};var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}Module["arguments"]=[];Module["thisProgram"]="./this.program";Module["quit"]=function(status,toThrow){throw toThrow};Module["preRun"]=[];Module["postRun"]=[];var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_HAS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_HAS_NODE=typeof process==="object"&&typeof require==="function";ENVIRONMENT_IS_NODE=ENVIRONMENT_HAS_NODE&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER;ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}else{return scriptDirectory+path}}if(ENVIRONMENT_IS_NODE){scriptDirectory=__dirname+"/";var nodeFS;var nodePath;Module["read"]=function shell_read(filename,binary){var ret;if(!nodeFS)nodeFS=require("fs");if(!nodePath)nodePath=require("path");filename=nodePath["normalize"](filename);ret=nodeFS["readFileSync"](filename);return binary?ret:ret.toString()};Module["readBinary"]=function readBinary(filename){var ret=Module["read"](filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}assert(ret.buffer);return ret};if(process["argv"].length>1){Module["thisProgram"]=process["argv"][1].replace(/\\/g,"/")}Module["arguments"]=process["argv"].slice(2);process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",abort);Module["quit"]=function(status){process["exit"](status)};Module["inspect"]=function(){return"[Emscripten Module object]"}}else if(ENVIRONMENT_IS_SHELL){if(typeof read!="undefined"){Module["read"]=function shell_read(f){return read(f)}}Module["readBinary"]=function readBinary(f){var data;if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){Module["arguments"]=scriptArgs}else if(typeof arguments!="undefined"){Module["arguments"]=arguments}if(typeof quit==="function"){Module["quit"]=function(status){quit(status)}}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1)}else{scriptDirectory=""}Module["read"]=function shell_read(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){Module["readBinary"]=function readBinary(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}Module["readAsync"]=function readAsync(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function xhr_onload(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)};Module["setWindowTitle"]=function(title){document.title=title}}else{}var out=Module["print"]||(typeof console!=="undefined"?console.log.bind(console):typeof print!=="undefined"?print:null);var err=Module["printErr"]||(typeof printErr!=="undefined"?printErr:typeof console!=="undefined"&&console.warn.bind(console)||out);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}moduleOverrides=undefined;if(typeof WebAssembly!=="object"){err("no native wasm support detected")}var wasmMemory;var wasmTable;var ABORT=false;var EXITSTATUS=0;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(u8Array,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(u8Array[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&u8Array.subarray&&UTF8Decoder){return UTF8Decoder.decode(u8Array.subarray(idx,endPtr))}else{var str="";while(idx<endPtr){var u0=u8Array[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=u8Array[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=u8Array[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|u8Array[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;var WASM_PAGE_SIZE=65536;var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferViews(){Module["HEAP8"]=HEAP8=new Int8Array(buffer);Module["HEAP16"]=HEAP16=new Int16Array(buffer);Module["HEAP32"]=HEAP32=new Int32Array(buffer);Module["HEAPU8"]=HEAPU8=new Uint8Array(buffer);Module["HEAPU16"]=HEAPU16=new Uint16Array(buffer);Module["HEAPU32"]=HEAPU32=new Uint32Array(buffer);Module["HEAPF32"]=HEAPF32=new Float32Array(buffer);Module["HEAPF64"]=HEAPF64=new Float64Array(buffer)}var DYNAMIC_BASE=5284016,DYNAMICTOP_PTR=41104;var TOTAL_STACK=5242880;var INITIAL_TOTAL_MEMORY=Module["TOTAL_MEMORY"]||16777216;if(INITIAL_TOTAL_MEMORY<TOTAL_STACK)err("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+INITIAL_TOTAL_MEMORY+"! (TOTAL_STACK="+TOTAL_STACK+")");if(Module["buffer"]){buffer=Module["buffer"]}else{if(typeof WebAssembly==="object"&&typeof WebAssembly.Memory==="function"){wasmMemory=new WebAssembly.Memory({"initial":INITIAL_TOTAL_MEMORY/WASM_PAGE_SIZE,"maximum":INITIAL_TOTAL_MEMORY/WASM_PAGE_SIZE});buffer=wasmMemory.buffer}else{buffer=new ArrayBuffer(INITIAL_TOTAL_MEMORY)}}updateGlobalBufferViews();HEAP32[DYNAMICTOP_PTR>>2]=DYNAMIC_BASE;function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback();continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){Module["dynCall_v"](func)}else{Module["dynCall_vi"](func,callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function ensureInitRuntime(){if(runtimeInitialized)return;runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnPreMain(cb){__ATMAIN__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var Math_abs=Math.abs;var Math_sqrt=Math.sqrt;var Math_ceil=Math.ceil;var Math_floor=Math.floor;var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return String.prototype.startsWith?filename.startsWith(dataURIPrefix):filename.indexOf(dataURIPrefix)===0}var wasmBinaryFile="WebMOpusEncoder.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(){try{if(Module["wasmBinary"]){return new Uint8Array(Module["wasmBinary"])}if(Module["readBinary"]){return Module["readBinary"](wasmBinaryFile)}else{throw"both async and sync fetching of the wasm failed"}}catch(err){abort(err)}}function getBinaryPromise(){if(!Module["wasmBinary"]&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary()})}return new Promise(function(resolve,reject){resolve(getBinary())})}function createWasm(env){var info={"env":env};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiatedSource(output){receiveInstance(output["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!Module["wasmBinary"]&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&typeof fetch==="function"){fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){return WebAssembly.instantiateStreaming(response,info).then(receiveInstantiatedSource,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");instantiateArrayBuffer(receiveInstantiatedSource)})})}else{return instantiateArrayBuffer(receiveInstantiatedSource)}}if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync();return{}}Module["asm"]=function(global,env,providedBuffer){env["memory"]=wasmMemory;env["table"]=wasmTable=new WebAssembly.Table({"initial":60,"maximum":60+0,"element":"anyfunc"});var exports=createWasm(env);return exports};function emscriptenPushBuffer(buf,len){let array=new Uint8Array(Module.HEAPU8.buffer,buf,len);Module.encodedBuffers.push(new Uint8Array(array).buffer)}function ___assert_fail(condition,filename,line,func){abort("Assertion failed: "+UTF8ToString(condition)+", at: "+[filename?UTF8ToString(filename):"unknown filename",line,func?UTF8ToString(func):"unknown function"])}function ___cxa_pure_virtual(){ABORT=true;throw"Pure virtual function called!"}function ___lock(){}var PATH={splitPath:function(filename){var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return splitPathRe.exec(filename).slice(1)},normalizeArray:function(parts,allowAboveRoot){var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift("..")}}return parts},normalize:function(path){var isAbsolute=path.charAt(0)==="/",trailingSlash=path.substr(-1)==="/";path=PATH.normalizeArray(path.split("/").filter(function(p){return!!p}),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path},dirname:function(path){var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.substr(0,dir.length-1)}return root+dir},basename:function(path){if(path==="/")return"/";var lastSlash=path.lastIndexOf("/");if(lastSlash===-1)return path;return path.substr(lastSlash+1)},extname:function(path){return PATH.splitPath(path)[3]},join:function(){var paths=Array.prototype.slice.call(arguments,0);return PATH.normalize(paths.join("/"))},join2:function(l,r){return PATH.normalize(l+"/"+r)}};var SYSCALLS={buffers:[null,[],[]],printChar:function(stream,curr){var buffer=SYSCALLS.buffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0}else{buffer.push(curr)}},varargs:0,get:function(varargs){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(){var ret=UTF8ToString(SYSCALLS.get());return ret},get64:function(){var low=SYSCALLS.get(),high=SYSCALLS.get();return low},getZero:function(){SYSCALLS.get()}};function ___syscall140(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),offset_high=SYSCALLS.get(),offset_low=SYSCALLS.get(),result=SYSCALLS.get(),whence=SYSCALLS.get();return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall145(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();return SYSCALLS.doReadv(stream,iov,iovcnt)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall146(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.get(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){SYSCALLS.printChar(stream,HEAPU8[ptr+j])}ret+=len}return ret}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___setErrNo(value){if(Module["___errno_location"])HEAP32[Module["___errno_location"]()>>2]=value;return value}function ___syscall221(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall5(which,varargs){SYSCALLS.varargs=varargs;try{var pathname=SYSCALLS.getStr(),flags=SYSCALLS.get(),mode=SYSCALLS.get();var stream=FS.open(pathname,flags,mode);return stream.fd}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall54(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall6(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___unlock(){}function _abort(){Module["abort"]()}var _abs=Math_abs;function _emscripten_get_heap_size(){return HEAP8.length}function _emscripten_memcpy_big(dest,src,num){HEAPU8.set(HEAPU8.subarray(src,src+num),dest)}var _fabs=Math_abs;var _floor=Math_floor;function _round(d){d=+d;return d>=+0?+Math_floor(d+ +.5):+Math_ceil(d-+.5)}function _rintf(f){f=+f;return f-+Math_floor(f)!=.5?+_round(f):+_round(f/+2)*+2}function abortOnCannotGrowMemory(requestedSize){abort("OOM")}function _emscripten_resize_heap(requestedSize){abortOnCannotGrowMemory(requestedSize)}function _sbrk(increment){increment=increment|0;var oldDynamicTop=0;var newDynamicTop=0;var totalMemory=0;totalMemory=_emscripten_get_heap_size()|0;oldDynamicTop=HEAP32[DYNAMICTOP_PTR>>2]|0;newDynamicTop=oldDynamicTop+increment|0;if((increment|0)>0&(newDynamicTop|0)<(oldDynamicTop|0)|(newDynamicTop|0)<0){abortOnCannotGrowMemory(newDynamicTop|0)|0;___setErrNo(12);return-1}if((newDynamicTop|0)>(totalMemory|0)){if(_emscripten_resize_heap(newDynamicTop|0)|0){}else{___setErrNo(12);return-1}}HEAP32[DYNAMICTOP_PTR>>2]=newDynamicTop|0;return oldDynamicTop|0}var _sqrt=Math_sqrt;function _time(ptr){var ret=Date.now()/1e3|0;if(ptr){HEAP32[ptr>>2]=ret}return ret}var asmGlobalArg={};var asmLibraryArg={"c":___assert_fail,"m":___cxa_pure_virtual,"i":___lock,"h":___syscall140,"r":___syscall145,"f":___syscall146,"d":___syscall221,"t":___syscall5,"s":___syscall54,"g":___syscall6,"e":___unlock,"j":_abort,"a":_abs,"u":emscriptenPushBuffer,"p":_emscripten_memcpy_big,"q":_fabs,"l":_floor,"o":_rintf,"b":_sbrk,"n":_sqrt,"k":_time};var asm=Module["asm"](asmGlobalArg,asmLibraryArg,buffer);Module["asm"]=asm;var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return Module["asm"]["__wasm_call_ctors"].apply(null,arguments)};var _emscripten_bind_VoidPtr___destroy___0=Module["_emscripten_bind_VoidPtr___destroy___0"]=function(){return Module["asm"]["v"].apply(null,arguments)};var _emscripten_bind_Container_Container_0=Module["_emscripten_bind_Container_Container_0"]=function(){return Module["asm"]["w"].apply(null,arguments)};var _emscripten_bind_Container_init_3=Module["_emscripten_bind_Container_init_3"]=function(){return Module["asm"]["x"].apply(null,arguments)};var _emscripten_bind_Container_writeFrame_3=Module["_emscripten_bind_Container_writeFrame_3"]=function(){return Module["asm"]["y"].apply(null,arguments)};var _emscripten_bind_Container___destroy___0=Module["_emscripten_bind_Container___destroy___0"]=function(){return Module["asm"]["z"].apply(null,arguments)};var _opus_encoder_create=Module["_opus_encoder_create"]=function(){return Module["asm"]["A"].apply(null,arguments)};var _opus_encode_float=Module["_opus_encode_float"]=function(){return Module["asm"]["B"].apply(null,arguments)};var _opus_encoder_ctl=Module["_opus_encoder_ctl"]=function(){return Module["asm"]["C"].apply(null,arguments)};var _opus_encoder_destroy=Module["_opus_encoder_destroy"]=function(){return Module["asm"]["D"].apply(null,arguments)};var _speex_resampler_init=Module["_speex_resampler_init"]=function(){return Module["asm"]["E"].apply(null,arguments)};var _speex_resampler_destroy=Module["_speex_resampler_destroy"]=function(){return Module["asm"]["F"].apply(null,arguments)};var _speex_resampler_process_interleaved_float=Module["_speex_resampler_process_interleaved_float"]=function(){return Module["asm"]["G"].apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return Module["asm"]["H"].apply(null,arguments)};var _free=Module["_free"]=function(){return Module["asm"]["I"].apply(null,arguments)};var dynCall_vi=Module["dynCall_vi"]=function(){return Module["asm"]["J"].apply(null,arguments)};var dynCall_v=Module["dynCall_v"]=function(){return Module["asm"]["K"].apply(null,arguments)};Module["asm"]=asm;Module["then"]=function(func){if(Module["calledRun"]){func(Module)}else{var old=Module["onRuntimeInitialized"];Module["onRuntimeInitialized"]=function(){if(old)old();func(Module)}}return Module};function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}ExitStatus.prototype=new Error;ExitStatus.prototype.constructor=ExitStatus;dependenciesFulfilled=function runCaller(){if(!Module["calledRun"])run();if(!Module["calledRun"])dependenciesFulfilled=runCaller};function run(args){args=args||Module["arguments"];if(runDependencies>0){return}preRun();if(runDependencies>0)return;if(Module["calledRun"])return;function doRun(){if(Module["calledRun"])return;Module["calledRun"]=true;if(ABORT)return;ensureInitRuntime();preMain();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}Module["run"]=run;function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}if(what!==undefined){out(what);err(what);what='"'+what+'"'}else{what=""}ABORT=true;EXITSTATUS=1;throw"abort("+what+"). Build with -s ASSERTIONS=1 for more info."}Module["abort"]=abort;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}Module["noExitRuntime"]=true;run();function WrapperObject(){}WrapperObject.prototype=Object.create(WrapperObject.prototype);WrapperObject.prototype.constructor=WrapperObject;WrapperObject.prototype.__class__=WrapperObject;WrapperObject.__cache__={};Module["WrapperObject"]=WrapperObject;function getCache(__class__){return(__class__||WrapperObject).__cache__}Module["getCache"]=getCache;function wrapPointer(ptr,__class__){var cache=getCache(__class__);var ret=cache[ptr];if(ret)return ret;ret=Object.create((__class__||WrapperObject).prototype);ret.ptr=ptr;return cache[ptr]=ret}Module["wrapPointer"]=wrapPointer;function castObject(obj,__class__){return wrapPointer(obj.ptr,__class__)}Module["castObject"]=castObject;Module["NULL"]=wrapPointer(0);function destroy(obj){if(!obj["__destroy__"])throw"Error: Cannot destroy object. (Did you create it yourself?)";obj["__destroy__"]();delete getCache(obj.__class__)[obj.ptr]}Module["destroy"]=destroy;function compare(obj1,obj2){return obj1.ptr===obj2.ptr}Module["compare"]=compare;function getPointer(obj){return obj.ptr}Module["getPointer"]=getPointer;function getClass(obj){return obj.__class__}Module["getClass"]=getClass;var ensureCache={buffer:0,size:0,pos:0,temps:[],needed:0,prepare:function(){if(ensureCache.needed){for(var i=0;i<ensureCache.temps.length;i++){Module["_free"](ensureCache.temps[i])}ensureCache.temps.length=0;Module["_free"](ensureCache.buffer);ensureCache.buffer=0;ensureCache.size+=ensureCache.needed;ensureCache.needed=0}if(!ensureCache.buffer){ensureCache.size+=128;ensureCache.buffer=Module["_malloc"](ensureCache.size);assert(ensureCache.buffer)}ensureCache.pos=0},alloc:function(array,view){assert(ensureCache.buffer);var bytes=view.BYTES_PER_ELEMENT;var len=array.length*bytes;len=len+7&-8;var ret;if(ensureCache.pos+len>=ensureCache.size){assert(len>0);ensureCache.needed+=len;ret=Module["_malloc"](len);ensureCache.temps.push(ret)}else{ret=ensureCache.buffer+ensureCache.pos;ensureCache.pos+=len}return ret},copy:function(array,view,offset){var offsetShifted=offset;var bytes=view.BYTES_PER_ELEMENT;switch(bytes){case 2:offsetShifted>>=1;break;case 4:offsetShifted>>=2;break;case 8:offsetShifted>>=3;break}for(var i=0;i<array.length;i++){view[offsetShifted+i]=array[i]}}};function VoidPtr(){throw"cannot construct a VoidPtr, no constructor in IDL"}VoidPtr.prototype=Object.create(WrapperObject.prototype);VoidPtr.prototype.constructor=VoidPtr;VoidPtr.prototype.__class__=VoidPtr;VoidPtr.__cache__={};Module["VoidPtr"]=VoidPtr;VoidPtr.prototype["__destroy__"]=VoidPtr.prototype.__destroy__=function(){var self=this.ptr;_emscripten_bind_VoidPtr___destroy___0(self)};function Container(){this.ptr=_emscripten_bind_Container_Container_0();getCache(Container)[this.ptr]=this}Container.prototype=Object.create(WrapperObject.prototype);Container.prototype.constructor=Container;Container.prototype.__class__=Container;Container.__cache__={};Module["Container"]=Container;Container.prototype["init"]=Container.prototype.init=function(arg0,arg1,arg2){var self=this.ptr;if(arg0&&typeof arg0==="object")arg0=arg0.ptr;if(arg1&&typeof arg1==="object")arg1=arg1.ptr;if(arg2&&typeof arg2==="object")arg2=arg2.ptr;_emscripten_bind_Container_init_3(self,arg0,arg1,arg2)};Container.prototype["writeFrame"]=Container.prototype.writeFrame=function(arg0,arg1,arg2){var self=this.ptr;if(arg0&&typeof arg0==="object")arg0=arg0.ptr;if(arg1&&typeof arg1==="object")arg1=arg1.ptr;if(arg2&&typeof arg2==="object")arg2=arg2.ptr;_emscripten_bind_Container_writeFrame_3(self,arg0,arg1,arg2)};Container.prototype["__destroy__"]=Container.prototype.__destroy__=function(){var self=this.ptr;_emscripten_bind_Container___destroy___0(self)};(function(){function setupEnums(){}if(runtimeInitialized)setupEnums();else addOnPreMain(setupEnums)})();


  return Module
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
      module.exports = Module;
    else if (typeof define === 'function' && define['amd'])
      define([], function() { return Module; });
    else if (typeof exports === 'object')
      exports["Module"] = Module;
    