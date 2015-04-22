
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var userList = [];
var out_socket;

var maclist = [
        "90:59:AF:0F:30:CC",
        "90:59:AF:0F:3C:B3",
        "D0:39:72:A4:96:4D",
        "90:59:AF:0F:3D:28",
        "D0:39:72:A4:9B:7F",
        "D0:39:72:A4:96:35",
        "D0:39:72:A4:99:41",
        "90:59:AF:0F:3D:A1",
        "D0:39:72:A4:99:33",
        "D0:39:72:A4:99:A1",
        "D0:39:72:A4:9B:22",
        "D0:39:72:A4:B6:56",
        "D0:39:72:A4:9A:9F",
        "90:59:AF:0F:3C:C3"
];

var arrList = ['Aarr','Barr','Carr','Darr','Earr'];


var fs = require('fs');

function txtmake(filename, filestream){
	/*
	fs.writeFile('./'+filename+'.txt',filestream,function(err,data){
		if(err) throw err;
		console.log("file write");
	});
	*/
	
	var filestring = "";
	for(var i = 0;i<14;i++){
		//filestring +=  parseString(filestream[maclist[i]]);
		filestring +=  filestream[maclist[i]]+"\n";
		console.log( filestream[maclist[i]]);
	}
	
	fs.open('./'+filename+'.csv', 'w', function(err, fd) {
		  if(err) throw err;
		  var buf = new Buffer(filestring);
		  fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer) {
		    if(err) throw err;
		    //console.log(err, written, buffer);
		    fs.close(fd, function() {
		      console.log('Done');
		    });
		  });
		});
	
}



/// mysql connect
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

var maxium = -100;



// 위치정보를 찾아주는 함수
function testlocationsearch(d,id,clo){
	var query = sqlconnection.query('select * from bluedata',function(err,rows){
	    //console.log(rows);
		
	    var locationstr;
	    var max=0.0;
	    
	    if(clo == ""){
		    rows.forEach(function(row){
		   	    	
		    	var temp = 1;
		    	for(var i = 0;i<8;i++){
		    		if(d[i].value != -98)
		    			temp += Math.pow((d[i].value - row[d[i].mac]),2);
		    	}
		    	temp = 1 / (1 +Math.sqrt(temp,2));
		    	
		    	
		    	console.log(row.location.toString(),temp);
		    	
		    	if(max < temp){
		    		max = temp
		    		locationstr = row.location.toString();
		    	}
		    	
		    });
	    }
	    else{
	    	var L1 = parseInt(clo.substring(0, clo.indexOf(".")));
	        var L2 = parseInt(clo.substring(clo.indexOf(".")+1,clo.length));
	    	
	    	 rows.forEach(function(row){
		   	    	
		   	    	var TL1 = parseInt(row['location'].substring(0, row['location'].indexOf(".")));
			        var TL2 = parseInt(row['location'].substring(row['location'].indexOf(".")+1,row['location'].length));
		   	    	
			        if((L1 -TL1 >=-2 && L1 -TL1 <=2) && (L2 -TL2 >=-2 && L2 -TL2 <=2)){
				    	var temp = 1;
				    	for(var i = 0;i<10;i++){
				    		if(d[i].value != -98)
				    			temp += Math.pow((d[i].value - row[d[i].mac]),2);
				    	}
				    	temp = 1 / (1 +Math.sqrt(temp,2));
				    	
				    	
				    	console.log(row.location.toString(),temp);
				    	
				    	if(max < temp){
				    		max = temp
				    		locationstr = row.location.toString();
				    	}
			        }
			    });
	    }
	    
	    console.log(locationstr);
	        	
        
        var d1 = parseInt(locationstr.substring(0, locationstr.indexOf(".")));
        var d2 = parseInt(locationstr.substring(locationstr.indexOf(".")+1,locationstr.length));      
        
        //userIn(id,arrList[d1],d2);
        userIn("testOne",arrList[d1],d2);
        
        console.log(d1,arrList[d1],d2);
        
	    
	    //userPush("Ticon3",1,1);
	    out_socket.emit('dot',locationstr);
	    //sqlrows.json(rows);
	});
}

// DB에 다이렉트로 업데이트 하는 함수 - 테스트용
function locationupdate(d1,d2,d3,d4,d5,d6,d7,d8,userlocation){
	
	
	var insertdata = {
			'lo1':d1,
			'lo2':d2,
			'lo3':d3,
			'lo4':d4,
			'lo5':d5,
			'lo6':d6,
			'lo7':d7,
			'lo8':d8
	}
	sqlconnection.query("insert into bluedata ? ",insertdata, function(err, rows) {
	//sqlconnection.query("update bluedata set ? where location = '"+userlocation+"'",insertdata, function(err, rows) {
		
		sqlconnection.commit();
	}, function(err, rows) {
		
	})
	
}



