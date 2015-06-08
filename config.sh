#on home -> change from 104.236.169.12 to 104.236.169.12
# grep -lr "104.236.169.12:5025" | xargs sed -i 's/104.236.169.12/104.236.169.12/g'
#on server (before push) -> change from 104.236.169.12 to 104.236.169.12
# grep -lr "104.236.169.12:5025" | xargs sed -i 's/104.236.169.12/104.236.169.12/g'

#server configuration details (most) found here:
# http://www.rubytreesoftware.com/resources/securely-setup-ubuntu-1404-server
# http://www.rubytreesoftware.com/resources/ruby-on-rails-41-ubuntu-1404-server-configuration
# http://www.rubytreesoftware.com/resources/ruby-on-rails-41-ubuntu-1404-server-deployment

sudo apt-get update
sudo apt-get upgrade

sudo apt-get install git

#ssh key configuration
mkdir ~/.ssh
ssh-keygen -t rsa -C "jeremymartinez11@gmail.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa

#dependencies for rails app
sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev

#ruby installation
cd
git clone git://github.com/sstephenson/rbenv.git .rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

rbenv install 2.1.5
rbenv global 2.1.5

echo "gem: --no-ri --no-rdoc" > ~/.gemrc
gem install bundler

#rails installation
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs

gem install rails -v 4.2.0

rbenv rehash

git clone git@github.com:JeremyCraigMartinez/421_WEBAPP.git

cd 421_WEBAPP/myapp
bundle install

#for server only. web server configuration
sudo add-apt-repository ppa:nginx/stable
sudo aptitude update
sudo aptitude -y install nginx

sudo adduser deploy --disabled-password

#############################################
#############################################
sudo su - deploy

# install rbenv
git clone https://github.com/sstephenson/rbenv.git ~/.rbenv

# Configure .bashrc file
vim ~/.bashrc

#     # Add to the top of .bashrc
#     export PATH="$HOME/.rbenv/bin:$PATH"
#     eval "$(rbenv init -)"

# install ruby-build 
git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build 

# choose ruby version, install and configure 
rbenv install -l 
rbenv install 2.1.4 
rbenv global 2.1.4 
rbenv rehash 
ruby -v 

# install bundler gem 
gem install bundler --no-ri --no-rdoc 
rbenv rehash 

# exit deploy user
exit

# remove the default nginx site and create a new one
sudo rm /etc/nginx/sites-enabled/default
sudo vim /etc/nginx/sites-available/myapp
: <<'END'
upstream unicorn_myapp {
  server unix:/tmp/unicorn.myapp.sock fail_timeout=0;
}

server {
  listen 80 default deferred;
  server_name myapp.rubytreesoftware.com;
  root /opt/www/myapp/current/public;

  location ~ ^/assets/ {
    gzip_static on;
    expires max;
    add_header Cache-Control public;
  }

  try_files $uri/index.html $uri @unicorn;
  location @unicorn {
    proxy_set_header Host $http_host;  
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_redirect off;
    proxy_pass http://unicorn_myapp;
  }

  error_page 500 502 503 504 /500.html;
  client_max_body_size 4G;
  keepalive_timeout 10;
}
END

# enable your new site
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp

# Start nginx
sudo service nginx start

# setup init script for unicorn
sudo vim /etc/init.d/unicorn_myapp

: <<'END'
#!/bin/sh
### BEGIN INIT INFO
# Provides:          unicorn
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Manage unicorn server
# Description:       Start, stop, restart unicorn server for a specific application.
### END INIT INFO
set -e

# Feel free to change any of the following variables for your app:
TIMEOUT=${TIMEOUT-60}
APP_ROOT=/opt/www/myapp/current
PID=$APP_ROOT/tmp/pids/unicorn.pid
CMD="cd $APP_ROOT; bundle exec unicorn -D -c $APP_ROOT/config/unicorn.rb -E production"
AS_USER=deploy
set -u

