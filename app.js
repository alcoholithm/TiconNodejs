/**
 * TiconNode Project - by cheon
 */

//all environments
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
 
 
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
 
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
 
app.get('/', routes.index);
app.get('/users', user.list);
 
var httpserver = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
 
// my development value
var userList = [];
//ble 총 개수
var MACCOUNT = 29;

//ble macaddress list
var maclist = [
        // seminar 1
        "D0:39:72:A4:99:41", // 1
        "90:59:AF:0F:3C:B3", // 2
        "D0:39:72:A4:99:A1", // 3
        "D0:39:72:A4:9B:22", // 4
        "90:59:AF:0F:3D:28", // 5
        "D0:39:72:A4:96:35", // 6
        "D0:39:72:A4:96:4D", // 7
        "D0:39:72:A4:B6:56", // 8
        "90:59:AF:0F:30:CC", // 9
        "D0:39:72:A4:9B:7F", // 10
        "90:59:AF:0F:3C:C3", // 11
        "D0:39:72:A4:99:33", // 12
        "90:59:AF:0F:3D:A1", // 13
        
        // "D0:39:72:A4:9A:9F", // 미사용
        
        // 	SEMINAR 2
        "D0:39:72:A4:B6:29", // 14
        "D0:39:72:A4:B6:6A", // 15
        "D0:39:72:A4:97:15", // 16

        
        // LORBY
        "D0:39:72:A4:9E:AD", // 17
        "D0:39:72:A4:CE:8C", // 18
        "D0:39:72:A4:95:72", // 19
        "D0:39:72:A4:B4:B9", // 20
        "D0:39:72:A4:9D:3E", // 21
        "90:59:AF:0F:3D:94", // 22
        "90:59:AF:0F:30:F2", // 23
        "90:59:AF:0F:3F:8F", // 24
        
        // room 0
        "D0:39:72:A4:B2:7D", // 25
        // room A
        "D0:39:72:A4:9B:6D", // 26
        // room B
        "90:59:AF:0F:3C:44", // 27
        // room C
        "D0:39:72:A4:91:C2", // 28
        // ROOM D
        "D0:39:72:A4:B6:43", // 29
               
        // HD
        "D0:39:72:A4:96:4E", // 30
        
        
];
 
// ble location list
var locationlist = [
                    "S9",
                    "S5",
                    "S1",
                    "S10",
                    "S6",
                    "S2",
                    "S11", // 7
                    "S7",
                    "S3",
                    "S0",
                    "S12",
                    "S8",
                    "S4",
                    
                    "G0",
                    "G1",
                    "G2",
                    
                    "L0",
                    "L4",
                    "L1",
                    "L5",
                    "L2",
                    "L6",
                    "L3",
                    "L7",
 
                    "R0",
                    "R1",
                    "R2",
                    "R3",
                    "R4",
                    
                    "H0"                    
                    
];
//warning function
var warningList = [];
// Ticon Node System Init
function sysInit(){
	for(var i = 0; i<9;i++){
		warningList.push(false);
	}
}
sysInit();
 
// finger print mapping data to txt function
var fs = require('fs'); 
function txtmake(filename, filestream){
	
	var filestring = "";
	for(var i = 0;i<MACCOUNT;i++){
		filestring +=  filestream[maclist[i]]+"\n";
		console.log( filestream[maclist[i]]);
	}
	
	fs.open('./'+filename+'.csv', 'w', function(err, fd) {
	  if(err) throw err;
	  var buf = new Buffer(filestring);
	  fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer) {
	    if(err) throw err;
	    fs.close(fd, function() {
	      console.log('Done');
	    });
	  });
	});
	
}
 
 
 
// mysql connect
var mysql = require('mysql');
 
var sqlconnection  = mysql.createConnection({
    host    :'localhost',
    port : 4000,
    user : 'root',
    password : '1235887',
    database:'test'
});
 
