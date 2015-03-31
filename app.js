
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
function testlocationsearch(d1,d2,d3,d4,d5,d6,d7,d8){
	var query = sqlconnection.query('select * from bluedata',function(err,rows){
	    //console.log(rows);
		var maxium = -82;
		if(d1<maxium)
			d1 = maxium;
		if(d2<maxium)
			d2 = maxium;
		if(d3<maxium)
			d3 = maxium;
		if(d4<maxium)
			d4 = maxium;
		if(d5<maxium)
			d5 = maxium;
		if(d6<maxium)
			d6 = maxium;
		if(d7<maxium)
			d7 = maxium;
		if(d8<maxium)
			d8 = maxium;
		
		
	    var locationstr;
	    var max=0.0;
	    rows.forEach(function(row){
	    	
	    	var temp = 1 / (1 +Math.sqrt(Math.pow((d1 - row.lo1),2) + Math.pow((d2 - row.lo2),2) + Math.pow((d3 - row.lo3),2) + Math.pow((d4 - row.lo4),2) +
	    					Math.pow((d5 - row.lo5),2) + Math.pow((d6 - row.lo6),2) + Math.pow((d7 - row.lo7),2) + Math.pow((d8 - row.lo8),2) ));
	    	
	    	console.log(row.location.toString(),temp);
	    	
	    	if(max < temp){
	    		max = temp
	    		locationstr = row.location.toString();
	    	}
	    	
	    });
	    
	    console.log(locationstr);
	    userPush("Ticon3",1,1);
	    out_socket.emit('dot',locationstr);
	    //sqlrows.json(rows);
	});
}

function locationupdate(d1,d2,d3,d4,d5,d6,d7,d8,userlocation){
	var maxium = -82;
	if(d1<maxium)
		d1 = maxium;
	if(d2<maxium)
		d2 = maxium;
	if(d3<maxium)
		d3 = maxium;
	if(d4<maxium)
		d4 = maxium;
	if(d5<maxium)
		d5 = maxium;
	if(d6<maxium)
		d6 = maxium;
	if(d7<maxium)
		d7 = maxium;
	if(d8<maxium)
		d8 = maxium;
	
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
	
	sqlconnection.query("update bluedata set ? where location = '"+userlocation+"'",insertdata, function(err, rows) {
		
		sqlconnection.commit();
	}, function(err, rows) {
		
	})
	
}

//locationupdate(0,0,0,0,0,0,0,0,"9.9");
//function test
//testlocationsearch(0,0,0,0,0,0,0,0);
//testlocationsearch(-83.71688312,-70.58441558,	-82.85974026,	-83.14025974,	-79.36623377,	-77.41298701,	-50.92467532,	-69.58701299);
//testlocationsearch(-78.34650456,-74.06079027,	-57.52279635,	-83.69604863,	-65.54711246,	-79.17325228,	-65.38905775,	-72.17629179);
//console.log(query);

function userIn(userid, axis, axisNum){
	console.log("in:",userid);
	
	for(var shoot in userList) {
		if(userList[shoot].id === userid){
			userList[shoot].axis= axis;
			userList[shoot].axisNum = axisNum;
			return;
		}
	}
	
	userList.push({'id' : userid, 'axis' : axis, 'axisNum' : axisNum});
	
	//out_socket.emit('dot',locationstr);
	out_socket.emit('newTicon',{'id' : userid, 'axis' : axis, 'axisNum' : axisNum});
}

function userPush(userid, axis, axisNum){
	var arrlist = ['Aarr','Barr','Carr','Darr'];
	
	//var ranNum = parseInt((Math.random() * 100 % 4) +"");
	//var aranNum = parseInt((Math.random() * 100 % 4) +"");
	//console.log(ranNum);
	
	userIn(userid,arrlist[axis],axisNum);
	
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



io.sockets.on('connection', function (socket) {
	out_socket = socket;
	
	userPush("Ticon",1,1);
	userPush("Ticon2",1,1);


	
    socket.emit('news', 'world');
    socket.on('my other event', function (data) {
        console.log(data);
    });
    
    socket.on('startTicon',function(){
    	socket.emit('initTicon',userList);
    });
    
    socket.on('req',function(data){
    	console.log(data);
    	setTimeout(function(){socket.emit('moveTicon',userList);},3000);
    	
    });
    
  
    socket.on('andtest', function (data) {
        console.log(data);
        /*
        var arrlist = ['Aarr','Barr','Carr','Darr'];
    	
    	
        var d1 = data["id"];
        var d2 = parseInt(data["axis"]);
        var d3 = parseInt(data["axisNum"]);
        
        userIn(d1,arrlist[d2],d3);
        */
        //socket.emit('and',result+'' );
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
        
        /*
        console.log(data["id"]);
        console.log(data["d1"]);
        console.log(data["d2"]);
        console.log(data["d3"]);
        console.log(data["d4"]);
        console.log(data["d5"]);
        console.log(data["d6"]);
        console.log(data["d7"]);
        console.log(data["d8"]);
        */
        
        var d1 = parseFloat(data["90:59:AF:0F:30:CC"]);
        var d2 = parseFloat(data["90:59:AF:0F:3C:B3"]);
        var d3 = parseFloat(data["D0:39:72:A4:96:4D"]);
        var d4 = parseFloat(data["90:59:AF:0F:3D:28"]);
        var d5 = parseFloat(data["D0:39:72:A4:9B:7F"]);
        var d6 = parseFloat(data["D0:39:72:A4:96:35"]);
        var d7 = parseFloat(data["D0:39:72:A4:99:41"]);
        var d8 = parseFloat(data["90:59:AF:0F:3D:A1"]);
        
        testlocationsearch(d1,d2,d3,d4,d5,d6,d7,d8);
        //var result = parseInt(data["d1"]) + parseInt(data["d2"]);
        //socket.emit('and',result+'' );
    });
    
    
});




