exports.index = function(req, res){
  console.log('teste');
  res.render('index', { title: 'SNODEJS - Manager Spaces' });
};