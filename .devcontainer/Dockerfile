FROM mcr.microsoft.com/devcontainers/base:trixie

ENV PYTHONUNBUFFERED 1

RUN mkdir -p /home/vscode/.vscode-server/extensions \
    && chown -R vscode:vscode /home/vscode/.vscode-server

USER vscode