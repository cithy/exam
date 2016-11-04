/**
 * Created by Inspiron14-3442 on 2016/9/22.
 * 题目管理模块
 */
angular.module("app.subject",["ng"])
    .controller("subjectCheckController",["$routeParams","subjectService","$location",
        function($routeParams,subjectService,$location){
            subjectService.checkSubject($routeParams.id,$routeParams.state,function(data){
                //发生跳转getAllDepartm
                alert(data);
    })

        $location.path("/AllSubject/a/0/b/0/c/0/d/0");
}])
.controller("subjectDelController",["$routeParams","subjectService","$location",
    function($routeParams,subjectService,$location){
        var flag = confirm("确认删除吗？");
        if(flag){
            var id = $routeParams.id;
            subjectService.delSubject(id,function(data){
                alert(data);
            })
        }
        $location.path("/AllSubject/a/0/b/0/c/0/d/0");
    }])
    .controller("subjectController",["$scope","commonService","subjectService","$routeParams","$location",
        function($scope,commonService,subjectService,$routeParams,$location){
            //将路由参数绑定在作用域中
            $scope.params =$routeParams;
            //添加页面绑定的对象
            $scope.subject={
                typeId:3,
                levelId:1,
                departmentId:1,
                topicId:1,
                stem:"",
                answer:"",
                fx:"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };
            //保存并继续部分
            $scope.submit=function(){
                subjectService.saveSubject($scope.subject,function(data){
                    alert(data);
                });

                //当提交完成后绑定的值恢复到原来的值（重置）
                var subject={
                    typeId:3,
                    levelId:1,
                    departmentId:1,
                    topicId:1,
                    stem:"",
                    answer:"",
                    fx:"",
                    choiceContent:[],
                    choiceCorrect:[false,false,false,false]
                };
                angular.copy(subject,$scope.subject);
            };
            //保存并关闭部分
            $scope.submitAndcolse=function() {
                subjectService.saveSubject($scope.subject, function (data) {
                    alert(data);
                });
                //保存后跳转到列表页面
                $location.path("/AllSubject/a/0/b/0/c/0/d/0")
            }
            //获取所有题目类型，题目所属方向，题目所属知识点,题目难度级别
            commonService.getAllTypes(function(data){
                $scope.types=data;
            });
            commonService .getAllLevels(function(data){
                $scope.levels=data;
            });
            commonService .getAllDepartments(function(data){
                $scope.departments=data;
            });
            commonService .getAllTpcios(function(data){
                $scope.topics=data;
            });
            //获取所有的题目信息
            subjectService.getAllSubject($routeParams,function(data){
                data.forEach(function(subject){
                    var answer=[];
                    //为每个选项添加ABCD
                    subject.choices.forEach(function(choice,index){
                        choice.no=commonService.convertIndexToNo(index);
                    });
                    //当题目为单选或为多选时，修改subject,choice
                    if('subject.subjectType.id' !=3){
                        subject.choices.forEach(function(choice){
                            if(choice.correct){
                                answer.push(choice.no);
                            }
                        });
                        //修改当前题目的answer
                        subject.answer=answer.toString();
                    }
                });
                $scope.subjects=data;
            });
        }])
    .service("subjectService",["$http","$httpParamSerializer",function($http,$httpParamSerializer){
        this.checkSubject=function(id,state,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    'subject.id':id,
                    'subject.checkState':state
                }
            }).success(function(data){
                handler(data);
            });
        };
        this.delSubject=function(id,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    'subject.id':id
                }
            }).success(function(data){
                handler(data);
            });
        };
        //保存题目信息数据处理
        this.saveSubject=function(params,handler){
            var obj={};
            for(key in params){
                var val=params[key];
                switch(key){
                    case "typeId":obj['subject.subjectType.id']=val;
                        break;
                    case "levelId":obj['subject.subjectLevel.id']=val;
                        break;
                    case "departmentId":obj['subject.subjectdepartment.id']=val;
                        break;
                    case   "topicId":obj['subject.topic.id']=val;
                        break;
                    case "stem":obj['subject.stem']=val;
                        break;
                    case "answer":obj['subject.answer']=val;
                        break;
                    case "fx":obj['subject.analysis']=val;
                        break;
                    case "choiceContent":obj['choiceContent']=val;
                        break;
                    case "choiceCorrect":obj['choiceCorrect']=val;
                        break;
                }
            }
            //对obj对象进行表单格式序列化操作（默认json格式）
            obj = $httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }).success(function(data){
                handler(data);
            });
        };
        //提取题目所有信息
        this.getAllSubject=function(params,handler) {
            var data={};
            //循环遍历将data装换为后台能够识别的筛选对象
            for(var key in params){
                var val = params[key];
                //只有当val不等于0的时候才设置筛选属性
                if(val!=0){
                    switch (key){
                        case "a":data['subject.subjectType.id']=val;
                            break;
                        case "b":data['subject.subjectLevel.id']=val;
                            break;
                        case "c":data['subject.department.id']=val;
                            break;
                        case "d":data['subject.topic.id']=val;
                            break;
                    }
                }
            }
            /* $http.get("data/subject.json",{
             params:data,
             }).success(function(data){*/
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action", {
                params: data
            }).success(function (data) {
                handler(data);
            });
        }
    }])
    .factory("commonService",["$http",function($http){
        return {
            //通过index（0,1,2,3）获取所对应的序号（ABCD）
            convertIndexToNo:function(index){
                return   index==0?'A':(index==1?'B':(index==2?'C':(index==3?'D':'E')));
            },
            getAllTypes: function (handler) {
                $http.get("data/types.json").success(function (data) {
                    // $http.get("http://172.16.0.5:7777/test" +"/exam/manager/getAllSubjectType.action").success(function(data){
                    handler(data);
                });
            },
            getAllLevels: function(handler) {
                // $http.get("data/levels.json").success(function (data) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                    handler(data);
                });

            },
            getAllDepartments:function(handler){
               // $http.get("data/departments.json").success(function(data){
                   $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function(data){
                    handler(data);
                });
            },
            getAllTpcios:function(handler){
               // $http.get("data/tpcios.json").success(function(data){
               $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function(data){
                    handler(data);
                });
            }

        };
    }])
    //过滤出与所属方向的知识点
    .filter("selectTopics",function(){
        //input要过滤的内容 ID方向ID
    return function(input ,id) {
        if (input) {//当input存在执行
            //Arry.prototype.filter进行过滤
            var result = input.filter(function (item) {
                return item.department.id == id;
            });
            //将过滤后的内容返回
            return result;
        }
    }
}).directive("selectOption",function(){
    return{
        restrict:"A",
        link:function(scope,element){
            element.on("change",function(){
                var type = $(this).attr("type");//获取当前函数type属性
                var val = $(this).val();
                var isCheck = $(this).prop("checked");
                //设置值
                if(type=="radio"){
                    //重置
                    scope.subject.choiceCorrect=[false,false,false,false];
                   // alert(type+"--"+val);
                    for(var i=0;i<4;i++){
                        if(i==val){
                        scope.subject.choiceCorrect[i]=true;
                        }
                    }
                }else if(type=="checkbox"){
                    for (var i = 0; i < 4; i++) {
                        if (i == val) {
                            scope.subject.choiceCorrect[i]=true;
                        }
                    }
                }
                //强制消化
                scope.$digest();
            });
        }
    }
});
