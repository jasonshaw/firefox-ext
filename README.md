# firefox-ext
自制firefox扩展

这里主要存放我自己自制自用的firefox扩展

第一个：batchimagedownloader

最新版下载地址人工置顶 ：

最新更新 2.1.0 链接: 链接: http://pan.baidu.com/s/1mgBmn92 密码: myp2  12.22更新
增强支持设置将下载地址保存为文件




重要提醒：
1.本扩展是基于自定义的配置文件实现下载的，每个批量下载必须要在配置文件中预先配置，并设定好保存的目录才能下载，否则就是不成功的。
2.本扩展自带的几个配置，比如moko yesky之类的，是我自己根据我的需要设置，其批量下载的起始页是要满足规则中的正则的。
比如：moko 的规则，要求起始页是 某个 展示的列表页 并且选择按时间排序，例如：http://www.moko.cc/post/aishangzhen/new/1.html
可以查看配置文件中startReg可以看出，给出的测试页就是正好满足这个条件的，如果有别的需求需要自行配置。

自己经常下载图片，每次都要手动非常麻烦，使用了batchdownloader，saveimages都不能完全满足我的要求，
于是乎，利用自己对js的浅薄认识，就自己动手弄了，一个扩展，在28下，自己使用还是很好的
后来更新到了30就无法使用了，于是我坛上求教，@ywzhaiqi  @Oos 的提示，让我做了适当的修改就有了现在支持29+的版本
发布第一版之后，看了一些大神的扩展比如uAutoPage.uc Redirector.uc等等，觉得我的版本可以很好精简和扩展，于是大踏步的修改和增强了一下

说明本人绝对是菜鸟，高手不喜可以自行制作，给像我一样的懒人图片收集爱好者。

原版的功能只能实现ｍｏｋｏ　ｙｅｓｋｙ两个指定网站的图片下载（我本来只对ｍｏｋｏ批量下载有需要，有一个软件作者弄了一个非常小气【穷人】要钱才给下载，于是一直想自己弄一个，完全免费的）

功能说明：
1、实现pic网站（其实只是下载，如果不是pic，能获得下载权限的也是适用的）批量下载
2、配置外置，支持自定义，自定义网站规则说明在默认配置文件中，固定位置在chrome/Local/下，默认自带只有ｍｏｋｏ　ｙｅｓｋｙ两个网页的支持
3、支持online编辑配置规则，不需要重启或者寻路打开配置文件
4、支持免重启，加载最新配置规则
5、支持真正意义上的任意时刻中止批量下载（比如当出现下载文件超多，会造成等待时间较长，临时有事，可以随时中止）——尚不支持暂停（不知道该怎么做）


安装使用说明：
1.安装xpi
2.将_batchimagedownloader.js放入chrome文件夹下Local目录中
3.扩展安装好会出现在地址栏
4.左键：自动批量下载，右键：配置下载路径和重复文件规则
中键：当出错时，中止扩展运行，alt+左键：在线编辑_batchimagedownloader.js文件
alt+右键：重载_batchimagedownloader.js文件配置（免重启Firefox）
4.1 初次使用请务必先右键设置保存路径，否则会出错
5.默认_batchimagedownloader.js文件中只有moko和yesky两条规则，可以任意扩充，其中有说明。
6.测试地址：
//game.yesky.com/tupian/165/37968665all.shtml
//www.moko.cc/post/xiemengxz/new/1.html
//www.moko.cc/post/xiaxiaowei/new/1.html
//www.moko.cc/post/clqianqian/new/1.html
//pic.kdslife.com/content_107357_4_list.html
//http://bbs.voc.com.cn/forumdisplay.php?fid=50

未来希望和bug：
//17.能支持保存一定量的几天之内的下载的url，提示是否需要重复下载（下载的url如何编码记录在本地-尚未实现）
//18.配置文件中设置的参数类型没有经过严格检查（未实现）
//19.如果能像uAutoPager那样提供规则定制的助手就更无敌了，但是这个实在太难，暂时不弄了


下载地址：

最新更新 2.1.0 链接: 链接: http://pan.baidu.com/s/1mgBmn92 密码: myp2  12.22更新
增强：增加保存为迅雷下载列表文件 .downlist , 默认还是依靠ff下载即可，不影响原功能。
使用环境：当不希望浏览器占用资源过高，或者当下载资源很多的时候 ，可以在配置文件中增加save2file参数，设置为true，会将解析完成保存在已经设置的默认目录下，迅雷下载list文件（每行一个下载地址的文本文件），这样就可以双击直接用迅雷任意下载了，可以任意时刻下载，也可以借用迅雷实现定时关机之类的，对于下载的慢的，还能移动到末尾，先小的快的先下载
预告：如果能找到xthunder，完全控制迅雷下载的话，未来考虑直接调用迅雷下载，实现更灵活的下载

bug：修复2.0版本逻辑问题，调整子目录创建逻辑，使之更合理。


