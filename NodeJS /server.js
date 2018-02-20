
//calling the packages needed
var express=require('express');
var app=express();
var bodyParser=require('body-parser');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//database connection setup
var mongoose=require('mongoose');
mongoose.connect('mongodb://testdb:test@ds117758.mlab.com:17758/nodeapi')

var port=process.env.PORT || 8282;

//handling the connection event
var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));

db.once('open', function(){
	console.log("DB connection is live");
});

//Test models
var Test=require('./app/models/test');

//creating the routes for the API
var router = express.Router();

router.use(function(req, res, next){
	console.log('testing.....');
	next();
});

//accessed using http://localhost:8282/api
router.get('/', function(req, res){
	res.json({ message: 'testing the api!'});
});


router.route('/test')

	//accessed using localhost:8282/test
	.post(function(req, res){

		var test = new Test();
		test.name=req.body.name;
		
		console.log(test.name);

		test.save(function(err){
			if(err)
				res.send(err);
			res.json({ message: 'test created! '});
		});
	})

	//accessed using localhost:8282/api/test
	.get(function(req, res){
		Test.find(function(err, test){
			if(err)
				res.send(err);
			res.json(test);
		});
	})

router.route('/tests/:test_id')

	//get the test with that id
	.get(function(req,res){
		Test.findById(req.params.test_id, function(err, test){
			if(err)
				res.send(err);
			res.json(test);
		});
	})

	//update the test with this id
	.put(function(res, req){
		Test.findById(req.params.test_id, function(err, test){
			if(err)
				res.send(err);

			test.name=req.body.name;
			test.save(function(err){
				if(err)
					res.send(err);

				res.json({message: " test updated"});
			});
		});
	})

	.delete(function(req, res){
		Test.remove({
			_id: req.params.test_id
		}, function(err, test){
			if(err)
				res.send(err);
			res.json({message: "successfully deleted"});
		});
	});

//register the routes
app.use('/api', router);

//starting the server
app.listen(port);
console.log('Port started '+ port);