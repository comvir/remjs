这是一个模块化框架，它类似于nodejs，用于前端的。已知的比较流行的模块化框架有seajs和requirejs，但是remjs和它们略有不同。
在这个框架下，创建新的模块脚本不需要再将代码写在define中。

例如：
remjs的模块创建方式

//require other module

var mod=require('moduleid');

//interface

module.exports={}

主模块入口

remjs.use('/scripts/modules/main');
