FROM mcr.microsoft.com/devcontainers/ruby:3.1-bullseye

RUN gem install rails webdrivers 

ENV RAILS_DEVELOPMENT_HOSTS=".githubpreview.dev,.app.github.dev"

ARG NODE_VERSION="lts/*"
RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"

ARG USERNAME=vscode
RUN mkdir -p /home/$USERNAME/.vscode-server/extensions \
    && chown -R $USERNAME \
    /home/$USERNAME/.vscode-server