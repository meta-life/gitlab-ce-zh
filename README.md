# Gitlab的安装，升级，以及汉化操作说明

注：仅指在CentOS6.5的64位版本上，进行Gitlab的相关安装，升级，汉化说明。

## Gitlab的安装

1.按顺序执行以下命令：

```
sudo yum install curl openssh-server openssh-clients postfix cronie    
sudo service postfix start    
sudo chkconfig postfix on    
sudo lokkit -s http -s ssh
```

2.从清华镜像上下载rpm安装包。[下载页面](https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el6/)
注：或直接在服务器上获取。比如：8.16.4版本

```
sudo wget https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el6/gitlab-ce-8.16.4-ce.0.el6.x86_64.rpm
```

3.在服务器上的安装包所在目录执行安装命令。

```
sudo rpm -i gitlab-ce-8.16.4-ce.0.el6.x86_64.rpm
```

4.执行配置命令。

```
sudo gitlab-ctl reconfigure
```

完成上述步骤即实现Gitlab的原版安装。

注：如果服务器有专门的数据硬盘，用于存储版本库，请将该硬盘挂载在目录/var/opt下。并请在配置文件/etc/fstab中增加服务器启动自动挂载该数据盘。

## Gitlab的升级

1.从清华镜像上下载rpm安装包。

```
sudo wget https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el6/gitlab-ce-8.16.4-ce.0.el6.x86_64.rpm
```

2.停止unicorn、sidekiq：

```
sudo gitlab-ctl stop unicorn    
sudo gitlab-ctl stop sidekiq
```

3.备份数据：

```
sudo gitlab-rake gitlab:backup:create
```

4.升级安装新的rpm包：

```
sudo rpm -Uvh gitlab-ce-8.14.0-ce.0.el6.x86_64.rpm
```

5.执行配置命令。

```
sudo gitlab-ctl reconfigure
```

完成上述步骤即实现Gitlab的升级。

## Gitlab的汉化

1.进入目录/opt/gitlab/embedded/service。

```
cd /opt/gitlab/embedded/service
```

2.下载汉化补丁包。[下载链接](https://github.com/marbleqi/gitlab-ce-zh/archive/v8.16.4-zh-patch.zip)

```
sudo wget https://github.com/marbleqi/gitlab-ce-zh/archive/v8.16.4-zh-patch.zip
```

3.解压缩汉化补丁包。

```
sudo unzip v8.16.4-zh-patch
```
解压后的文件会存放在gitlab-ce-zh-8.16.4-zh-patch目录下。

4.停止Gitlab服务。

```
sudo gitlab-ctl stop
```

5.备份/opt/gitlab/embedded/service目录下的gitlab-rails目录。
注：该目录下的内容主要是web应用部分，也是当前项目仓库的起始版本，也是汉化包要覆盖的目录。

```
sudo tar zcvf gitlab-rails-bak.tar.gz gitlab-rails
```
    
6.将解压后的汉化补丁文件覆盖服务器上的/opt/gitlab/embedded/service/gitlab-rails目录。

```
sudo cp -rf gitlab-ce-zh-8.16.4-zh-patch/* gitlab-rails/
```

7.启动Gitlab服务。

```
sudo gitlab-ctl start
```

8.重新执行配置命令。

```
sudo gitlab-ctl reconfigure
```

完成上述步骤即实现汉化。

## Gitlab的卸载

1.查看当前gitlab的安装版本

```
sudo rpm -qa | grep gitlab
```

2.使用rpm命令卸载当前安装版本

```
sudo rpm -e gitlab-ce-8.16.4-ce.0.el6.x86_64
```