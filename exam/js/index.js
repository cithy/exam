/**
 * Created by Inspiron14-3442 on 2016/9/22.
 */

$(function(){
   //实现导航
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function(){
        $(".baseUI>li>ul").slideUp();
        $(this).next().slideDown(300);
    });
    $(".baseUI>li>ul>li").on("click",function(){
        $(".baseUI>li>ul>li").removeClass("current");
        $(this).addClass("current");
    });
    //模拟点击
    $(".baseUI>li>ul>li>a").eq(0).trigger("click");
    //默认收起全部并且展示第一个
    $(".baseUI>li>ul").slideUp();
    $(".baseUI>li>a").eq(0).trigger("click");
});


//核心模块
angular.module("app",["ng","ngRoute","app.subject","app.paper"])
    .controller("mainCtrl",["$scope",function($scope) {

    }])
    //路由配置
    .config(["$routeProvider",function($routeProvider){
        /*
        * a 类型id
        * b 难度id
        * c 方向id
        * d 知识点id
        * */
        $routeProvider.when("/AllSubject/a/:a/b/:b/c/:c/d/:d",{
            templateUrl:"tpl/subject/subjectleft.html",
            controller:"subjectController"
        })/*.when("/SubjectManger",{
            templateUrl:"tpl/subject/subjectManger.html",
            controller:"subjectController"
        })*/
        .when("/SubjectAdd",{
            templateUrl:"tpl/subject/addsubject.html",
            controller:"subjectController"
        }).when("/SubjectDel/id/:id",{
            templateUrl:"tpl/subject/subjectleft.html",
            controller:"subjectDelController"
        }).when("/SubjectCheck/id/:id/state/:state",{
            templateUrl:"tpl/subject/subjectleft.html",
            controller:"subjectCheckController"
        })
        .when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level", {
            templateUrl: "tpl/paper/paperAdd.html",
            controller: "paperAddController"
        }).when("/PaperManager", {
            templateUrl: "tpl/paper/paperManager.html",
            controller: "PaperManagerController"
        }).when("/PaperSubjectList", {
            templateUrl: "tpl/paper/subjectleft.html",
            controller: "subjectController"
        })
    }]);


