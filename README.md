# Gitlab的安装，升级，以及汉化操作说明

注：仅指在CentOS7.4的64位版本上，进行Gitlab的相关安装，升级，汉化说明。

## Gitlab的安装

1. 按顺序执行以下命令：

```
sudo yum install -y curl policycoreutils-python openssh-server
sudo systemctl enable sshd
sudo systemctl start sshd
sudo firewall-cmd --permanent --add-service=http
sudo systemctl reload firewalld
sudo yum install postfix
sudo systemctl enable postfix
sudo systemctl start postfix
```

2. 从清华镜像上下载rpm安装包。

[下载页面](https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/)

[下载地址](https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/gitlab-ce-10.1.4-ce.0.el7.x86_64.rpm)

3. 在服务器上的下载安装包，并执行安装命令。比如：10.1.4版本

```
wget https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/gitlab-ce-10.1.4-ce.0.el7.x86_64.rpm

sudo rpm -i gitlab-ce-10.1.4-ce.0.el7.x86_64.rpm
```

4. 执行配置命令。

```
sudo gitlab-ctl reconfigure
```

完成上述步骤即实现Gitlab的原版安装。

注：如果服务器有专门的数据硬盘，用于存储版本库，请将该硬盘挂载在目录/var/opt下。并请在配置文件/etc/fstab中增加服务器启动自动挂载该数据盘。

## Gitlab的升级（引用以往版本内容，未验证）

1. 从清华镜像上下载rpm安装包。

2. 停止unicorn、sidekiq：

```
sudo gitlab-ctl stop unicorn    
sudo gitlab-ctl stop sidekiq
```

3. 备份数据：

```
sudo gitlab-rake gitlab:backup:create
```

4. 升级安装新的rpm包：

```
sudo rpm -Uvh gitlab-ce-10.1.4-ce.0.el7.x86_64.rpm
```

5. 执行配置命令。

```
sudo gitlab-ctl reconfigure
```

完成上述步骤即实现Gitlab的升级。

## Gitlab的汉化

1. 下载汉化包后上传服务器后解压。

2. 停止Gitlab服务。

```
sudo gitlab-ctl stop
```

3. 备份服务器上的/opt/gitlab/embedded/service/gitlab-rails目录。

注：该目录下的内容主要是web应用部分，也是当前项目仓库的起始版本，也是汉化包要覆盖的目录。
    
4. 将解压后的汉化包覆盖服务器上的/opt/gitlab/embedded/service/gitlab-rails目录。

5. 启动Gitlab服务。

```
sudo gitlab-ctl start
```

6. 重新执行配置命令。

```
sudo gitlab-ctl reconfigure
```

完成上述步骤即实现汉化。

## Gitlab的卸载

1. 查看当前gitlab的安装版本

```
sudo rpm -qa | grep gitlab
```

2. 使用yum方法卸载当前安装版本

sudo rpm -e gitlab-ce-10.1.4-ce.0.el7.x86_64.rpm