OLD_PIN="$PID.oldbin"

sig () {
  test -s "$PID" && kill -$1 `cat $PID`
}

oldsig () {
  test -s $OLD_PIN && kill -$1 `cat $OLD_PIN`
}

run () {
  if [ "$(id -un)" = "$AS_USER" ]; then
    eval $1
  else
    su -c "$1" - $AS_USER
  fi
}

case "$1" in
start)
  sig 0 && echo >&2 "Already running" && exit 0
  run "$CMD"
  ;;
stop)
  sig QUIT && exit 0
  echo >&2 "Not running"
  ;;
force-stop)
  sig TERM && exit 0
  echo >&2 "Not running"
  ;;
restart|reload)
  sig HUP && echo reloaded OK && exit 0
  echo >&2 "Couldn't reload, starting '$CMD' instead"
  run "$CMD"
  ;;
upgrade)
  if sig USR2 && sleep 2 && sig 0 && oldsig QUIT
  then
    n=$TIMEOUT
    while test -s $OLD_PIN && test $n -ge 0
    do
      printf '.' && sleep 1 && n=$(( $n - 1 ))
    done
    echo

    if test $n -lt 0 && test -s $OLD_PIN
    then
      echo >&2 "$OLD_PIN still exists after $TIMEOUT seconds"
      exit 1
    fi
    exit 0
  fi
  echo >&2 "Couldn't upgrade, starting '$CMD' instead"
  run "$CMD"
  ;;
reopen-logs)
  sig USR1
  ;;
*)
  echo >&2 "Usage: $0 "
  exit 1
  ;;
esac
END

# Set permissions for init.d script
sudo chmod 755 /etc/init.d/unicorn_myapp

# Set the init.d script to start on server start
sudo update-rc.d unicorn_myapp defaults
#############################################
#############################################

sudo mkdir /home/deploy/.ssh
sudo chown -R deploy /home/deploy/.ssh
sudo chgrp -R deploy /home/deploy/.ssh
sudo chmod -R 700 /home/deploy/.ssh

sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys

sudo chown deploy /home/deploy/.ssh/authorized_keys
sudo chgrp deploy /home/deploy/.ssh/authorized_keys
sudo usermod -a -G deploy jeremy

sudo mkdir -p /opt/www/myapp
sudo chown -R deploy /opt/www/myapp
sudo chgrp -R deploy /opt/www/myapp
sudo chmod -R 775 /opt/www/myapp

sudo rm /etc/nginx/sites-enabled/default
sudo vim /etc/nginx/sites-available/myapp
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp
sudo service nginx start

sudo vim /etc/init.d/unicorn_myapp
: <<'END'
#!/bin/sh
### BEGIN INIT INFO
# Provides:          unicorn
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Manage unicorn server
# Description:       Start, stop, restart unicorn server for a specific application.
### END INIT INFO
set -e

# Feel free to change any of the following variables for your app:
TIMEOUT=${TIMEOUT-60}
APP_ROOT=/opt/www/myapp/current
PID=$APP_ROOT/tmp/pids/unicorn.pid
CMD="cd $APP_ROOT; bundle exec unicorn -D -c $APP_ROOT/config/unicorn.rb -E production"
AS_USER=deploy
set -u

OLD_PIN="$PID.oldbin"

sig () {
  test -s "$PID" && kill -$1 `cat $PID`
}

oldsig () {
  test -s $OLD_PIN && kill -$1 `cat $OLD_PIN`
}

run () {
  if [ "$(id -un)" = "$AS_USER" ]; then
    eval $1
  else
    su -c "$1" - $AS_USER
  fi
}

case "$1" in
start)
  sig 0 && echo >&2 "Already running" && exit 0
  run "$CMD"
  ;;
stop)
  sig QUIT && exit 0
  echo >&2 "Not running"
  ;;