sqlconnection.connect(function(err){
	if(err){
		console.error("mysql connection error");
		console.error(err);
		throw err;
	}
	
});
 

 
// near point location search
function locationsearch_near(macaddr,id){
	for(var i=0;i<MACCOUNT;i++){
		if(macaddr == maclist[i]){
		    userIn(id,locationlist[i]);    			
		    tempList.push({'id':id,"location":locationlist[i]});
		    break;
		}
	}
}
 

// 위치정보를 찾아주는 함수 - finger print
function locationsearch(d,id){
	var query = sqlconnection.query('select * from bluedata',function(err,rows){
	    //console.log(rows);
		
	    var locationstr;
	    var max=0.0;
	      
	    rows.forEach(function(row){			   	    

	    	var temp = 0.0;
	    
	    	
	    	for(var i = 0;i<13;i++){
	    		if(d[i].value != -98){
	    			temp += Math.pow((d[i].value - row[d[i].mac]),2);
	    			//console.log(d[i].value,row[d[i].mac]);
	    		}
	    	}
	    	temp = 1 / (1 +Math.sqrt(temp,2));
	    	
	    	
	    	console.log(row.location.toString(),temp);
	    	
	    	if(max < temp){
	    		max = temp
	    		locationstr = row.location.toString();
	    	}
	    });
			    
	 
	    console.log(id, "this point is",locationstr);
        
        userIn('dot'+id,locationstr);        
	    
	    io.of('/finger').emit('dotfinger',locationstr);
	});
}
 
 
 
 

// userpool에 user을 넣는 함수
function userIn(userid, axis){
	console.log("User in:",userid);
	for(var shoot in userList) {
		if(userList[shoot].id === userid){
			userList[shoot].axis = axis;
			console.log("moving");
			return;
		}
	}
	
	io.sockets.emit('makeTicon',{'id' : userid, 'axis' : axis});
	userList.push({'id' : userid, 'axis' : axis});
	
}
 
function userRemove(index){
	io.sockets.emit('deleteTicon',{'id' : userList[index].id, 'axis' : userList[index].axis });
	console.log("remove user",userList[index]);
	userList.splice(index,1);
	
}
 

 
 



//---------------------------------------------------------------------------------------------------------------------------------------
// socket.io 

var io = require('socket.io').listen(httpserver);
timerTriggerON();


// 자동 실행 함수
function timerTriggerON(){
	setInterval(setMoveReq, 1500);
	//setInterval(setMoveDev, 1000);
}
 
// move data 트리거 함수
function setMoveReq(){
	io.sockets.emit('moveTicon',userList);	
	console.log("moveEmit!!",userList);
}

function setMoveDev(){
	for(var shoot in devList) {
		io.of('/'+devList[shoot].id).emit('dot'+devList[shoot].id,devList[shoot].location);
	}
	devList = [];
}

// android 접속 처리
io.of('/android').on('connection', function (socket) {
	console.log("device");
	socket.on('deviceconnect',function(data){
		console.log("device on:" ,data);
		deviceon(data);
		socket.emit("deviceok",data);
	});
});

var devList = [];

// android 이동 처리
function deviceon(id){
	io.of('/'+id).on('connection', function (socket) {
		console.log("device connnect :" ,id);
		socket.emit('connect'+id);
		
		socket.on('locationsearch2', function (data) {
	        console.log("id value : ",data['id']);

	        userIn(data['id'],locationlist[data['maxindex']]);
	        // warning check
	        var warningIndex;
	        if(data['maxindex'] <= 12){  // seminar 1
	        	warningIndex = 0;
	        }
	        else if(data['maxindex'] >= 13 && data['maxindex'] <= 15){ // seminar 2
	        	warningIndex = 1;
	        }
	        else if(data['maxindex'] >= 16 && data['maxindex'] <= 23){ // lobby
	        	warningIndex = 7;
	        }
	        else if(data['maxindex'] == 24){ // lab
	        	warningIndex = 2;
	        }
	        else if(data['maxindex'] == 25){ // a
	        	warningIndex = 4;
	        }
	        else if(data['maxindex'] == 26){ // b
	        	warningIndex = 5;
	        }
	        else if(data['maxindex'] == 27){ // c
	        	warningIndex = 6;
	        }
	        else if(data['maxindex'] == 28){ // metting
	        	warningIndex = 8;
	        }
	        else if(data['maxindex'] == 29){ // hardware
	        	warningIndex = 3;
	        }
	        
		    socket.emit('dot'+data['id'],locationlist[data['maxindex']],emergency,warningList[warningIndex]);
 
	        //devList.push({'id':data['id'], 'location' : locationlist[data['maxindex']]});
	        //console.log(devList);
	        
	    });
		
		socket.on('disconnect',function(){
			
			console.log("bye");
			
			for(var shoot in userList) {
				if(userList[shoot].id == id){
					console.log("delete : ", userList[shoot].id);
					userRemove(shoot);
				}
			}
		});	
	
	});
}	