// userpool에 user을 넣는 함수
function userIn(userid, axis, axisNum){
	console.log("User in:",userid);
	var temp = 3;
	for(var shoot in userList) {
		if(userList[shoot].id === userid){
			userList[shoot].axis= axis;
			userList[shoot].axisNum = axisNum;
			console.log("moving");
			return;
		}
	}
	
	out_socket.emit('newTicon',{'id' : userid, 'axis' : axis, 'axisNum' : axisNum});
	userList.push({'id' : userid, 'axis' : axis, 'axisNum' : axisNum, 'ex' : temp});
	console.log(userList);
	//out_socket.emit('dot',locationstr);
	
}

function userRemove(index){
	out_socket.emit('deleteTicon',{'id' : userList[index].id, 'axis' : userList[index].axis, 'axisNum' : userList[index].axisNum});
	console.log("remove user",userList[index]);
	userList.splice(index,1);
}

// userpool에서 user 제거
function userCheck(){
	console.log(userList);
	for(var shoot in userList) {
		if(userList[shoot].ex > 0){
			userList[shoot].ex--;
			console.log("moving");
		}
		else{
			userRemove(shoot);
		}
	}
}

function userPush(userid, axis, axisNum){
	
	//var ranNum = parseInt((Math.random() * 100 % 4) +"");
	//var aranNum = parseInt((Math.random() * 100 % 4) +"");
	//console.log(ranNum);
	
	userIn(userid,arrList[axis],axisNum);
	
	//setTimeout(function(){socket.emit('moveTicon',{id:"Ticon",axis:arrlist[ranNum],axisNum:aranNum});},3000);
}

// all environments
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
//ra();
var io = require('socket.io').listen(httpserver);

setTimeout(function(){
	for(var shoot in userList) {
		if(userList[shoot].exist > 0){
			userList[shoot].exist--;
		}
		else{
			// 분리
		}
	}

},3000);


setInterval(userCheck, 5000);
io.sockets.on('connection', function (socket) {
	out_socket = socket;
	
	//userPush("Ticon",1,1);
	//userPush("Ticon2",1,1);
	

	
    socket.emit('news', 'world');
    socket.on('my other event', function (data) {
        console.log(data);
    });
    
    socket.on('startTicon',function(){
    	socket.emit('initTicon',userList);
    });
    
    socket.on('req',function(data){
    	//console.log(data);
    	setTimeout(function(){socket.emit('moveTicon',userList);},3000);
    	
    });
    
  
    socket.on('andtest', function (data) {
        console.log(data);
        
        var arrList = ['Aarr','Barr','Carr','Darr'];    	
    	
        var d1 = data["id"];
        var d2 = parseInt(data["axis"]);
        var d3 = parseInt(data["axisNum"]);        
        
        userIn(d1,arrList[d2],d3);
        
    });
    
    socket.on("locationinput",function(data,location){
    	console.log(location);
    	console.log(data);
    	console.log("\n");
    	txtmake(location,data);
    });
    
    
    socket.on('locationupdate', function (data) {
        console.log(data);
        var d1 = parseFloat(data["90:59:AF:0F:30:CC"]);
        var d2 = parseFloat(data["90:59:AF:0F:3C:B3"]);
        var d3 = parseFloat(data["D0:39:72:A4:96:4D"]);
        var d4 = parseFloat(data["90:59:AF:0F:3D:28"]);
        var d5 = parseFloat(data["D0:39:72:A4:9B:7F"]);
        var d6 = parseFloat(data["D0:39:72:A4:96:35"]);
        var d7 = parseFloat(data["D0:39:72:A4:99:41"]);
        var d8 = parseFloat(data["90:59:AF:0F:3D:A1"]);
        var userlocation = data["userlocation"].toString();
        locationupdate(d1,d2,d3,d4,d5,d6,d7,d8,userlocation);
    });
    
    socket.on('locationsearch', function (data) {
        console.log(data);
        
        var d = [];        
        
        for(var i=0; i<14; i++){
        	d.push({'mac' : maclist[i],'value': parseFloat(data[maclist[i]])});
        }
      
        console.log("not sorted!!");
        console.log(d);
        d.sort(function(a, b) {
        	if(a['value'] < b['value'])
        		return 1;
        	else
        		return -1;
        });
        console.log("sorted!!");
        console.log(d);
       
        testlocationsearch(d,data['id'],data['currentlocation']);
              
    });
    
    
});