force-stop)
  sig TERM && exit 0
  echo >&2 "Not running"
  ;;
restart|reload)
  sig HUP && echo reloaded OK && exit 0
  echo >&2 "Couldn't reload, starting '$CMD' instead"
  run "$CMD"
  ;;
upgrade)
  if sig USR2 && sleep 2 && sig 0 && oldsig QUIT
  then
    n=$TIMEOUT
    while test -s $OLD_PIN && test $n -ge 0
    do
      printf '.' && sleep 1 && n=$(( $n - 1 ))
    done
    echo

    if test $n -lt 0 && test -s $OLD_PIN
    then
      echo >&2 "$OLD_PIN still exists after $TIMEOUT seconds"
      exit 1
    fi
    exit 0
  fi
  echo >&2 "Couldn't upgrade, starting '$CMD' instead"
  run "$CMD"
  ;;
reopen-logs)
  sig USR1
  ;;
*)
  echo >&2 "Usage: $0 "
  exit 1
  ;;
esac
END
sudo chmod 755 /etc/init.d/unicorn_myapp
sudo update-rc.d unicorn_myapp defaults
#CONGRATS! IT IS CONFIGURED!

#Further server configuration
sudo vim /etc/ssh/sshd_config
# PermitRootLogin no
# AllowUsers jeremy deploy
sudo service ssh reload

#NEED TO DO~~~~~~~~~~~~~~~~~

#nginx/unicorn configuration
#maybe capistrano 3? whatever the hell that is

#in seperate terminal 
rails s

#switch terminals
rails g scaffold Server name:string ip_address:string

#establish root in routes.rb (already did)
#styling in scss file for controller for root specicified above^^

touch .ruby-version
echo "2.1.5" >> .ruby-version

#in gemfile
#	gem 'unicorn'
#	gem 'capistrano-rails', group: :development
# gem 'capistrano-passenger'

bundle install
bundle binstubs capistrano
bin/cap install

#Add the following below require 'capistrano/deploy' in the Capfile in the root of your app
# require 'capistrano/rails'

#Add / Replace this configuration in config/deploy.rb file
: <<'END'
set :application, 'testapp'
set :repo_url, 'git@github.com:cjamison/testapp.git'
set :deploy_to, '/opt/www/testapp'
set :user, 'deploy'
set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets}

namespace :deploy do

  %w[start stop restart].each do |command|
    desc 'Manage Unicorn'
    task command do
      on roles(:app), in: :sequence, wait: 1 do
        execute "/etc/init.d/unicorn_#{fetch(:application)} #{command}"
      end      
    end
  end

  after :publishing, :restart

end
END

#Alter the configuration in /config/deploy/production.rb with your server ip or domain name
# role :app, %w{deploy@0.0.0.0}
# role :web, %w{deploy@0.0.0.0}
# role :db,  %w{deploy@0.0.0.0}

#Create config/unicorn.rb with the following contents
: <<'END'
root = "/opt/www/testapp/current"
working_directory root
pid "#{root}/tmp/pids/unicorn.pid"
stderr_path "#{root}/log/unicorn.log"
stdout_path "#{root}/log/unicorn.log"

listen "/tmp/unicorn.testapp.sock"
worker_processes 1
timeout 30
END

sudo vim /home/deploy/.bashrc
export SECRET_KEY_BASE=[REPLACE WITH YOUR SECRET]

# restart nginx
sudo service nginx restart

sudo chown -R deploy /opt/www/myapp
sudo usermod -a -G jeremy deploy

# Run some pre-checks
bin/cap production git:check
bin/cap production deploy:check

# DEPLOY!!!
bin/cap production deploy

# if you need to run db:seed
# log into server as the deploy user and run the following
cd /opt/www/testapp/current ; bin/rake RAILS_ENV=production db:seed

# if you are having problems, try running a console on the server
# log in as deploy user and run the following
cd /opt/www/testapp/current ; bin/rails c production