//android finger 접속 처리
io.of('/finger').on('connection', function (socket) {
	console.log("finger print device");
	
    // finger print used location search
    socket.on('locationsearch', function (data) {
        console.log(data);
        
        var d = []; 
        //var tests = [-80.5,-69.445,-65.73,-70.495,-67.87,-59.31,-73.18,-65.555,-62.065,-67.705,-79.605,-78.805,-79.095]; // 2
        
        for(var i=0; i<13; i++){
        	d.push({'mac' : maclist[i],'value': parseFloat(data[maclist[i]])});
        	//d.push({'mac' : maclist[i],'value' : tests[i]});
        }
        
        console.log(d);
          
        //locationsearch(d,data['id']);
        locationsearch(d,"finger");
              
    });
    
    socket.on('disconnect',function(){
		
		console.log("bye");
		
		for(var shoot in userList) {
			if(userList[shoot].id == "dotfinger"){
				console.log("delete : ", userList[shoot].id);
				userRemove(shoot);
			}
		}
	});	
    
});

// setting socket
io.of('/setting').on('connection', function (socket) {
	
	socket.on("startSetting",function(){
		console.log("start!! ");
		socket.emit("initSetting",warningList,emergency);
	});
	
	 // emergency on/off
    socket.on('emergency',function(data){
    	emergencySwitch(data);
    });
    
    // warning point
    socket.on('changedWarning',function(index,sw){
    	console.log("changed",index,sw);
    	warningSet(parseInt(index),sw);
    	console.log(warningList);
    });
    
    // web selected changed
    socket.on('Warning',function(){  
    	console.log("war change");
    	socket.emit('selectWarning',warningList);
    });
    
	
});


function warningSet(index, sw){
	if(sw == 0)
		warningList[index] = true;
	else
		warningList[index] = false;
}


// emergency function
var emergency = false;
function emergencySwitch(sw){
	if(sw){
		emergency = true;		
	}
	else{
		emergency = false;
	}
}



// global connect
io.sockets.on('connection', function (socket) {
			
	// web server start
    socket.on('startTicon',function(){
    	socket.emit('initTicon',userList);    	
    });
    
    
    // web server request
    socket.on('req',function(data){    	
    	// not 
    });
    
   
    
    // use ble finger print mapping
    socket.on("locationinput",function(data,location){
    	console.log(location);
    	console.log(data);
    	console.log("\n");
    	txtmake(location,data);
    });
     
    
});


///------------------------------------------------------------------------------------------------
// 임시 페이지
function testUserIn(st,ed){ 
	for(var i=st;i<ed;i++){
		userIn("tt"+i,locationlist[i%MACCOUNT]);
	}
}

function testUserCustomIn(){
	for(var i =0;i<6;i++){
		testUserIn(13 + (MACCOUNT*i),MACCOUNT +(MACCOUNT*i));
		//testUserIn(2 + (MACCOUNT*i),3 +(MACCOUNT*i));
		//testUserIn(0 + (MACCOUNT*i),1 +(MACCOUNT*i));
		//testUserIn(12 + (MACCOUNT*i),13 +(MACCOUNT*i));
		//testUserIn(25+ (MACCOUNT*i),26 +(MACCOUNT*i));
		//testUserIn(27+ (MACCOUNT*i),28 +(MACCOUNT*i));
	}
}

//testUserCustomIn();

