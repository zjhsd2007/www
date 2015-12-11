/**
 * Created by jhzhang on 2015/8/21.
 */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    runSequence = require('gulp-run-sequence'),
    copy = require('gulp-copy'),
    cssBase64 = require('gulp-css-base64'),
    del = require('del'),
    browsersync = require('browser-sync').create(),
    mock = require('mockjs');

var DEVELOPMENT = true;
var argvs = process.argv.slice(3);
var projectName = argvs[0].slice(2);
var port = argvs[1] && argvs[1].slice(2) || 8080;
var basePath = './'+ projectName;
var srcPath = basePath +'/src';
var buildPath = basePath + '/build';
var dataTpl = require(srcPath + '/data');
var config = require(srcPath + '/config');
var createResData = function(data,status,msg){
    return {
        msg:msg||'',
        status:status||200,
        data:data || null
    }
}
/****************************server****************************/
gulp.task('server',['sass'],function(){
    browsersync.init({
        server:{
            baseDir: srcPath,
            middleware:[
                function(req,res,next){
                    var reg = /(?:^.+\/)*([^\.]+)\.json$/,data,tpl;
                    if(DEVELOPMENT && reg.test(req.originalUrl)){
                        data = createResData(mock.mock(dataTpl[RegExp.$1.replace('/','')]));
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(data));
                    }else{
                        next();
                    }
                }
            ]
        },
        port:port
        //files:'./**/*.*'
    });
    
    gulp.watch(srcPath +'/sass/*.scss',['sass']);
    gulp.watch(srcPath +"/*.html").on('change', browsersync.reload);
});

gulp.task('sass',function(){
    gulp.src(srcPath +'/sass/index.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error',sass.logError))
        .pipe(cssBase64())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(srcPath + '/css'))
        .pipe(browsersync.stream({match: '**/*.css'}))
});
gulp.task('watch',function(){
    gulp.watch(srcPath +'/sass/*.scss',['sass']);
});
/**************************build****************************/
/**clean**/
gulp.task('clean',function(){
    del.sync(buildPath);
})
/**copy**/
var vendorJS = config.vendorJS.map(function(js){ return srcPath +'/'+js}),
    vendorCSS = config.vendorCSS.map(function(css){ return srcPath + '/' + css}),
    copyFiles = vendorJS.concat(vendorCSS).concat([srcPath+'/**/*.html',srcPath+'/images/**/*.*',srcPath+'/css/**/*.css',srcPath+'/js/**/*.js']);
gulp.task('copy',['sass'],function(){
    return gulp.src(copyFiles)
    .pipe(copy(buildPath,{prefix:2}));
});
/**compress**/
gulp.task('compress',['compress:css','compress:js']);
gulp.task('compress:css',function(){
    return gulp.src(buildPath +'/css/**/*.css',{base:buildPath})
        .pipe(minifyCss())
        .pipe(gulp.dest(buildPath));
});

gulp.task('compress:js',function(){
    return gulp.src(buildPath +'/js/**/*.js',{base:buildPath})
        .pipe(uglify())
        .pipe(gulp.dest(buildPath));
});
/**build**/
gulp.task('build',function(){
    runSequence('clean','copy','compress');
});
