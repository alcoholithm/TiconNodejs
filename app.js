
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();


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
	    var locationstr;
	    var max=0.0;
	    rows.forEach(function(row){
	    	
	    	var temp = 1 / (1 +Math.sqrt(Math.pow((d1 - row.lo1),2) + Math.pow((d2 - row.lo2),2) + Math.pow((d3 - row.lo3),2) + Math.pow((d4 - row.lo4),2) +
	    					Math.pow((d5 - row.lo5),2) + Math.pow((d6 - row.lo6),2) + Math.pow((d7 - row.lo7),2) + Math.pow((d8 - row.lo8),2) ));
	    	
	    	//console.log(temp);
	    	
	    	if(max < temp){
	    		max = temp
	    		locationstr = row.location.toString();
	    	}
	    	
	    });
	    
	    console.log(locationstr);
	    //sqlrows.json(rows);
	});
}

//testlocationsearch(0,0,0,0,0,0,0,0);
//testlocationsearch(-83.71688312,-70.58441558,	-82.85974026,	-83.14025974,	-79.36623377,	-77.41298701,	-50.92467532,	-69.58701299);
//testlocationsearch(-78.34650456,-74.06079027,	-57.52279635,	-83.69604863,	-65.54711246,	-79.17325228,	-65.38905775,	-72.17629179);
//console.log(query);



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

var io = require('socket.io').listen(httpserver);

io.sockets.on('connection', function (socket) {
	
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
    
    socket.on('req',function(data){
    	console.log(data);
    	var arrlist = ['Aarr','Barr','Carr','Darr'];
    	
    	var ranNum = parseInt((Math.random() * 100 % 4) +"");
    	var aranNum = parseInt((Math.random() * 100 % 4) +"");
    	console.log(ranNum);
    	setTimeout(function(){socket.emit('test',{id:"Ticon",axis:arrlist[ranNum],axisNum:aranNum});},3000);
    	//socket.emit('test',{id:"Ticon",axis:arrlist[ranNum],axisNum:aranNum});
    });
    
    socket.on('andtest', function (data) {
        console.log(data);
        console.log(data["d1"]);
        console.log(data["d2"]);
        var result = parseInt(data["d1"]) + parseInt(data["d2"]);
        socket.emit('and',result+'' );
    });
    
    socket.on('locationsearch', function (data) {
        console.log(data);
        console.log(data["id"]);
        console.log(data["d1"]);
        console.log(data["d2"]);
        console.log(data["d3"]);
        console.log(data["d4"]);
        console.log(data["d5"]);
        console.log(data["d6"]);
        console.log(data["d7"]);
        console.log(data["d8"]);
        
        var d1 = parseFloat(data["d1"]);
        var d2 = parseFloat(data["d2"]);
        var d3 = parseFloat(data["d3"]);
        var d4 = parseFloat(data["d4"]);
        var d5 = parseFloat(data["d5"]);
        var d6 = parseFloat(data["d6"]);
        var d7 = parseFloat(data["d7"]);
        var d8 = parseFloat(data["d8"]);
        
        testlocationsearch(d1,d2,d3,d4,d5,d6,d7,d8);
        //var result = parseInt(data["d1"]) + parseInt(data["d2"]);
        //socket.emit('and',result+'' );
    });
    
    
});