10.12更新(推荐更新，喜欢分类收集图片的坛友建议更新）
add:
1、文件下载的目标目录不存在时能够自动创建，便于设置后，又有更名或者删除操作造成不能正常下载的问题
2、支持多模式、多组合的子目录定义，
a、支持创建以域名子目录
b、支持创建以起始页标题子目录
c、支持创建以时间子目录
d、支持创建以日期子目录（与c组合）
e、支持自定义任意名作为子目录，每次保存提示是否创建子目录
a~d 支持任意组合，e与a~d 互斥（其实也可以任意组合，我觉得有点乱，就认为设置互斥
2.0 链接: http://pan.baidu.com/s/1mgxDzRU 密码: ckwn
bug：修复逻辑问题，调整子目录创建逻辑，使之更合理。
最新更新 2.0.1 链接: http://pan.baidu.com/s/11v8EM 密码: co5u
测试地址：
//game.yesky.com/tupian/165/37968665all.shtml
//www.moko.cc/post/xiemengxz/new/1.html
//www.moko.cc/post/xiaxiaowei/new/1.html
//www.moko.cc/post/clqianqian/new/1.html
//http://sc.chinaz.com/tag_jiaoben/jquery.html
//pic.kdslife.com/content_107357_4_list.html
//http://bbs.voc.com.cn/forumdisplay.php?fid=50

补充说明：与firespider.uc.js的差别，回答坛友的问题：
Q：楼主我这里有一个贴吧大神写的uc脚本功能跟你的很像啊，看看可不可以把规则合并下？我看了下貌似有点一样
A:firespider 也很强大
但是我的扩展跟它有一些不同
1、我的页码支持自定义函数获取，比如当有些页码比较多的时候， 1 2 。。。21，这样的我的可以通过函数获取最大页码，然后再返回所有分页的url，而firespider的url必须通过第一个css 选择器直接从href中捕获，必须是链接才可以
2、我的页码因为支持自定义函数，对于存在相对路径的情况下，依然能自动补全智能的获得正确的url（当然子集，图片的链接也一样可以
3、firespider的逻辑是从小图寻找对应的大图，而我的扩展重点在于，从 所有分页-》所有子集-》子集中所有图片，最明显的区别是，一个小图对应一个大图，而我的，是一个子集对应任意多个图片（或者任意可以下载的资源，比如压缩包）
4、firespider默认的配置文件的现成规则都是一些国外的网站，我一个也没玩过（我孤陋寡闻啦哈），我的扩展主要针对国内比较流行的图库网站，比如moko等等，当然两个都可以自定义
5、我的扩展无论分页、子集、图片的捕获规则都支持function，这样可以最大限度的适应各种情况，即使是直接用css selector，也支持设定捕获对象之后，以何种属性作为最终的捕获对象，比如firespider，设定小图的css selector为#img 那么只能捕获src这个属性，而我的支持任意属性，比如moko网站任意子集页面里面的图片并非写在src，而是src2，为的是可以延时lazyload加载，比如新浪的也是采用lazyload，图片的文件地址都不在src里面，我的扩展就可以很好的适应这种功能
6、firespider，我看到最新版还支持一些功能，比如规则辅助定制，或者能将规则显示列表之类的，都比较强大，目前还没有钻研明白，所以我的扩展还没有加上这些增强的功能，但是基本上我自己用起来很够用，等有时间再考虑是否加强。
7、还有其他区别，我还没有多试验firespider

基于上面的，两者不方便合并，但是如果有大神能将两个融合一下，也欢迎。

特别鸣谢：
@cinhoo @ywzhaiqi @Oos 等大神，对我各种问题的指点。

旧版本备忘、备查：
发布的第一版地址：
http://bbs.kafan.cn/thread-1754104-1-1.html
发布的第二版地址：
http://bbs.kafan.cn/thread-1756495-1-1.html
发布的第三版地址：
http://bbs.kafan.cn/thread-1777291-1-1.html

紧急修复：
fixed：误操作导致图片路径错误，现已修复，感谢大神的测试和指出，对已经下载使用的表示抱歉
新版：链接: http://pan.baidu.com/s/1gd7oYEv 密码: qzml

7.17更新
bug fixed：修复单一起始页使用错误
配置文件增加：chinaz jquery插件批量下载（不只是图片批量下载也可以支持任意能直接下载下来的文件）
链接: http://pan.baidu.com/s/1c0laztQ 密码: wa5f
测试地址：
//game.yesky.com/tupian/165/37968665all.shtml
//www.moko.cc/post/xiemengxz/new/1.html
//www.moko.cc/post/xiaxiaowei/new/1.html
//www.moko.cc/post/clqianqian/new/1.html
//http://sc.chinaz.com/tag_jiaoben/jquery.html

8.3更新(自选更新，跟我一样有洁癖的建议更新）
bug fixed：修复浏览器打开时如果是 about:* 页面 会在错误控制台报错的bug（使用上没有任何影响）
update:更换了按钮图标（与batchdownload区别一下，也不影响使用)
链接：http://pan.baidu.com/s/1mgzD8Ru 密码：w299


链接: http://pan.baidu.com/s/1i3kmuS9 密码: nw8b

10.7更新(推荐更新，喜欢经常自己配置的人建议更新）
bug fixed：修复当默认配置的目录不存在时的bug，增加target 目录的存在性检查
add:扩展增加支持debug模式，在配置中只要设置debug:true,即可
配置文件增加：kds 模特图库 和voc 华声论坛贴图版 图库批量下载
链接: http://pan.baidu.com/s/1mgBQ2MW 密码: lytm
测试地址：
//game.yesky.com/tupian/165/37968665all.shtml
//www.moko.cc/post/xiemengxz/new/1.html
//www.moko.cc/post/xiaxiaowei/new/1.html
//www.moko.cc/post/clqianqian/new/1.html
//http://sc.chinaz.com/tag_jiaoben/jquery.html
//pic.kdslife.com/content_107357_4_list.html
//http://bbs.voc.com.cn/forumdisplay.php?fid=50
