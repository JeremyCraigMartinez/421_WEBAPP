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

#need to do
sudo add-apt-repository ppa:nginx/stable
sudo aptitude update
sudo aptitude -y install nginx

sudo adduser deploy --disabled-password

sudo mkdir /home/deploy/.ssh
sudo chown -R deploy /home/deploy/.ssh
sudo chgrp -R deploy /home/deploy/.ssh
sudo chmod -R 700 /home/deploy/.ssh

sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys

sudo chown deploy /home/deploy/.ssh/authorized_keys
sudo chgrp deploy /home/deploy/.ssh/authorized_keys
sudo usermod -a -G deploy jeremy

sudo mkdir -p /opt/www/testapp
sudo chown -R deploy /opt/www/testapp
sudo chgrp -R deploy /opt/www/testapp
sudo chmod -R 775 /opt/www/testapp

sudo rm /etc/nginx/sites-enabled/default
sudo vim /etc/nginx/sites-available/testapp
sudo ln -s /etc/nginx/sites-available/testapp /etc/nginx/sites-enabled/testapp
sudo service nginx start

sudo vim /etc/init.d/unicorn_testapp
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
APP_ROOT=/opt/www/testapp/current
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
sudo chmod 755 /etc/init.d/unicorn_testapp
sudo update-rc.d unicorn_testapp defaults
#CONGRATS! IT IS CONFIGURED!

#Further server configuration
sudo vim /etc/ssh/sshd_config
# PermitRootLogin no
# AllowUsers jeremy deploy
sudo service ssh reload

#need to do

#nginx/unicorn configuration
#maybe capistrano 3? whatever the hell that is

#in seperate terminal 
rails s

#switch terminals
rails g scaffold Server name:string ip_address:string

#establish root in routes.rb (already did)
#styling in scss file for controller for root specicified above^^

git commit -am 'added server scaffolr'
git push #...

#in gemfile
#	gem 'unicorn'
#	gem 'capistrano-rails', group: :development

bundle install
bundle binstubs capistrano

bin/cap install

touch Capfile
echo "require 'capistrano/setup'" >> Capfile
echo "require 'capistrano/deploy'" >> Capfile
echo "require 'capistrano/rails'" >> Capfile
