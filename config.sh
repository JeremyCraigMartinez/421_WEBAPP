#on home -> change from 104.236.169.12 to 104.236.169.12
# grep -lr "104.236.169.12:5025" | xargs sed -i 's/104.236.169.12/104.236.169.12/g'
#on server (after pull) -> change from 104.236.169.12 to 104.236.169.12
# grep -lr "localhost:5025" | xargs sed -i 's/localhost/104.236.169.12/g'

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
